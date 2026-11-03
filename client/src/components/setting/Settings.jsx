import React, { useState } from 'react';
import "./setting-style.css";
import ConnectionComponent from "./connection/ConnectionComponent.jsx";
import LogoutComponent from "./logout/LogoutComponent.jsx";
import {useNavigate} from "react-router-dom";
import {ROUTE_PROFILE} from "../../path/ClientPath.js";

function Settings ({theme, toggleTheme}) {

    const navigate = useNavigate();



  return (
    <div className="settings-container">
      <ul className="ul-container">

         <li className="li-item" onClick={() => navigate(ROUTE_PROFILE)}>Profile</li>

          <hr/>

          <li className="li-item" onClick={() => toggleTheme()}>{theme === 'light' ? '🌙' : '☀️'} Mode</li>

          {/*          <button
            className="icon-button"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>*/}

          <hr/>

          <ConnectionComponent />

          <hr/>

          <LogoutComponent />
      </ul>
    </div>
  );
};



export default Settings;