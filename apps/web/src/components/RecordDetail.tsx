import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AlgaeRecordV3 } from "@livingsnow/record";
import { RecordsApiV3, PhotosResponseV2, PhotosApi } from "@livingsnow/network";
import { getAccessToken } from "../index";

function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [record, setRecord] = useState<AlgaeRecordV3 | null>(null);
  const [photos, setPhotos] = useState<PhotosResponseV2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has admin role
  const isAdmin = () => {
    if (!isAuthenticated || !accounts[0]) return false;
    const roles = accounts[0].idTokenClaims?.roles;
    return Array.isArray(roles) && roles.includes("LivingSnowProject.Admin");
  };

  // Handle photo deletion
  // TODO: this is not correct for handling micrographs, which will almost never be deleted most likely
  // for now I just deleted the ability to delete micrographs from those jpegs
  const handleDeletePhoto = async (
    photoId: string,
    photoType: "appPhotos" | "micrographs",
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      // Token is now cached and automatically managed
      const accessToken = await getAccessToken();
      const response = await PhotosApi.deletePhoto(photoId, accessToken);

      if (response.ok) {
        // Remove the photo from the local state
        setPhotos((currentPhotos) => {
          if (!currentPhotos) return null;

          const updatedPhotos = { ...currentPhotos };
          if (photoType === "appPhotos") {
            updatedPhotos.appPhotos =
              updatedPhotos.appPhotos?.filter(
                (photo) => photo.uri !== photoId,
              ) || [];
          } else {
            updatedPhotos.micrographs =
              updatedPhotos.micrographs?.filter(
                (photo) => photo.uri !== photoId,
              ) || [];
          }
          return updatedPhotos;
        });

        alert("Photo deleted successfully");
      } else {
        throw new Error(`Failed to delete photo: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo. Please try again.");
    }
  };

  // Handle record deletion
  const handleDeleteRecord = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entire record? This action cannot be undone and will delete all associated photos.",
    );

    if (!confirmed) return;

    try {
      // Token is now cached and automatically managed
      const accessToken = await getAccessToken();
      const response = await RecordsApiV3.deleteRecord(record!.id, accessToken);

      if (response.ok) {
        alert("Record deleted successfully");
        navigate("/"); // Navigate back to records list
      } else {
        throw new Error(`Failed to delete record: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete record. Please try again.");
    }
  };

  // Handle file selection for micrograph upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadFile(event.target.files[0]);
    }
  };

  // Handle micrograph upload
  const handleUploadMicrograph = async () => {
    if (!uploadFile || !record) return;

    setUploading(true);
    try {
      await RecordsApiV3.postMicrograph(record.id, uploadFile);

      // Refresh the record data to show the new micrograph
      const response = await RecordsApiV3.getById(record.id);
      setPhotos(response.photos);

      // Reset upload state
      setUploadFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Micrograph uploaded successfully");
    } catch (error) {
      console.error("Error uploading micrograph:", error);
      alert("Failed to upload micrograph. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("No record ID provided");
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        setLoading(true);

        const response = await RecordsApiV3.getById(id);

        setRecord(response);
        setPhotos(response.photos);
      } catch (err) {
        setError("Failed to fetch record");
        console.error("Error fetching record:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderImages = () => {
    if (!photos) return null;

    return (
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            marginBottom: "16px",
            color: "#374151",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Images
        </h3>

        {/* Photos Section */}
        {photos.appPhotos && photos.appPhotos.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                marginBottom: "12px",
                color: "#6b7280",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Photos
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {photos.appPhotos.map((item, index) => {
                const fullImageUrl = PhotosApi.getAppPhotoUrl(item.uri);
                const thumbnailUrl = PhotosApi.getAppPhotoThumbnailUrl(
                  item.uri,
                );
                return (
                  <div
                    key={index}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={thumbnailUrl}
                      alt={`Photo ${index + 1}`}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        cursor: "pointer",
                        borderRadius: "8px",
                        border: "2px solid #e5e7eb",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => window.open(fullImageUrl, "_blank")}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "#3b82f6";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                    {isAdmin() && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(item.uri, "appPhotos");
                        }}
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "4px",
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#b91c1c";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#dc2626";
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Micrographs Section */}
        {photos.micrographs && photos.micrographs.length > 0 && (
          <div>
            <h4
              style={{
                marginBottom: "12px",
                color: "#6b7280",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Micrographs
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {photos.micrographs.map((item, index) => {
                const fullImageUrl = PhotosApi.getMicrographUrl(item.uri);
                const thumbnailUrl = PhotosApi.getMicrographThumbnailUrl(
                  item.uri,
                );
                return (
                  <div
                    key={index}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={thumbnailUrl}
                      alt={`Micrograph ${index + 1}`}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        cursor: "pointer",
                        borderRadius: "8px",
                        border: "2px solid #e5e7eb",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => window.open(fullImageUrl, "_blank")}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "#3b82f6";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(!photos.appPhotos || photos.appPhotos.length === 0) &&
          (!photos.micrographs || photos.micrographs.length === 0) && (
            <p style={{ color: "#6b7280", fontStyle: "italic" }}>
              No images available
            </p>
          )}
      </div>
    );
  };

  const renderField = (
    label: string,
    value: any,
    type: "text" | "textarea" = "text",
  ) => {
    const displayValue =
      value !== null && value !== undefined ? String(value) : "";

    return (
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: "500",
            color: "#374151",
            fontSize: "14px",
          }}
        >
          {label}
        </label>
        {type === "textarea" ? (
          <textarea
            value={displayValue}
            readOnly
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "#f9fafb",
              color: "#374151",
              fontSize: "14px",
              resize: "none",
              minHeight: "80px",
              fontFamily: "inherit",
            }}
          />
        ) : (
          <input
            type="text"
            value={displayValue}
            readOnly
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "#f9fafb",
              color: "#374151",
              fontSize: "14px",
            }}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          fontSize: "16px",
          color: "#6b7280",
        }}
      >
        Loading record...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          gap: "16px",
        }}
      >
        <p style={{ fontSize: "16px", color: "#dc2626" }}>{error}</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
          }}
        >
          Back to Records
        </button>
      </div>
    );
  }

  if (!record) {
    return null;
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "white",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          paddingBottom: "16px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1f2937",
            margin: 0,
          }}
        >
          Record Details
        </h1>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#4b5563";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#6b7280";
          }}
        >
          Back to Records
        </button>
      </div>

      {/* Delete Record Button */}
      {isAdmin() && (
        <div style={{ marginBottom: "24px" }}>
          <button
            onClick={handleDeleteRecord}
            style={{
              padding: "12px 24px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#b91c1c";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
            }}
          >
            Delete Record
          </button>
        </div>
      )}

      {/* Upload Micrograph Section */}
      {isAdmin() && (
        <div style={{ marginBottom: "24px" }}>
          <h3
            style={{
              marginBottom: "16px",
              color: "#374151",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Upload Micrograph
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="file"
              accept="image/jpeg"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "#f9fafb",
              }}
            />
            {uploadFile && (
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                Selected: {uploadFile.name}
              </div>
            )}
            <button
              onClick={handleUploadMicrograph}
              disabled={!uploadFile || uploading}
              style={{
                padding: "10px 20px",
                backgroundColor: uploadFile && !uploading ? "#059669" : "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: uploadFile && !uploading ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                alignSelf: "flex-start",
              }}
              onMouseOver={(e) => {
                if (uploadFile && !uploading) {
                  e.currentTarget.style.backgroundColor = "#047857";
                }
              }}
              onMouseOut={(e) => {
                if (uploadFile && !uploading) {
                  e.currentTarget.style.backgroundColor = "#059669";
                }
              }}
            >
              {uploading ? "Uploading..." : "Upload Micrograph"}
            </button>
          </div>
        </div>
      )}

      {/* Images */}
      {renderImages()}

      {/* Record Data Fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h3
            style={{
              marginBottom: "16px",
              color: "#374151",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Basic Information
          </h3>
          {renderField("Record ID", record.id)}
          {renderField("Date", formatDate(record.date))}
          {renderField("Researcher Name", record.name)}
          {renderField("Organization", record.organization)}
          {renderField("Type", record.type)}
          {record.type !== "Sighting" && renderField("Tube ID", record.tubeId)}
        </div>

        <div>
          <h3
            style={{
              marginBottom: "16px",
              color: "#374151",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Location & Characteristics
          </h3>
          {renderField("Latitude", record.latitude?.toFixed(6))}
          {renderField("Longitude", record.longitude?.toFixed(6))}
          {renderField("Size", record.size)}
          {renderField("Colors", record.colors?.join(", "))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h3
            style={{
              marginBottom: "16px",
              color: "#374151",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Environmental Conditions
          </h3>
          {record.isOnGlacier !== undefined &&
            renderField("On Glacier", record.isOnGlacier ? "Yes" : "No")}
          {record.seeExposedIceOrWhatIsUnderSnowpack &&
            renderField(
              record.isOnGlacier
                ? "See Exposed Ice?"
                : "What is Under Snowpack?",
              record.seeExposedIceOrWhatIsUnderSnowpack,
            )}
          {record.snowpackDepth &&
            renderField("Snowpack Depth", record.snowpackDepth)}
          {record.bloomDepth && renderField("Bloom Depth", record.bloomDepth)}
          {record.impurities &&
            record.impurities.length > 0 &&
            renderField("Impurities", record.impurities.join(", "))}
        </div>

        <div>
          <h3
            style={{
              marginBottom: "16px",
              color: "#374151",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Additional Information
          </h3>
          {record.locationDescription &&
            renderField(
              "Location Description",
              record.locationDescription,
              "textarea",
            )}
          {record.notes && renderField("Notes", record.notes, "textarea")}
        </div>
      </div>
    </div>
  );
}

export default RecordDetail;
