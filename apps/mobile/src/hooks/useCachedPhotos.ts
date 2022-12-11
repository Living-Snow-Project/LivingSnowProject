import { useEffect, useState } from "react";
import {
  documentDirectory,
  downloadAsync,
  getInfoAsync,
} from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";
import { downloadPhotoUri } from "@livingsnow/network";

/* TODO:
1. take width, height paramters
2. construct uri that includes width and height
3. resize image to width and height, save to disk, and return that image's uri when requested
4. if that doesn't solve flicker in FlatList, try the following:
   a. replace FlatList with NativeBase FlatList (which we'll do any way)
   b. make an in-memory cache with base64 version of image to pass to Image with uri: "data:image\jpeg;base64,abc...xyz"
*/
type CachedPhotoResult = {
  uri: string | number;
  state: "Loaded" | "Loading" | "Downloading" | "Offline" | "Error";
};

type UseCachedPhotoProps = {
  uri: string | number;
  width?: number;
  height?: number;
};
const useCachedPhoto = ({
  uri,
  width,
  height,
}: UseCachedPhotoProps): CachedPhotoResult => {
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

    (async function CachePhotoAsync() {
      // no action if static photo from require(...)
      if (typeof uri === "number") {
        setCachedPhotoWrapper({ uri, state: "Loaded" });
        return;
      }

      const remoteFileUri = downloadPhotoUri(uri);

      // can't cache photo to hard drive
      if (documentDirectory === null) {
        setCachedPhotoWrapper({ uri: remoteFileUri, state: "Loaded" });
        return;
      }

      // photo already exists on disk
      if (uri.includes("file:///")) {
        setCachedPhotoWrapper({ uri, state: "Loaded" });
        return;
      }

      // TODO: construct `${documentDirectory}/${uri}_${width}_${height}.jpg
      const localFileUri = `${documentDirectory}${uri}.jpg`;

      try {
        const { exists } = await getInfoAsync(localFileUri);

        // photo already cached
        if (exists) {
          setCachedPhotoWrapper({ uri: localFileUri, state: "Loaded" });
          return;
        }

        const { isConnected } = await NetInfo.fetch();

        if (!isConnected) {
          setCachedPhotoWrapper({ uri: remoteFileUri, state: "Offline" });
          return;
        }

        // downloadAsync spins infinitely if app is offline
        const { status } = await downloadAsync(remoteFileUri, localFileUri);

        if (status === 200) {
          // TODO: resize image
          setCachedPhotoWrapper({ uri: localFileUri, state: "Loaded" });
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
  }, []);

  return cachedPhoto;
};

export default useCachedPhoto;
