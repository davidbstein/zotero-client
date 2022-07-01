import * as fs from "fs";
import { app, ipcMain } from "electron";
import fetch from "electron-fetch";

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

async function doZoteroGetRequest({group_id, path, params}) {
  const userOrGroupPrefix = group_id ? "group" : "users";
  const id_ = group_id ? group_id : USER_ID;
  const url = `https://api.zotero.org/${userOrGroupPrefix}/${id_}/${path}`;
  const headers = {
    "Content-Type": "application/json",
    "Zotero-API-Version": "3",
    "Zotero-API-Key": USER_TOKEN
  }
  console.log(url);
  const resp = await fetch(url, {
    method: "GET",
    headers,
  });
  return await resp.json();
} 

ipcMain.on("zotero-request", async (event, args) => {
  console.log("zotero-request", args);
  event.returnValue = JSON.stringify({response: await doZoteroGetRequest(args)});
}); 

ipcMain.on("zotero-groups", async (event, args) => {
  console.log("zotero-groups");
  event.returnValue = JSON.stringify({response: await getGroups()});
});

ipcMain.on("zotero-items", async (event, args={}) => {
  console.log("zotero-items");
  event.returnValue = JSON.stringify({response: await getItems(args)});
});
