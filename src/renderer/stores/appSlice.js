import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    currentGroup: "user",
    currentCategory: undefined,
    currentItems: [],
  },
  reducers: {
    setGroup: (state, action) => {
      state.currentGroup = action.payload.group_id;
      state.currentItems = [];
    },
    setCategory: (state, action) => {
      state.currentCategory = action.payload.category;
      state.currentItems = [];
    },
    toggleItemSelection: (state, action) => {
      const item = action.payload;
      const index = state.currentItems.indexOf(item);
      if (index > -1) {
        state.currentItems.splice(index, 1);
      } else {
        state.currentItems.push(item);
      }
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