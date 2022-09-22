import { createSlice } from '@reduxjs/toolkit'
import zoteroClient from '@/utilities/zotero-interface'

export const zoteroSlice = createSlice({
  name: 'zotero',
  initialState: {
    groups: zoteroClient.groups(),
    items: {
      user: zoteroClient.items()
    },
    collections: {
      user: zoteroClient.collections()
    }
  },
  reducers: {
    getGroups: (state) => {
      state.groups = zoteroClient.groups();
      console.log("groups", state.groups);
    },
    getItems: (state, group_id) => {
      if (group_id) {
        state.items[group_id] = zoteroClient.items(group_id);
      } else {
        state.items.user = zoteroClient.items();
      }
    },
    getCollections: (state, group_id) => {
      if (group_id) {
        state.collections[group_id] = zoteroClient.collections(group_id);
      } else {
        state.collections.user = zoteroClient.collections();
      }
    }
  }
});

// setInterval(() => {
//   zoteroSlice.actions.getItems();
//   zoteroSlice.actions.getCollections();
//   for (var group in zoteroClient.groups()) {
//     zoteroSlice.actions.getItems(group.id);
//     zoteroSlice.actions.getCollections(group.id);
//   }
// }, 1000);

export const zoteroActions = zoteroSlice.actions;

export default zoteroSlice.reducer;