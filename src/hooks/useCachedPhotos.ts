import { useEffect, useState } from "react";
import {
  documentDirectory,
  downloadAsync,
  getInfoAsync,
} from "expo-file-system";
import { downloadPhotoUri } from "../lib/Network";

const useCachedPhotos = (photos: Photo[] | undefined): Photo[] | undefined => {
  if (photos === undefined) {
    return undefined;
  }

  const [cachedPhotos, setCachedPhotos] = useState<Photo[]>([...photos]);

  const updateCachedPhotos = (index: number, uri: string): void => {
    setCachedPhotos((prev) => {
      /* eslint-disable no-param-reassign */
      prev[index].uri = uri;

      return [...prev];
    });
  };

  useEffect(() => {
    photos.forEach(async (photo, index) => {
      // no action if static\compiled photo from require(...) OR file already cached
      if (typeof photo.uri === "number" || photo.uri.includes("file:///")) {
        return;
      }

      const fileUri = `${documentDirectory}${photo.uri}.jpg`;

      const fileInfo = await getInfoAsync(fileUri);

      // photo not cached locally, download required
      if (!fileInfo.exists) {
        downloadAsync(downloadPhotoUri(photo.uri), fileUri).then((result) => {
          if (result.status === 200) {
            updateCachedPhotos(index, fileUri);
          }
        });
      } else {
        updateCachedPhotos(index, fileUri);
      }
    });
  }, []);

  return cachedPhotos;
};

export default useCachedPhotos;
