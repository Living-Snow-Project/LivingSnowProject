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
  topImage: {
    flex: 1,
  },
  image: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: "black",
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
  // TODO: prefer to scale images based on its dominant axis
  // which means the server needs to store height, width
  const height = Dimensions.get("screen").height * 0.75;

  if (photos === undefined || photos.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 2,
        margin: 2,
      }}
    >
      <View
        style={{
          borderColor: "black",
          borderBottomWidth: 1,
          backgroundColor: "lightblue",
        }}
      >
        <Text style={{ textAlign: "center" }}>
          {Labels.RecordFields.Photos}
        </Text>
      </View>
      <View style={{ flex: photos.length, flexDirection: "column" }}>
        {photos.map((photo, index) => (
          <View
            style={[
              index === 0 ? styles.topImage : styles.image,
              {
                width: "100%",
                height,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
            /* eslint-disable react/no-array-index-key */
            key={index}
          >
            <CachedPhoto uri={photo.uri} />
          </View>
        ))}
      </View>
    </View>
  );
}
