import "@/css/main.scss";

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import store from '@/stores/store'

import _ from "lodash";

import { ipcRenderer } from "electron";

import App from '@/App'

console.log("loading");
ipcRenderer.on("menu-clicked", (event, { command, ...detail }) => {
  console.log("menu-clicked", command, detail);
});

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)

console.log("loaded")
