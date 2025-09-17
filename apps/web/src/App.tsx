import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  useMsal,
  useIsAuthenticated,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import RecordsList from "./components/RecordsList";
import RecordDetail from "./components/RecordDetail";
import { tokenManager } from "./index";
import "./App.css";

function App() {
  const { accounts, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // Use basename only for production GitHub Pages deployment
  const basename =
    process.env.NODE_ENV === "production" ? "/LivingSnowProject" : undefined;

  // Manage token lifecycle
  useEffect(() => {
    if (isAuthenticated && accounts[0]) {
      // Start token management when user is authenticated
      tokenManager.startTokenManagement(accounts[0]);
    } else {
      // Stop token management when user is not authenticated
      tokenManager.stopTokenManagement();
    }

    // Cleanup on unmount
    return () => {
      tokenManager.stopTokenManagement();
    };
  }, [isAuthenticated, accounts]);

  const getUserInitials = (username: string | undefined) => {
    if (!username) return "";
    const parts = username.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <Router basename={basename}>
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
                <div style={{ textAlign: "right" }}>
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
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.7)",
                      marginTop: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    For lab team only
                  </div>
                </div>
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

        <Routes>
          <Route path="/" element={<RecordsList />} />
          <Route path="/record/:id" element={<RecordDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
