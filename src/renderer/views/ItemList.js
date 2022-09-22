import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { zoteroActions } from '@/stores/zoteroSlice'
import _ from 'lodash'
import "@/css/doclist.scss"

function ItemRow({item, fieldWidths}) {
  const data = item.data;
  const meta = item.meta;
  const children = item.children;
  return <div className='itemrow'>
    <comment>{JSON.stringify(meta)}</comment>
    <comment>{JSON.stringify(data)}</comment>
    {
      fieldWidths.map(([fieldname, width]) => (
        <div className={`item-data-entry item-entry-${fieldname}`}>
          {JSON.stringify(data[fieldname])}
        </div>
      ))
    }
  </div>
}

export default function ItemList() {
  const {zotero: zoteroState, app: appState} = useSelector((state) => state)
  const {currentGroup, currentCategory} = appState;
  const initialFieldWidths = [
    ["itemType", 25], 
    ["title", 25], 
    ["dateAdded", 25], 
    ["date", 25]
  ];
  const [fieldWidths, setFieldWidths] = React.useState(_.fromPairs(initialFieldWidths));
  const dispatch = useDispatch();
  const fieldPairs=  _.toPairs(fieldWidths);
  return (
    <div id="item-list-container">
      <style>
        {
          fieldPairs.map(([field, width]) => `.item-entry-${field}{ width: ${width}%; }`)
        }
      </style>
      <div className="itemheader">
        {
          fieldPairs.map(([fieldname, width]) => (
            <div className={`item-data-header item-entry-${fieldname}`}>
              {fieldname}
            </div>
          ))
        }
      </div>
      {
        zoteroState.items[currentGroup]?.map((item) => 
        <ItemRow 
          item={item} 
          key={item.key} 
          fieldWidths={fieldPairs}
        />)
      }
    </div>
  )
}
