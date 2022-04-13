import zoteroAPIClient from "zotero-api-client";
import * as fs from "fs";

const secrets = JSON.parse(fs.readFileSync("./.secrets.json", "utf8"));
const zoteroClient = zoteroAPIClient(secrets.zoteroAPIkey).library("user", secrets.zoteroUserID);

async function getGroups() {
  const groups = await zoteroClient.groups().get();
  return groups.getData();
}

async function getItems() {
  const items = await zoteroClient.items().get();
  return items.getData();
}

ipcMain.on("zotero-groups", (event, args) => {});
