import React, { useEffect } from "react";
import {
  useLocation
} from "react-router-dom"
import Form from "./Form";
import changeTheme from './utils/changeTheme.js';
import './App.css';


function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function App() {

  let query = useQuery();
  useEffect(() => {
    let theme = query.get("theme") || 'napbiotec';
    changeTheme(theme);
  });

  return (
    <div id="app" className="">
      <Form />
    </div>
  );
}

export default App;