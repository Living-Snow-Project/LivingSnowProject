import { File, Paths } from "expo-file-system";
import { ImageManipulator } from "expo-image-manipulator";
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
  const localFileUri = `${Paths.document.uri}${uri}.jpg`;
  const fileCacheKey = `${uri}_${width}_${height}`;
  const resizedLocalFileUri = `${Paths.document.uri}${fileCacheKey}.jpg`;

  const resizeAndCache = async (): Promise<CachedPhotoResult> => {
    // manipulate() is very slow and results in UI locks
    // this also creates another file in the /cache directory :(
    // TODO: try to delete files in the /cache directory?
    const manipulated = ImageManipulator.manipulate(localFileUri);

    // save resized photo to disk
    const manipulatedUri = (
      await (
        await manipulated.resize({ width, height }).renderAsync()
      ).saveAsync()
    ).uri;

    const manipulatedFile = new File(manipulatedUri);
    const resizedFile = new File(resizedLocalFileUri);

    // TODO: apparently move() can throw
    manipulatedFile.move(resizedFile);

    const base64uri = `data:image/jpg;base64,${resizedFile.base64Sync()}`;
    cachedPhotos.set(fileCacheKey, base64uri);

    // delete the downloaded file
    const downloaded = new File(localFileUri);
    downloaded.delete();

    return { uri: base64uri, state: "Loaded" };
  };

  // no action if static photo from require(...) or photo already on disk (pending photos scenario or still in RecordScreen first time)
  if (typeof uri == "number" || uri.includes("file:///")) {
    return { uri, state: "Loaded" };
  }

  const remoteFileUri = PhotosApi.getAppPhotoUrl(uri);

  // can't save photo to disk, force download
  if (Paths.document == null) {
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
  const resized = new File(resizedLocalFileUri);

  // resized photo already written to disk (but not in memory cache)
  if (resized.info().exists) {
    const diskBase64 = resized.base64Sync();

    const base64uri = `data:image/jpg;base64,${diskBase64}`;

    cachedPhotos.set(fileCacheKey, base64uri);

    return { uri: base64uri, state: "Loaded" };
  }

  const local = new File(localFileUri);

  // original photo already written to disk (but not in memory cache)
  if (local.info().exists) {
    return resizeAndCache();
  }

  const { isConnected } = await NetInfo.fetch();

  // photo doesn't exist locally; it must be downloaded
  // however, downloadAsync spins infinitely if app is offline (in Expo 44)
  // check Network status before initiating download
  if (!isConnected) {
    return { uri: remoteFileUri, state: "Offline" };
  }

  try {
    await File.downloadFileAsync(remoteFileUri, new File(localFileUri));
  } catch (error) {
    // download failed, photo unresolved
    return { uri: remoteFileUri, state: "Error" };
  }

  return resizeAndCache();
}
