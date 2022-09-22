import { createSlice } from '@reduxjs/toolkit'
import zoteroClient from '@/utilities/zotero-interface'

export const zoteroSlice = createSlice({
  name: 'counter',
  initialState: {
    groups: zoteroClient.groups(),
    user: {
      items: zoteroClient.items(),
      collections: zoteroClient.collections(),
    }
  },
  reducers: {
    getGroups: (state) => {
      state.groups = zoteroClient.groups();
    },
    getItems: (state, group_id) => {
      state.user.items = zoteroClient.items(group_id);
    },
    getCollections: (state, group_id) => {
      state.user.collections = zoteroClient.collections(group_id);
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