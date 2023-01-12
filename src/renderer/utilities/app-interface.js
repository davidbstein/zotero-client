import { ipcRenderer } from "electron";

import _ from "lodash";

export function appSetWindowTitle(title){
  ipcRenderer.send("app-set-window-title", title);
}