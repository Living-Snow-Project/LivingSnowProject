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
  const { accounts, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const fetchRecords = useCallback(() => {
    RecordsApiV3.getAll()
      .then((response) => {
        const recs = response.data.map((item, index) => (
          <TableRow
            key={index}
            item={item}
            photos={item.photos}
            onUploadSuccess={fetchRecords}
          />
        ));
        setRecords(recs);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="App">
      <UnauthenticatedTemplate>
        <button onClick={() => instance.loginPopup()}>login</button>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <p>{isAuthenticated && `Hello, ${accounts[0].username}`}</p>
        <button onClick={() => instance.logoutPopup()}>logout</button>
      </AuthenticatedTemplate>
      <header className="app-header">
        <h1>Living Snow Project</h1>
        <p className="app-description">
          Data visualization and management for the Living Snow Project research
          team. Explore algae records collected by community scientists
          worldwide.
        </p>
      </header>
      <div className="table-container">
        <table className="modern-table">
          <TableHeader />
          <tbody>{records}</tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
