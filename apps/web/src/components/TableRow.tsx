import React, { useState, useRef } from "react";
import { AlgaeRecord } from "@livingsnow/record";
import { PhotosResponseV2 } from "@livingsnow/network";
import { PhotosApi, RecordsApiV2 } from "@livingsnow/network";
import { MicrographResponse } from "@livingsnow/network";

function TableHeader() {
  return (
    <thead>
      <tr
        style={{
          backgroundColor: "grey",
        }}
      >
        <td>Date</td>
        <td>Name</td>
        <td>Type</td>
        <td>Tube Id</td>
        <td>Coordinates</td>
        <td>Size</td>
        <td>Colors</td>
        <td>Description</td>
        <td>Notes</td>
        <td>Photos</td>
        <td>DNA Sequence</td>
        <td>Micrographs</td>
      </tr>
    </thead>
  );
}

function FormatPhotos(photos: PhotosResponseV2) {
  if (!photos.appPhotos) {
    return "";
  }

  return photos.appPhotos.map((item, index) => (
    <div key={index}>
      <a
        target={"_blank"}
        rel="noopener noreferrer"
        href={PhotosApi.getAppPhotoUrl(item.uri)}
      >
        {index + 1}
      </a>
    </div>
  ));
}

function FormatMicrographs(
  micrographs: MicrographResponse[] | undefined,
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleUpload: () => void,
  file: File | null,
  fileInputRef: React.RefObject<HTMLInputElement>,
) {
  return (
    <div>
      {micrographs && micrographs.length > 0 ? (
        micrographs.map((item, index) => (
          <div key={index}>
            <a
              target={"_blank"}
              rel="noopener noreferrer"
              href={PhotosApi.getMicrographUrl(item.uri)}
            >
              {index + 1}
            </a>
          </div>
        ))
      ) : (
        <div></div>
      )}
      <input
        type="file"
        accept="image/jpeg"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ marginTop: "10px" }}
      />
      <button onClick={handleUpload} disabled={!file}>
        Upload Micrograph
      </button>
    </div>
  );
}

type TableRowProps = {
  style: React.CSSProperties;
  item: AlgaeRecord;
  photos: PhotosResponseV2;
  dnaSequence?: string;
  onUploadSuccess: () => void;
};

function TableRow({
  style,
  item,
  photos,
  dnaSequence,
  onUploadSuccess,
}: TableRowProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      RecordsApiV2.postMicrograph(item.id, file)
        .then(() => {
          console.log("Micrograph uploaded successfully");
          onUploadSuccess();
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        })
        .catch((error) => {
          console.error("Error uploading micrograph:", error);
        });
    }
  };

  let name = item.name || `Anonymous`;
  name = name.concat(item.organization ? ` (${item.organization})` : ``);

  const renderColors = () => {
    if (!item.colors) {
      return "";
    }

    return item.colors.reduce(
      (prev, cur, index) => (index ? `${prev} ${cur}` : cur),
      "",
    );
  };

  return (
    <tr style={style}>
      <td>{item.date.toDateString()}</td>
      <td>{item.name}</td>
      <td>{item.type}</td>
      <td>{item.tubeId || ``}</td>
      <td>{`${item.latitude}, ${item.longitude}`}</td>
      <td>{item.size || ``}</td>
      <td>{renderColors()}</td>
      <td>{item.locationDescription || ``}</td>
      <td>{item.notes || ``}</td>
      <td>{FormatPhotos(photos)}</td>
      <td>{dnaSequence || ""}</td>
      <td>
        {FormatMicrographs(
          photos.micrographs,
          handleFileChange,
          handleUpload,
          file,
          fileInputRef,
        )}
      </td>
    </tr>
  );
}

export { TableHeader, TableRow };
