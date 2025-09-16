import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// Configuration object constructed.
const msalConfig = {
  auth: {
    clientId: "3c648e3d-93b2-476f-9218-fb02ded95672",
    authority:
      "https://login.microsoftonline.com/dc46140c-e26f-43ef-b0ae-00f257f478ff",
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const getAccessToken = async () => {
  const tokenRequest = {
    scopes: ["api://2e007b80-946b-4296-8831-91a95e0b992c/access_as_user"],
    account: msalInstance.getActiveAccount() as AccountInfo,
  };

  try {
    const response = await msalInstance.acquireTokenSilent(tokenRequest);
    return response.accessToken;
  } catch (error) {
    // Fallback to interactive
    const response = await msalInstance.acquireTokenPopup(tokenRequest);
    return response.accessToken;
  }
};

export { getAccessToken };

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
