import { ipcRenderer } from "electron";

window.zoteroCommand = (args) => {
  ipcRenderer.send("zotero-request", args);
};

// import zoteroAPIClient from "zotero-api-client";
// import * as fs from "fs";


class ZoteroClient {
  constructor() {
  }
  request({ method, group_id, path, params }) {
    const resp = ipcRenderer.sendSync("zotero-request", {method, group_id, path, params});
    return JSON.parse(resp).response;
  }
  groups(){
    return this.request({path:"groups"})
  }
  loadGroup(group_id){
    return {
      tags: this.tags(group_id),
      items: this.items(group_id),
      collections: this.collections(group_id),
    }
  }
  tags(group_id){
    return this.request({path:"tags"})
  }
  items(group_id){
    return this.request({path:"items"})
  }
  collections(group_id){
    return this.request({path:"collections"})
  }
}

const zoteroClient = new ZoteroClient();
window.zc = zoteroClient;
export default zoteroClient;