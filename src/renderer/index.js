import "@/css/main.scss";

import ReactDOM from "react-dom";
import React from "react";

import _ from "lodash";

import { ipcRenderer } from "electron";

import * as zoteroInterface from "./zotero-interface";

console.log("loading");
ipcRenderer.on("menu-clicked", (event, { command, ...detail }) => {
  console.log("menu-clicked", command, detail);
});

function getUrlParams() {
  const params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = decodeURIComponent(value);
  });
  return params;
}

function App() {
  const { filePath, fileType, windowId } = getUrlParams();
  window._WINDOW_ID = windowId;
  return <div id="container">Hello World</div>;
}

ReactDOM.render(<App />, document.getElementById("app"));

window._WINDOW_ID = getUrlParams().windowId;
console.log("loaded")