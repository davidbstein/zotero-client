import { configureStore } from '@reduxjs/toolkit'
import zoteroReducer from './zoteroSlice'
import appReducer from './appSlice'

export default configureStore({
  reducer: {
    app: appReducer,
    zotero: zoteroReducer
  },
})