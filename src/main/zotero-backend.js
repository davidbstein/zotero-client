import * as fs from "fs";
import { app, ipcMain } from "electron";
import fetch from "electron-fetch";

/**
 * 
 *  Header <Last-Modified-Version> will let me not re-load everything every time.
 *  Header <If-Modified-Since-Version> will check for updates
 *  (https://www.zotero.org/support/dev/web_api/v3/syncing)
 * 
 * 
 * 
 */

const homeDir = app.getPath("home");
const secrets = JSON.parse(fs.readFileSync(`${homeDir}/.secrets.json`, "utf8"));
const USER_ID = secrets.zotero.user_library_id;
const USER_TOKEN = secrets.zotero.pyzotero_api_key;

async function getCollections({group_id}) {
  return await doZoteroGetRequest({
    path: "collections",
    group_id,
  });
}

async function getGroups() {
  return await doZoteroGetRequest({
    path: "groups"
  });
}

async function getItems({group_id}) {
  return await doZoteroGetRequest({
    path: "items",
    group_id
  });
}

async function doZoteroGetRequest({method="GET", group_id, path, params}) {
  const userOrGroupPrefix = group_id ? "group" : "users";
  const id_ = group_id ? group_id : USER_ID;
  const url = `https://api.zotero.org/${userOrGroupPrefix}/${id_}/${path}`;

  const headers = {
    "Content-Type": "application/json",
    "Zotero-API-Version": "3",
    "Zotero-API-Key": USER_TOKEN
  }
  console.log(url);
  try {
    let total=100;
    const to_ret = [];
    while (to_ret.length < total && to_ret.length < 100){
      const params = new URLSearchParams({
        limit: 100,
        start: to_ret.length
      });
      const resp = await fetch(url, {
        method,
        headers,
      });
      total = resp.headers.get("total-results")
      to_ret.push(...(await resp.json()));
      console.log("to_ret", to_ret, to_ret.length, total);
    }
    return to_ret;
  } catch (e) {
    return {"error": `${e}`}
  }
} 

ipcMain.on("zotero-request", async (event, args) => {
  console.log("zotero-request", args);
  event.returnValue = JSON.stringify({response: await doZoteroGetRequest(args)});
}); 

