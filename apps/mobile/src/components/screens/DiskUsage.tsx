import React, { useEffect, useState } from "react";
import { Button } from "native-base";
import {
  deleteAsync,
  documentDirectory,
  getInfoAsync,
  readDirectoryAsync,
} from "expo-file-system";
import { Modal } from "../feedback";
import { Labels, TestIds } from "../../constants";

type DiskUsageState = {
  state: "Calculating" | "Error Calculating" | "Completed" | "Error Deleting";
  files: number;
  bytes: number;
};

type DiskUsageProps = {
  setLabel: (value: string) => void;
};

export function DiskUsage({ setLabel }: DiskUsageProps) {
  const [isOpen, setIsOpen] = useState(false);

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
                // @ts-ignore apparently FileInfo lost some typings
                if (info.uri.includes(".jpg") && info.size) {
                  // @ts-ignore
                  bytes += info.size;
                }
              }),
            Promise.resolve(0),
          )
          .then(() =>
            // subtract 1 to account for AppSettings
            computeLabel({
              state: "Completed",
              files: files.length - 1,
              bytes,
            }),
          );
      })
      .catch(() =>
        computeLabel({ state: "Error Calculating", files: 0, bytes: 0 }),
      );
    // hook only runs on mount with local computeLabel and no unstable deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deletePhotos = () => {
    if (!documentDirectory) {
      return;
    }

    readDirectoryAsync(documentDirectory)
      .then((files) => {
        files
          .reduce((prev, current) => {
            if (current.includes(".jpg")) {
              return deleteAsync(`${documentDirectory}/${current}`);
            }

            return Promise.resolve();
          }, Promise.resolve())
          .then(() => computeLabel({ state: "Completed", files: 0, bytes: 0 }));
      })
      .catch(() =>
        computeLabel({ state: "Error Deleting", files: 0, bytes: 0 }),
      );
  };

  return (
    <>
      <Modal
        header={Labels.Modal.DiskUsage.header}
        body={Labels.Modal.DiskUsage.body}
        isOpen={isOpen}
        testId={TestIds.Modal.DiskUsageDeletePhotos}
        setIsOpen={setIsOpen}
        onConfirm={deletePhotos}
      />
      <Button height="8" py="1" onPress={() => setIsOpen(true)}>
        {Labels.Empty}
      </Button>
    </>
  );
}
