import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { zoteroActions } from '@/stores/zoteroSlice'
import { appActions } from '@/stores/appSlice'
import _ from 'lodash'
import "@/css/doclist.scss"
import bluebookItem from '../utilities/item-bluebook'


export default function PreviewBox() {
  const {zotero: zoteroState, app: appState} = useSelector((state) => state)
  const currentItems = _.values(appState.currentItems);
  if (currentItems.length == 0) {
    return <div/>;
  } else if (currentItems.length == 1) { 
    const item = currentItems[0];
    return <div>
      <div> {bluebookItem(item)} </div>
      <div style={{whiteSpace:"pre"}}> {JSON.stringify(item.data, null, 2)}</div>
    </div>
  } else {
    return <div>
      total items: {currentItems.length}
    </div>
  }
}
