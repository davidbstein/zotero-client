import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { appActions } from '@/stores/appSlice'
import { zoteroActions } from '@/stores/zoteroSlice'
import _ from 'lodash'
import "@/css/groupList.scss"

function GroupItem({group}) {
  const dispatch = useDispatch();
  const {zotero: zoteroState, app: appState} = useSelector((state) => state)
  const {selectedGroup} = appState;
  const isSelected = selectedGroup === group.id;
  const onClick = () => {
    dispatch(appActions.setGroup(group.id));
    dispatch(zoteroActions.getItems(group.id));
  }
  console.log(group);
  return <div className={`group-item ${isSelected ? 'selected' : ''}`} onClick={onClick}>
    {group.data.name}
  </div>
}

export default function GroupList(){
  const {zotero: {groups}, app: appState} = useSelector((state) => state);
  const {currentGroup, currentCategory} = appState;
  return <div id="group-list-container">
    currentGroup: {currentGroup}
    {_.sortBy(groups, (g) => g.data.name).map((group) => <GroupItem group={group} key={group.id}/>)}
  </div>
}