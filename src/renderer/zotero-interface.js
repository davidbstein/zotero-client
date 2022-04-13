import { ipcRenderer } from "electron";

window.zoteroCommand = (args) => {
  ipcRenderer.send("zotero-command", args);
};
