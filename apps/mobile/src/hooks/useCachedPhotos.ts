import { useEffect, useState } from "react";
import {
  PhotoToCache,
  CachedPhotoResult,
  getCachedPhoto,
} from "../lib/CachedPhotoLoader";

export const useCachedPhoto = (photo: PhotoToCache): CachedPhotoResult => {
  const [cachedPhoto, setCachedPhoto] = useState<CachedPhotoResult>({
    uri: photo.uri,
    state: "Loading",
  });

  useEffect(() => {
    let isMounted = true;

    getCachedPhoto(photo).then(({ uri, state }) => {
      if (isMounted) {
        setCachedPhoto({ uri, state });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [photo.uri, photo.width, photo.height]);

  return cachedPhoto;
};
