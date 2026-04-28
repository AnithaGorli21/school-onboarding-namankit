// ============================================================
//  src/index.jsx  —  React entry point
// ============================================================
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./styles/global.css";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App';

class WebComponent extends HTMLElement {
  connectedCallback() {
    render(
      <React.StrictMode>
        <App />
      </React.StrictMode>, 
      this
    );
  }
  disconnectedCallback() {
    unmountComponentAtNode(this);
  }
}

const ELEMENT_NAME = 'school-onboarding-namankit';
if (customElements.get(ELEMENT_NAME)) {
  console.log(`Skipping registration for <${ELEMENT_NAME}> (already registered)`);
} else {
  customElements.define(ELEMENT_NAME, WebComponent);
}