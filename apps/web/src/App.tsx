import React, { useCallback, useEffect, useState } from "react";
import { RecordsApiV2 } from "@livingsnow/network";
import { TableHeader, TableRow } from "./components/TableRow";

import "./App.css";

function App() {
  const [records, setRecords] = useState<JSX.Element[]>([]);

  const fetchRecords = useCallback(() => {
    RecordsApiV2.getAll()
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

  return (
    <div className="App">
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
