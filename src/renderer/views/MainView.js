import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { zoteroActions } from '@/stores/zoteroSlice'
import "@/css/doclist.scss"

function ItemRow(item) {
  const data = item.item.data;
  const meta = item.item.meta;
  const children = item.item.children;
  return <div className='itemrow'>
    <div className="item-data-entry">{children?.length}</div>
    <div className="item-data-entry">{data.title}</div>
    <div className="item-data-entry">{data.itemType}</div>
    <div className="item-data-entry">{JSON.stringify(meta)}</div>
    <div className="item-data-entry">{data.extra}</div>
    <div className="item-data-entry">{data.url}</div>
  </div>
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
        <div id="itemList">
          {items.map((item) => <ItemRow item={item} key={item.key}/>)}
        </div>
      </div>
    </div>
  )
}

export default function MainView() {
  return <div>
    <ItemList />
  </div>
}