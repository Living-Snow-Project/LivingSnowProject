import React from "react";
import { AlgaeRecordV3 } from "@livingsnow/record";
import { PhotosResponseV2 } from "@livingsnow/network";
import { PhotosApi } from "@livingsnow/network";

function TableHeader() {
  return (
    <thead>
      <tr className="table-header">
        <th>Summary</th>
        <th>Environmental Details</th>
        <th>Images</th>
        <th>DNA Sequence</th>
      </tr>
    </thead>
  );
}

function FormatImages(photos: PhotosResponseV2) {
  return (
    <div>
      {/* Photos Section */}
      {photos.appPhotos && photos.appPhotos.length > 0 && (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Photos</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {photos.appPhotos.map((item, index) => {
              const fullImageUrl = PhotosApi.getAppPhotoUrl(item.uri);
              const thumbnailUrl = PhotosApi.getAppPhotoThumbnailUrl(item.uri);
              return (
                <img
                  key={index}
                  src={thumbnailUrl}
                  alt={`Photo ${index + 1}`}
                  style={{
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  onClick={() => window.open(fullImageUrl, "_blank")}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Micrographs Section */}
      {photos.micrographs && photos.micrographs.length > 0 && (
        <div
          style={{
            marginTop:
              photos.appPhotos && photos.appPhotos.length > 0 ? "16px" : "0",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Micrographs
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {photos.micrographs.map((item, index) => {
              const fullImageUrl = PhotosApi.getMicrographUrl(item.uri);
              const thumbnailUrl = PhotosApi.getMicrographThumbnailUrl(
                item.uri,
              );
              return (
                <img
                  key={index}
                  src={thumbnailUrl}
                  alt={`Micrograph ${index + 1}`}
                  style={{
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  onClick={() => window.open(fullImageUrl, "_blank")}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

type TableRowProps = {
  item: AlgaeRecordV3;
  photos: PhotosResponseV2;
  dnaSequence?: string;
  onClick?: () => void;
};

function TableRow({ item, photos, dnaSequence, onClick }: TableRowProps) {
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
        {item.type !== "Sighting" && (
          <div className="summary-item">
            <span className="summary-label">Tube ID:</span>
            <span className="summary-value">{item.tubeId || "N/A"}</span>
          </div>
        )}
        <div className="summary-item">
          <span className="summary-label">Size:</span>
          <span className="summary-value">{item.size || "N/A"}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Colors:</span>
          <span className="summary-value">{renderColors() || "N/A"}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Coordinates:</span>
          <span className="summary-value">{`${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`}</span>
        </div>
      </div>
    );
  };

  const renderEnvironmentalDetails = () => {
    return (
      <div className="summary-content">
        {item.isOnGlacier !== undefined && (
          <div className="summary-item">
            <span className="environmental-label">On Glacier:</span>
            <span className="summary-value">
              {item.isOnGlacier ? "Yes" : "No"}
            </span>
          </div>
        )}
        {item.isOnGlacier !== undefined &&
          item.isOnGlacier &&
          item.seeExposedIceOrWhatIsUnderSnowpack && (
            <div className="summary-item">
              <span className="environmental-label">See Exposed Ice?:</span>
              <span className="summary-value">
                {item.seeExposedIceOrWhatIsUnderSnowpack}
              </span>
            </div>
          )}
        {item.isOnGlacier !== undefined &&
          !item.isOnGlacier &&
          item.seeExposedIceOrWhatIsUnderSnowpack && (
            <div className="summary-item">
              <span className="environmental-label">
                What is Under Snowpack?:
              </span>
              <span className="summary-value">
                {item.seeExposedIceOrWhatIsUnderSnowpack}
              </span>
            </div>
          )}
        {item.snowpackDepth && (
          <div className="summary-item">
            <span className="environmental-label">Snowpack Depth:</span>
            <span className="summary-value">{item.snowpackDepth}</span>
          </div>
        )}
        {item.bloomDepth && (
          <div className="summary-item">
            <span className="environmental-label">Bloom Depth:</span>
            <span className="summary-value">{item.bloomDepth}</span>
          </div>
        )}
        {item.impurities && item.impurities.length > 0 && (
          <div className="summary-item">
            <span className="environmental-label">Impurities:</span>
            <span className="summary-value">{item.impurities.join(", ")}</span>
          </div>
        )}
        {item.locationDescription && (
          <div className="summary-item">
            <span className="environmental-label">Location Description:</span>
            <span className="summary-value">{item.locationDescription}</span>
          </div>
        )}
        {item.notes && (
          <div className="summary-item">
            <span className="environmental-label">Notes:</span>
            <span className="summary-value">{item.notes}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <tr
      className="table-row"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 0.2s ease",
      }}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.05)";
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <td className="summary-cell">{renderSummary()}</td>
      <td className="environmental-details-cell">
        {renderEnvironmentalDetails()}
      </td>
      <td className="photos-cell">{FormatImages(photos)}</td>
      <td className="dna-cell">{dnaSequence || ""}</td>
    </tr>
  );
}

export { TableHeader, TableRow };
