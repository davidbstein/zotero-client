import { ipcRenderer } from "electron";

window.zoteroCommand = (args) => {
  ipcRenderer.send("zotero-request", args);
};

// import zoteroAPIClient from "zotero-api-client";
import * as fs from "fs";


class ZoteroClient {
  constructor() {
  }
  async request({ method, group_id, path, params }) {
    const resp = ipcRenderer.sendSync("zotero-request", {method, group_id, path, params});
    return JSON.parse(resp).response;
  }
  async groups() {
    const groups = ipcRenderer.sendSync("zotero-groups");
    return JSON.parse(groups).response;
  }
  async items(group_id) {
    const groups = ipcRenderer.sendSync("zotero-items");
    return JSON.parse(groups).response;
  }
}

window.zc = new ZoteroClient();
