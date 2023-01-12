import { createSlice } from '@reduxjs/toolkit'
import { appSetWindowTitle } from '../utilities/app-interface';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    currentGroup: "user",
    currentCategory: undefined,
    currentItems: {},
  },
  reducers: {
    setGroup: (state, action) => {
      state.currentGroup = action.payload.group_id;
      state.currentItems = {};
      appSetWindowTitle(action.payload.group_name);
    },
    setCategory: (state, action) => {
      state.currentCategory = action.payload.category;
      state.currentItems = {};
    },
    toggleItemSelection: (state, action) => {
      const item = action.payload.item;
      if (item.key){
        if (state.currentItems[item.key]) {
          delete state.currentItems[item.key];
        } else {
          state.currentItems[item.key] = item;
        }
      } else {
        state.currentItems = {};
      }
    },
    setItemSelection: (state, action) => {
      const item = action.payload.item;
      state.currentItems = {[item.key]: item};
    },
  }
});

// setInterval(() => {
//   appSlice.actions.getItems();
//   appSlice.actions.getCollections();
//   for (var group in zoteroClient.groups()) {
//     appSlice.actions.getItems(group.id);
//     appSlice.actions.getCollections(group.id);
//   }
// }, 1000);

export const appActions = appSlice.actions;

export default appSlice.reducer;