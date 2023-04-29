import React, { useEffect } from "react";
import {
  useLocation
} from "react-router-dom"
import { useTranslation } from 'react-i18next'
import Form from "./Form";
import changeTheme from './utils/changeTheme.js';
import './App.css';


function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
  const { i18n, t } = useTranslation();

  let query = useQuery();
  useEffect(() => {
    let theme = query.get('theme') || 'napbiotec';
    changeTheme(theme);
    let lang = query.get('lang') || 'en';
    i18n.changeLanguage(lang);
  }, []);

  return (
    <div id="app" className="">
      <Form />
    </div>
  );
}

export default App;