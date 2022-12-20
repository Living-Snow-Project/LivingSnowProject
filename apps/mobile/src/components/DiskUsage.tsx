import React, { useEffect } from "react";
import { Button } from "native-base";
import {
  // deleteAsync,
  documentDirectory,
  getInfoAsync,
  readDirectoryAsync,
} from "expo-file-system";

type DiskUsageState = {
  state: "Calculating" | "Error Calculating" | "Completed";
  files: number;
  bytes: number;
};

type DiskUsageProps = {
  setLabel: (value: string) => void;
};

export default function DiskUsage({ setLabel }: DiskUsageProps) {
  const computeLabel = ({ state, files, bytes }: DiskUsageState) => {
    if (state != "Completed") {
      return setLabel(state);
    }

    // convert bytes to MB\GB
    let displaySize = `${bytes} bytes`;
    const megabyte = 1048576;
    const gigabyte = 1048576000;

    if (bytes > gigabyte) {
      displaySize = `${(bytes / gigabyte).toFixed(2)} GB`;
    } else if (bytes > megabyte) {
      displaySize = `${(bytes / megabyte).toFixed(2)} MB`;
    }

    return setLabel(`${displaySize} / ${files} photos`);
  };

  useEffect(() => {
    computeLabel({ state: "Calculating", files: 0, bytes: 0 });

    if (!documentDirectory) {
      return;
    }

    readDirectoryAsync(documentDirectory)
      .then((files) => {
        let bytes = 0;

        files
          .reduce(
            (prev, current) =>
              getInfoAsync(`${documentDirectory}/${current}`).then((info) => {
                if (info.size) {
                  bytes += info.size;
                }
              }),
            Promise.resolve(0)
          )
          .then(() =>
            computeLabel({ state: "Completed", files: files.length, bytes })
          );
      })
      .catch(() =>
        computeLabel({ state: "Error Calculating", files: 0, bytes: 0 })
      );
  }, []);

  return (
    <Button height="8" py="1">
      Clear
    </Button>
  );
}
