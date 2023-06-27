import { useEffect, useState } from "react";
import { RecordsApiV2 } from "@livingsnow/network";
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

  useEffect(() => {
    let isMounted = true;

    RecordsApiV2.getAll()
      .then((response) => {
        const recs = response.data.map((item, index) => (
          <TableRow
            style={{
              backgroundColor: index % 2 === 0 ? "lightgrey" : "lightblue",
            }}
            key={index}
            item={item}
          />
        ));

        isMounted && setRecords(recs);
      })
      .catch((error) => console.log(error));

    return () => {
      isMounted = false;
    };
  }, []);

  // TODO: play with [login|logout]Redirect and other APIs
  return (
    <div className="App">
      <UnauthenticatedTemplate>
        <button onClick={() => instance.loginPopup()}>login</button>
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <p>{isAuthenticated && `Hello, ${accounts[0].username}`}</p>
        <button onClick={() => instance.logoutPopup()}>logout</button>
      </AuthenticatedTemplate>
      <p>
        This is (obviously) very crude and a work in progress. The goal is to
        build a web app alongside the mobile app for the research team to better
        interact with their data and also for volunteers to further explore
        their contributions.
      </p>
      <br />
      <table>
        <TableHeader />
        <tbody>{records}</tbody>
      </table>
    </div>
  );
}

export default App;
