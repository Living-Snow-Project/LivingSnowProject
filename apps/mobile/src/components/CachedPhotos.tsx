import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Photo } from "@livingsnow/record";
import { Labels } from "../constants/Strings";
import useCachedPhoto from "../hooks/useCachedPhotos";
import { PictureIcon } from "./Icons";

const styles = StyleSheet.create({
  fullSizeImage: {
    width: "100%",
    height: "100%",
  },
  photosContainer: {
    margin: 2,
  },
  photosHeader: {
    borderColor: "black",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 1,
    backgroundColor: "lightblue",
  },
  photoCommon: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  topPhoto: {
    flex: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
  photo: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 4,
  },
});

type CachedPhotoProps = {
  uri: string | number;
};

function CachedPhoto({ uri }: CachedPhotoProps) {
  const cachedPhoto = useCachedPhoto(uri);

  // require(...) scenario returns number
  // alternative is to write the file to disk on load but that duplicates data and needs a "resource manager"
  if (typeof cachedPhoto === "number") {
    return <Image style={styles.fullSizeImage} source={cachedPhoto} />;
  }

  if (cachedPhoto.includes("Loading")) {
    return (
      <>
        <Text>{cachedPhoto}</Text>
        <ActivityIndicator
          style={{ paddingTop: 5 }}
          size="large"
          color="lightgrey"
        />
      </>
    );
  }

  if (cachedPhoto.includes("error") || cachedPhoto.includes("Offline")) {
    return (
      <>
        <Text>{cachedPhoto}</Text>
        <PictureIcon />
      </>
    );
  }

  return <Image style={styles.fullSizeImage} source={{ uri: cachedPhoto }} />;
}

type CachedPhotosProps = {
  photos: undefined | Photo[];
};

export default function CachedPhotos({ photos }: CachedPhotosProps) {
  if (photos === undefined || photos.length === 0) {
    return null;
  }

  const { width } = Dimensions.get("screen");

  return (
    <View style={styles.photosContainer}>
      <View style={styles.photosHeader}>
        <Text style={{ textAlign: "center" }}>
          {Labels.RecordFields.Photos}
        </Text>
      </View>
      {photos.map((photo, index) => (
        <View
          style={[
            styles.photoCommon,
            index === 0 ? styles.topPhoto : styles.photo,
            {
              height: Math.floor(width * (photo.height / photo.width)),
            },
          ]}
          /* eslint-disable react/no-array-index-key */
          key={index}
        >
          <CachedPhoto uri={photo.uri} />
        </View>
      ))}
    </View>
  );
}
