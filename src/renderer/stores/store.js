import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import zoteroReducer from './zoteroSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    zotero: zoteroReducer
  },
})