import * as fs from "fs";
import { app, ipcMain } from "electron";
import fetch from "electron-fetch";
import sqlite3 from "sqlite3";

/**
 *  TODO: caching
 *  Header <Last-Modified-Version> will let me not re-load everything every time. SHould both read and send it down with every request
 *  Header <If-Modified-Since-Version> will check for updates
 *  (https://www.zotero.org/support/dev/web_api/v3/syncing)
 * 
 * 
 * TODO: update and create
 *  POST will create an object
 *  PUT will replace all fields
 *  PATCH will update included fields
 * (both can take a list of up to 50 objects with keys)
 */

const homeDir = app.getPath("home");
const secrets = JSON.parse(fs.readFileSync(`${homeDir}/.secrets.json`, "utf8"));
const USER_ID = secrets.zotero.user_library_id;
const USER_TOKEN = secrets.zotero.pyzotero_api_key;

function getCacheDB() {
  const dataDirectory = app.getPath("appData");
  const sqliteDB = `${dataDirectory}/zotero.sqlite`;
  const db = new sqlite3.Database(sqliteDB);
  return db;
}

function getObjectCacheTable() {
  const db = getCacheDB();
  db.run(`CREATE TABLE IF NOT EXISTS object_cache (
    key TEXT PRIMARY KEY,
    type TEXT,
    group_id TEXT,
    data TEXT,
    version INTEGER
  )`);
  return db;
}

function updateObject(type, group, key, data, version) {
  const db = getObjectCacheTable();
  db.run(
    `INSERT OR REPLACE INTO object_cache (key, type, group_id, data, version) VALUES (?, ?, ?, ?, ?)`,
    [key, type, group, JSON.stringify(data), version],
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

function getMaxVersion(type, group_id) {
  const db = getObjectCacheTable();
  return new Promise((resolve, reject) => {
    db.get(`SELECT MAX(version) as m FROM object_cache WHERE type = ? AND group_id = ?`, [type, group_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row["m"] || 0 : 0);
      }
    });
  });
}

function getObjects(type, group_id) {
  const db = getObjectCacheTable();
  return new Promise((resolve, reject) => {
    db.all(`SELECT data FROM object_cache WHERE type = ? AND group_id = ?`, [type, group_id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map((row) => JSON.parse(row.data)));
      }
    });
  });
}

function getGroupsTable(){
  const db = getCacheDB();
  db.run(`CREATE TABLE IF NOT EXISTS groups (
    group_id TEXT PRIMARY KEY,
    info TEXT,
    version INTEGER
  )`);
  return db;
}

function addGroup(group) {
  const db = getGroupsTable();
  db.run(
    `INSERT OR REPLACE INTO groups (group_id, info, version) VALUES (?, ?, ?)`,
    [group.id, JSON.stringify(group), group.version],
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

function listGroups() {
  const db = getGroupsTable();
  return new Promise((resolve, reject) => {
    db.all(`SELECT info FROM groups`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map((row) => JSON.parse(row.info)));
      }
    });
  });
}

function getKVStore() {
  const db = getCacheDB();
  db.run(`CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);
  return db;
}

function kv_get(key) {
  const db = getKVStore();
  return new Promise((resolve, reject) => {
    db.get(`SELECT value FROM kv_store WHERE key = ?`, [key], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.value : null);
      }
    });
  });
}

function kv_set(key, value) {
  const db = getKVStore();
  return new Promise((resolve, reject) => {
    db.run(`INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)`, [key, value], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


async function _doZoteroGet({prefix, path, params, last_versionNo}) {
  const headers = {
    "Content-Type": "application/json",
    "Zotero-API-Version": "3",
    "Zotero-API-Key": USER_TOKEN,
    "If-Modified-Since-Version": last_versionNo
  }
  const url = `https://api.zotero.org/${prefix}/${path}${params?`?${new URLSearchParams(params)}`:""}`;
  const response = await fetch(url, {headers});
  if (response.status === 429) {
    console.error(`Zotero rate limit exceeded. ${response.text()}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await _doZoteroGet({prefix, path, params, last_versionNo});
  }
  console.log(
    `url: ${url}`,
    `last_versionNo: ${last_versionNo}`,
    `response code: ${response.status}`);
  return response
}

async function doZoteroGetRequest({group_id, path, params, last_versionNo}) {
  console.log(`group_id ${group_id}`);
  const userOrGroupPrefix = group_id == undefined || group_id === USER_ID ? "users" : "group";
  const id_ = group_id ? group_id : USER_ID;
  const prefix = `${userOrGroupPrefix}/${id_}`;
  try {
    let count = 0;
    let total = 1;
    while (count < total){
      const urlParams = {
        direction:"asc", 
        limit: 100, 
        since: last_versionNo, 
        ...params, 
        ...{start: count}
      };
      const resp = await _doZoteroGet({prefix, path, params:urlParams, last_versionNo});
      if (resp.status === 304) {
        console.log("Zotero cache up to date");
        return;
      }
      // const versionNo = resp.headers.get("last-modified-version");
      const objects = await resp.json()
      total = resp.headers.get("total-results");
      count += objects.length;
      const update_key_list = objects.map((obj) => {
        updateObject(path, obj.library?.id , obj.key, obj, obj.version);
        return obj.key;
      }).join(", ");
      // console.log(`updated ${path} : ${update_key_list}`);
    }
  } catch (e) {
    console.error(`error: ${e}`);
    return {"error": `${e}`}
  }
  console.log("done")
} 

async function doZoteroRequest({method="GET", group_id, path, params}) {
  const last_versionNo = await getMaxVersion(path, group_id || USER_ID);
  console.log(`doZoteroRequest(${method}): ${path}, group_id ${group_id}, version ${last_versionNo}`);
  if (method === "GET") {
    if (["items", "tags", "collections"].indexOf(path) > -1) {
      await doZoteroGetRequest({path, params, group_id, last_versionNo});
      return await getObjects(path, group_id || USER_ID);
    } else if (path === "groups") {
      const resp = await _doZoteroGet({path, prefix:`users/${USER_ID}`});
      return await resp.json();
    }
  }
}

ipcMain.on("zotero-request", async (event, args) => {
  console.log("zotero-request", args);
  event.returnValue = JSON.stringify({response: await doZoteroRequest(args)});
}); 

