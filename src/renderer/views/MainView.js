import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { zoteroActions } from '@/stores/zoteroSlice'


function ItemRow(item) {
  return <pre>
    {JSON.stringify(item)}
  </pre>
}

function ItemList() {
  const {zotero: {user: {items, tags, collections}}} = useSelector((state) => state)
  const dispatch = useDispatch();
  console.log(tags)
  return (
    <div>
      <div>
        <button onClick={() => dispatch(zoteroActions.getGroups())}>
          reload groups
        </button>
        {items.map((item) => <ItemRow item={item} key={item.key}/>)}
      </div>
    </div>
  )
}

export default function MainView() {
  return <div>
    <ItemList />
  </div>
}