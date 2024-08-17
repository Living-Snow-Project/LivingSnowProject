import {
  copyAsync,
  documentDirectory,
  downloadAsync,
  getInfoAsync,
  readAsStringAsync,
} from "expo-file-system";
import { manipulateAsync } from "expo-image-manipulator";
import NetInfo from "@react-native-community/netinfo";
import { PhotosApi } from "@livingsnow/network";

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
  const localFileUri = `${documentDirectory}/${uri}.jpg`;
  const fileCacheKey = `${uri}_${width}_${height}`;
  const resizedLocalFileUri = `${documentDirectory}/${fileCacheKey}.jpg`;

  const resizeAndCache = async (): Promise<CachedPhotoResult> => {
    // this call is very slow and results in UI locks
    const resized = await manipulateAsync(
      localFileUri,
      [{ resize: { width, height } }],
      { base64: true },
    );

    // save resized photo to disk
    await copyAsync({ from: resized.uri, to: resizedLocalFileUri });

    const base64uri = `data:image/jpg;base64,${resized.base64}`;
    cachedPhotos.set(fileCacheKey, base64uri);

    return { uri: base64uri, state: "Loaded" };
  };

  // no action if static photo from require(...) or photo already on disk (pending photos scenario)
  if (typeof uri == "number" || uri.includes("file:///")) {
    return { uri, state: "Loaded" };
  }

  const remoteFileUri = PhotosApi.getAppPhotoUrl(uri);

  // can't save photo to disk, force download
  if (documentDirectory == null) {
    return { uri: remoteFileUri, state: "Loaded" };
  }

  // photo in memory cache?
  const cachedBase64 = cachedPhotos.get(fileCacheKey);

  if (cachedBase64) {
    return {
      uri: cachedBase64,
      state: "Loaded",
    };
  }

  // resized photo on disk?
  const { exists } = await getInfoAsync(resizedLocalFileUri);

  // resized photo already written to disk (but not in memory cache)
  if (exists) {
    const diskBase64 = await readAsStringAsync(resizedLocalFileUri, {
      encoding: "base64",
    });

    const base64uri = `data:image/jpg;base64,${diskBase64}`;

    cachedPhotos.set(fileCacheKey, base64uri);

    return { uri: base64uri, state: "Loaded" };
  }

  const localExists = await getInfoAsync(localFileUri);

  // original photo already written to disk (but not in memory cache)
  if (localExists.exists) {
    return resizeAndCache();
  }

  const { isConnected } = await NetInfo.fetch();

  // photo doesn't exist locally; it must be downloaded
  // however, downloadAsync spins infinitely if app is offline (in Expo 44)
  // check Network status before initiating download
  if (!isConnected) {
    return { uri: remoteFileUri, state: "Offline" };
  }

  const { status } = await downloadAsync(remoteFileUri, localFileUri);

  if (status == 200) {
    return resizeAndCache();
  }

  // download failed, photo unresolved
  return { uri: remoteFileUri, state: "Error" };
}
