import {
  documentDirectory,
  downloadAsync,
  getInfoAsync,
} from "expo-file-system";
import { manipulateAsync } from "expo-image-manipulator";
import NetInfo from "@react-native-community/netinfo";
import { downloadPhotoUri } from "@livingsnow/network";

export type CachedPhotoResult = {
  uri: string | number;
  state: "Loaded" | "Loading" | "Downloading" | "Offline" | "Error";
};

export type PhotoToCache = {
  uri: string | number;
  width: number;
  height: number;
};

// TODO: this implementation of a memory cache would likely be problematic if the app saw a lot of usage
// FlatList loads\unloads components, results in flicker loading images scrolling back up, so cache images in memory
const cachedPhotos: Map<string, string> = new Map<string, string>();

export async function getCachedPhoto({
  uri,
  width,
  height,
}: PhotoToCache): Promise<CachedPhotoResult> {
  const resizeAndCache = async (
    localFileUri: string,
    fileCacheKey: string
  ): Promise<CachedPhotoResult> => {
    const resized = await manipulateAsync(
      localFileUri,
      [{ resize: { width, height } }],
      { base64: true }
    );

    // TODO: save resized.uri to disk (currently in cacheDirectory and would need to be written to documentDirectory)

    const base64uri = `data:image/jpg;base64,${resized.base64}`;
    cachedPhotos.set(fileCacheKey, base64uri);

    return { uri: base64uri, state: "Loaded" };
  };

  // no action if static photo from require(...)
  if (typeof uri == "number") {
    return { uri, state: "Loaded" };
  }

  // photo already exists on disk (pending photos scenario)
  if (uri.includes("file:///")) {
    return { uri, state: "Loaded" };
  }

  const remoteFileUri = downloadPhotoUri(uri);

  // can't save photo to hard drive
  if (documentDirectory == null) {
    return { uri: remoteFileUri, state: "Loaded" };
  }

  const localFileUri = `${documentDirectory}/${uri}.jpg`;
  const fileCacheKey = `${uri}_${width}_${height}`;

  // is in memory cache?
  const cachedBase64 = cachedPhotos.get(fileCacheKey);

  if (cachedBase64) {
    return {
      uri: cachedBase64,
      state: "Loaded",
    };
  }

  // TODO: is resized file on disk
  // then use readAsStringAsync() instead of doing manipulateAsync() again

  const { exists } = await getInfoAsync(localFileUri);
  // photo already written to disk (but not in memory cache)
  if (exists) {
    return resizeAndCache(localFileUri, fileCacheKey);
  }

  const { isConnected } = await NetInfo.fetch();

  // photo doesn't exist locally; it must be downloaded
  // however, downloadAsync spins infinitely if app is offline (in Expo 44), so check Network status
  if (!isConnected) {
    return { uri: remoteFileUri, state: "Offline" };
  }

  const { status } = await downloadAsync(remoteFileUri, localFileUri);

  if (status == 200) {
    return resizeAndCache(localFileUri, fileCacheKey);
  }

  return { uri: remoteFileUri, state: "Error" };
}
