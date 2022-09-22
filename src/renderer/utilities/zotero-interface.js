import { ipcRenderer } from "electron";

window.zoteroCommand = (args) => {
  ipcRenderer.send("zotero-request", args);
};

// import zoteroAPIClient from "zotero-api-client";
// import * as fs from "fs";
import _ from "lodash";

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
      tags: this.tags({group_id}),
      items: this.items({group_id}),
      collections: this.collections({group_id}),
    }
  }
  items(group_id){
    const items = this.request({group_id, path:"items"})
    const key_to_items = _.fromPairs(items.map((item) => [item.key, item]));
    items.map((item) => {
      if (item.data.parentItem) {
        const parent = key_to_items[item.data.parentItem];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      } else {
        item.children = [];
      }
    });
    const items_with_children = items.filter((item) => !item.data.parentItem);
    console.log(items_with_children);
    return items_with_children;
  }
  collections(group_id){
    return this.request({group_id, path:"collections"})
  }
}

const zoteroClient = new ZoteroClient();
window.zc = zoteroClient;
export default zoteroClient;