import React, { useCallback, useEffect, useState } from "react";
import { RecordsApiV3 } from "@livingsnow/network";
import { TableHeader, TableRow } from "./components/TableRow";
import {
  useMsal,
  useIsAuthenticated,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import "./App.css";

function App() {
  const [records, setRecords] = useState<JSX.Element[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const { accounts, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const fetchRecords = useCallback((pageToken?: string) => {
    RecordsApiV3.get(pageToken)
      .then((response) => {
        const recs = response.data.map((item, index) => (
          <TableRow
            key={index}
            item={item}
            photos={item.photos}
            // onUploadSuccess={fetchRecords}
          />
        ));
        setRecords(recs);
        setNextToken(response.meta.next_token || null);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleNextPage = useCallback(() => {
    if (nextToken) {
      fetchRecords(nextToken);
    }
  }, [nextToken, fetchRecords]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const getUserInitials = (username: string | undefined) => {
    if (!username) return "";
    const parts = username.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div style={{ textAlign: "center" }}>
            <h1>Living Snow Project</h1>
            <p className="app-description">
              Data visualization and management for the Living Snow Project
              research team. Explore algae records collected by community
              scientists worldwide.
            </p>
          </div>
          <div className="user-controls">
            <UnauthenticatedTemplate>
              <button
                onClick={() => instance.loginPopup()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backdropFilter: "blur(4px)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.3)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    fill="currentColor"
                    opacity="0.8"
                  />
                  <path
                    d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                    fill="currentColor"
                    opacity="0.8"
                  />
                </svg>
                Login
              </button>
            </UnauthenticatedTemplate>

            <AuthenticatedTemplate>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {isAuthenticated &&
                    accounts[0] &&
                    getUserInitials(accounts[0].name)}
                </div>
                <button
                  onClick={() => instance.logoutPopup()}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    backdropFilter: "blur(4px)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.3)";
                  }}
                >
                  Logout
                </button>
              </div>
            </AuthenticatedTemplate>
          </div>
        </div>
      </header>
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
        <table className="modern-table">
          <TableHeader />
          <tbody>{records}</tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
