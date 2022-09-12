import { createSlice } from '@reduxjs/toolkit'
import zoteroClient from '@/utilities/zotero-interface'

export const zoteroSlice = createSlice({
  name: 'counter',
  initialState: {
    groups: zoteroClient.groups(),
    user: {
      items: zoteroClient.items(),
      tags: zoteroClient.tags(),
      collections: zoteroClient.collections(),
    }
  },
  reducers: {
    getGroups: (state) => {
      state.value += 1
    },
    getTags: (state) => {
      state.value -= 1
    },
    getItems: (state) => {
      state.value += action.payload
    },
    getCollections: (state) => {
      state.value 
    }
  },
})

export const zoteroActions = zoteroSlice.actions;

export default zoteroSlice.reducer;