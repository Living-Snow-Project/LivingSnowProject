import { useEffect, useState } from "react";
import {
  documentDirectory,
  downloadAsync,
  getInfoAsync,
} from "expo-file-system";
import { manipulateAsync } from "expo-image-manipulator";
import NetInfo from "@react-native-community/netinfo";
import { downloadPhotoUri } from "@livingsnow/network";

// TODO: this implementation of a memory cache would likely be problematic if the app saw a lot of usage
// FlatList loads\unloads components, results in flicker loading images scrolling back up, so cache images in memory
const cachedPhotos: Map<string, string> = new Map<string, string>();

type CachedPhotoResult = {
  uri: string | number;
  state: "Loaded" | "Loading" | "Downloading" | "Offline" | "Error";
};

type UseCachedPhotoArgs = {
  uri: string | number;
  width: number;
  height: number;
};

const useCachedPhoto = ({
  uri,
  width,
  height,
}: UseCachedPhotoArgs): CachedPhotoResult => {
  const [cachedPhoto, setCachedPhoto] = useState<CachedPhotoResult>({
    uri,
    state: "Loading",
  });

  useEffect(() => {
    let isMounted = true;
    const setCachedPhotoWrapper = (state: CachedPhotoResult) => {
      if (isMounted) {
        setCachedPhoto(state);
      }
    };

    const resizeAndCache = async (
      localFileUri: string,
      fileCacheKey: string
    ) => {
      const resized = await manipulateAsync(
        localFileUri,
        [{ resize: { width, height } }],
        { base64: true }
      );

      const base64uri = `data:image/jpg;base64,${resized.base64}`;
      cachedPhotos.set(fileCacheKey, base64uri);

      setCachedPhotoWrapper({ uri: base64uri, state: "Loaded" });
    };

    (async function CachePhotoAsync() {
      // no action if static photo from require(...)
      if (typeof uri == "number") {
        setCachedPhotoWrapper({ uri, state: "Loaded" });
        return;
      }

      // photo already exists on disk (pending photos scenario)
      if (uri.includes("file:///")) {
        setCachedPhotoWrapper({ uri, state: "Loaded" });
        return;
      }

      const remoteFileUri = downloadPhotoUri(uri);

      // can't save photo to hard drive
      if (documentDirectory == null) {
        setCachedPhotoWrapper({ uri: remoteFileUri, state: "Loaded" });
        return;
      }

      const localFileUri = `${documentDirectory}/${uri}.jpg`;
      const fileCacheKey = `${uri}_${width}_${height}`;

      // is in memory cache?
      const cachedBase64 = cachedPhotos.get(fileCacheKey);

      if (cachedBase64) {
        setCachedPhotoWrapper({
          uri: cachedBase64,
          state: "Loaded",
        });
        return;
      }

      try {
        const { exists } = await getInfoAsync(localFileUri);

        // photo already written to disk (but not in memory cache)
        if (exists) {
          resizeAndCache(localFileUri, fileCacheKey);
          return;
        }

        // photo doesn't exist locally; it must be downloaded
        // however, downloadAsync spins infinitely if app is offline (in Expo 44), so check Network status
        const { isConnected } = await NetInfo.fetch();

        if (!isConnected) {
          setCachedPhotoWrapper({ uri: remoteFileUri, state: "Offline" });
          return;
        }

        const { status } = await downloadAsync(remoteFileUri, localFileUri);

        if (status == 200) {
          resizeAndCache(localFileUri, fileCacheKey);
          return;
        }

        setCachedPhotoWrapper({ uri: remoteFileUri, state: "Error" });
      } catch (error) {
        setCachedPhotoWrapper({ uri: remoteFileUri, state: "Error" });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [uri, width, height]);

  return cachedPhoto;
};

export default useCachedPhoto;
