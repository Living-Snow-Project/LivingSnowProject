import React, { useEffect, useState } from "react";
import { Button } from "tamagui";
import { Directory, Paths } from "expo-file-system";
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

    if (!Paths.document.uri) {
      return;
    }

    let bytes = 0;
    let files = 0;
    const contents = new Directory(Paths.document.uri).list();

    for (let i = 0; i < contents.length; i++) {
      if (contents[i] instanceof Directory) {
        continue;
      }

      files++;
      const file = contents[i];

      if (file.uri.includes(".jpg") && file.size) {
        bytes += file.size;
      }
    }

    // subtract 1 to account for AppSettings
    computeLabel({
      state: "Completed",
      files: files - 1,
      bytes,
    });
  }, []);

  const deletePhotos = () => {
    if (!Paths.document.uri) {
      return;
    }

    const contents = new Directory(Paths.document.uri).list();

    for (let i = 0; i < contents.length; i++) {
      if (contents[i] instanceof Directory) {
        continue;
      }

      const file = contents[i];

      if (file.uri.includes(".jpg")) {
        file.delete();
      }
    }

    computeLabel({
      state: "Completed",
      files: 0,
      bytes: 0,
    });
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
      <Button height={32} paddingVertical={4} onPress={() => setIsOpen(true)}>
        {Labels.Empty}
      </Button>
    </>
  );
}
