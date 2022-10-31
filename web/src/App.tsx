import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { serviceEndpoint } from "./constants/service";
import { TableHeader, TableRow } from "./components/TableRow";

function App() {
  const [records, setRecords] = useState("records");
  const alreadyRan = useRef(false);
  useEffect(() => {
    if (alreadyRan.current === true) {
      return;
    }

    fetch(`${serviceEndpoint}/api/records`)
      .then((response) => {
        if (!response.ok) {
          return;
        }

        console.log(response);

        response
          .json()
          .then((data) => {
            const recs = data.map((item: any, index: any) => {
              return (
                <TableRow
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "lightgrey" : "lightblue",
                  }}
                  key={item.id}
                  item={item}
                />
              );
            });
            setRecords(recs);
          })
          .catch((error) => console.log(`${error}`));
      })
      .catch((error) => setRecords(`${error}`));

    return () => {
      alreadyRan.current = true;
    };
  }, []);

  return (
    <div className="App">
      <p>Testing build</p>
      <br />
      <table>
        <TableHeader />
        <tbody>{records}</tbody>
      </table>
    </div>
  );
}

export default App;
