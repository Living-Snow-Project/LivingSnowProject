import { useEffect, useState } from "react";
import {
  documentDirectory,
  downloadAsync,
  getInfoAsync,
} from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";
import { downloadPhotoUri } from "../lib/Network";

const useCachedPhoto = (uri: string | number): string | number => {
  const [cachedPhoto, setCachedPhoto] = useState<string | number>("Loading");

  useEffect(() => {
    let isMounted = true;
    (async function GetPhoto() {
      // no action if static photo from require(...)
      if (typeof uri === "number") {
        if (isMounted) {
          setCachedPhoto(uri);
        }

        return;
      }

      const remoteFileUri = downloadPhotoUri(uri);

      // can't cache photo to hard drive
      if (documentDirectory === null) {
        if (isMounted) {
          setCachedPhoto(remoteFileUri);
        }

        return;
      }

      const localFileUri = `${documentDirectory}${uri}.jpg`;

      try {
        const { exists } = await getInfoAsync(localFileUri);

        // photo already cached
        if (exists) {
          if (isMounted) {
            setCachedPhoto(localFileUri);
          }

          return;
        }

        const { isConnected } = await NetInfo.fetch();

        if (!isConnected) {
          if (isMounted) {
            setCachedPhoto("Offline: cannot download photo");
          }

          return;
        }

        // downloadAsync spins infinitely if app is offline
        const { status } = await downloadAsync(remoteFileUri, localFileUri);

        if (status === 200) {
          if (isMounted) {
            setCachedPhoto(localFileUri);
          }

          return;
        }

        if (isMounted) {
          setCachedPhoto(`There was an error downloading the file: ${status}`);
        }
      } catch (error) {
        if (isMounted) {
          setCachedPhoto(`There was an error caching the file: ${error} `);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return cachedPhoto;
};

export default useCachedPhoto;
