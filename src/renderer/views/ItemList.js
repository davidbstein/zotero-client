import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { zoteroActions } from '@/stores/zoteroSlice'
import { appActions } from '@/stores/appSlice'
import _ from 'lodash'
import "@/css/doclist.scss"
import {getJournal, getAuthors, bluebookItem} from '@/utilities/item-bluebook'

function Comment({children}) {
  // renders a <!-- comment --> in the DOM
  return <div dangerouslySetInnerHTML={{__html: `<!-- ${children} -->`}} />
}


function genPreviewRow({item, fieldWidths, data}) {
  const bluebook = bluebookItem(item);
  if (bluebook){
    return <div className="item-data-preview"> 
      {bluebook}
    </div>;
  } else {
    return genItemRow({item, fieldWidths, data});
  }
}

function genItemRow({item, fieldWidths, data}) {
  return fieldWidths.map(
    ([fieldname, width, getter], i) => (
      <div key={i} className={`item-data-entry item-entry-${fieldname}`}>
        {JSON.stringify(getter(item))}
      </div>
    ))
}

function ItemRow({item, fieldWidths, selected, previewMode=false}) {
  const dispatch = useDispatch();
  function selectItem(e){
    console.log(e.metaKey);
    if (e.metaKey) {
      dispatch(appActions.toggleItemSelection({item}));
    } else {
      dispatch(appActions.setItemSelection({item}));
    }
  }
  const data = item.data;
  const meta = item.meta;
  const children = item.children;
  return <div 
    className={`itemrow ${selected ? 'itemrow-selected' : ''}`}
    onClick={selectItem}
    >
    <Comment>{JSON.stringify(meta)}</Comment>
    <Comment>{JSON.stringify(data)}</Comment>
    <div className={`itemrow-icon itemrow-icon-${data.itemType}`} />
    {(previewMode?genPreviewRow:genItemRow)({item, fieldWidths, data})}
  </div>
}

export default function ItemList() {
  const {zotero: zoteroState, app: appState} = useSelector((state) => state)
  const {currentGroup, currentCategory, currentItems} = appState;
  const initialFieldWidths = [
    ["type", 5, (i)=>i.data.itemType], 
    ["title", 25, (i)=>i.data.title], 
    ["dateAdded", 25, (i)=>i.data.dateAdded.substr(0,10)], 
    ["journal", 25, getJournal],
  ];
  const [fieldWidths, setFieldWidths] = React.useState(initialFieldWidths);
  return (
    <div id="item-list-container">
      <style>
        {
          fieldWidths.map(([field, width, getter]) => `.item-entry-${field}{ width: ${width}%; }`)
        }
      </style>
      <div className="itemheader">
        {
          fieldWidths.map(([fieldname, width, getter], i) => (
            <div key={i} className={`item-data-header item-entry-${fieldname}`}>
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
          selected={currentItems[item.key]}
          fieldWidths={fieldWidths}
        />)
      }
    </div>
  )
}
