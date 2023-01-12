import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { zoteroActions } from '@/stores/zoteroSlice'
import { appActions } from '@/stores/appSlice'
import _ from 'lodash'
import "@/css/doclist.scss"
import bluebookItem from '@/utilities/item-bluebook'

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
    ([fieldname, width], i) => (
      <div key={i} className={`item-data-entry item-entry-${fieldname}`}>
        {JSON.stringify(data[fieldname])}
      </div>
    ))
}

function ItemRow({item, fieldWidths, selected}) {
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
    {genPreviewRow({item, fieldWidths, data})}
  </div>
}

export default function ItemList() {
  const {zotero: zoteroState, app: appState} = useSelector((state) => state)
  const {currentGroup, currentCategory, currentItems} = appState;
  const initialFieldWidths = [
    ["itemType", 25], 
    ["title", 25], 
    ["dateAdded", 25], 
    ["date", 25]
  ];
  const [fieldWidths, setFieldWidths] = React.useState(_.fromPairs(initialFieldWidths));
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
          fieldPairs.map(([fieldname, width], i) => (
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
          fieldWidths={fieldPairs}
        />)
      }
    </div>
  )
}
