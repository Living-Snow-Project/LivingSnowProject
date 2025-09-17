import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecordsApiV3 } from "@livingsnow/network";
import { TableHeader, TableRow } from "./TableRow";

function RecordsList() {
  const [records, setRecords] = useState<JSX.Element[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const fetchRecords = useCallback(
    (pageToken?: string, user?: string) => {
      RecordsApiV3.get(pageToken, user)
        .then((response) => {
          const recs = response.data.map((item, index) => (
            <TableRow
              key={index}
              item={item}
              photos={item.photos}
              onClick={() => navigate(`/record/${item.id}`)}
              // onUploadSuccess={fetchRecords}
            />
          ));
          setRecords(recs);
          setNextToken(response.meta.next_token || null);
        })
        .catch((error) => console.log(error));
    },
    [navigate],
  );

  const handleNextPage = useCallback(() => {
    if (nextToken) {
      fetchRecords(nextToken, currentUser);
    }
  }, [nextToken, currentUser, fetchRecords]);

  const handleSearch = useCallback(() => {
    const searchUser = userName.trim();
    setCurrentUser(searchUser || undefined);
    fetchRecords(undefined, searchUser || undefined);
  }, [userName, fetchRecords]);

  const handleUserNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length <= 50) {
        setUserName(value);
      }
    },
    [],
  );

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <>
      <div className="content-section">
        <p
          style={{
            textAlign: "left",
            marginBottom: "1.5rem",
            fontSize: "16px",
          }}
        >
          Want to contribute? We're open source! Check us out on{" "}
          <a
            href="https://github.com/Living-Snow-Project/LivingSnowProject"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            GitHub
          </a>
          .
        </p>

        <div style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#374151",
            }}
          >
            Next set of features
          </h3>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "1.5rem",
              lineHeight: "1.6",
              color: "#6b7280",
            }}
          >
            <li>Expanded records search</li>
            <li>Paging and result count (no backend support currently)</li>
            <li>Saving searches (client side only)</li>
            <li>Interactivity spinners</li>
            <li>(Admins) Deleting records</li>
            <li>(Admins) Modifying records</li>
          </ul>
        </div>
      </div>

      <div className="table-container">
        {nextToken && (
          <div className="pagination-controls">
            <button
              onClick={handleNextPage}
              className="next-button"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                color: "#374151",
                transition: "all 0.2s ease",
                marginBottom: "1rem",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.borderColor = "#9ca3af";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#ccc";
              }}
            >
              Next
            </button>
          </div>
        )}

        <div className="search-controls" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="User name (ie. Chris Chapin)"
              value={userName}
              onChange={handleUserNameChange}
              maxLength={50}
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "14px",
                color: "#374151",
                backgroundColor: "white",
                transition: "all 0.2s ease",
                minWidth: "200px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.outline = "none";
                e.currentTarget.style.boxShadow =
                  "0 0 0 2px rgba(37, 99, 235, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#ccc";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "1px solid #2563eb",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
                e.currentTarget.style.borderColor = "#1d4ed8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
            >
              Search
            </button>
          </div>
        </div>
        <table className="modern-table">
          <TableHeader />
          <tbody>{records}</tbody>
        </table>
      </div>
    </>
  );
}

export default RecordsList;
