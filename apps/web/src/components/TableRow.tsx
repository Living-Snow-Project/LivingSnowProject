import React, { useState, useRef } from "react";
import { AlgaeRecord } from "@livingsnow/record";
import { PhotosResponseV2 } from "@livingsnow/network";
import { PhotosApi, RecordsApiV2 } from "@livingsnow/network";
import { MicrographResponse } from "@livingsnow/network";

function TableHeader() {
  return (
    <thead>
      <tr className="table-header">
        <th>Summary</th>
        <th>Notes</th>
        <th>Description</th>
        <th>Photos</th>
        <th>Micrographs</th>
        <th>DNA Sequence</th>
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
  item: AlgaeRecord;
  photos: PhotosResponseV2;
  dnaSequence?: string;
  onUploadSuccess: () => void;
};

function TableRow({
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

  const renderColors = () => {
    if (!item.colors) {
      return "";
    }

    return item.colors.reduce(
      (prev, cur, index) => (index ? `${prev} ${cur}` : cur),
      "",
    );
  };

  const renderSummary = () => {
    return (
      <div className="summary-content">
        <div className="summary-item">
          <span className="summary-label">Date:</span>
          <span className="summary-value">{item.date.toDateString()}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Name:</span>
          <span className="summary-value">{item.name || "N/A"}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Type:</span>
          <span className="summary-value">{item.type}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Tube ID:</span>
          <span className="summary-value">{item.tubeId || "N/A"}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Coordinates:</span>
          <span className="summary-value">{`${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Size:</span>
          <span className="summary-value">{item.size || "N/A"}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Colors:</span>
          <span className="summary-value">{renderColors() || "N/A"}</span>
        </div>
      </div>
    );
  };

  return (
    <tr className="table-row">
      <td className="summary-cell">{renderSummary()}</td>
      <td className="notes-cell">{item.notes || ""}</td>
      <td className="description-cell">{item.locationDescription || ""}</td>
      <td className="photos-cell">{FormatPhotos(photos)}</td>
      <td className="micrographs-cell">
        {FormatMicrographs(
          photos.micrographs,
          handleFileChange,
          handleUpload,
          file,
          fileInputRef,
        )}
      </td>
      <td className="dna-cell">{dnaSequence || ""}</td>
    </tr>
  );
}

export { TableHeader, TableRow };
