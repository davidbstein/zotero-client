import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { zoteroActions } from '@/stores/zoteroSlice'
import ItemList from '@/views/ItemList'
import GroupList from '@/views/GroupList'
import PreviewBox from '@/views/PreviewBox'
import "@/css/mainView.scss"

{/* 
<button onClick={() => dispatch(zoteroActions.getGroups())}>
reload groups
</button> 
*/}

/**
 * splits the window into two parts, with a draggable splitter.
 * takes two children, a prop for the initial size of the pane, 
 * and a boolean for whether the pane is vertical or horizontal
 */
function ResizableSplitPane(props) {
  const size = props.initialSize;
  const [delta, setDelta] = React.useState(0);
  const [isHidden, setIsHidden] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [startDelta, setStartDelta] = React.useState(0);
  const [startTime, setStartTime] = React.useState(0);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartDelta(delta);
    setStartTime(Date.now());
  };

  const handleMouseUp = (e) => {
    setDragging(false);
    if (Date.now() - startTime < 200 && Math.abs(delta - startDelta) < 30) {
      if (props.vertical) {
        setIsHidden(!isHidden);
      } else {
        setIsHidden(!isHidden);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      if (props.vertical) {
        setDelta(startDelta + (e.clientY - startY));
      } else {
        setDelta(startDelta + (e.clientX - startX));
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const splitSizeA = props.vertical
    ? { height: isHidden ?  "100%" : `calc(${100*size}% + ${delta}px)` }
    : { width: isHidden ? "0px" : `calc(${100*size}% + ${delta}px)` };
  const splitSizeB = props.vertical
    ? { height: isHidden ?  "0px" : `calc(${100*(1-size)}% - ${delta}px)` }
    : { width: isHidden ? "100%" : `calc(${100*(1-size)}% - ${delta}px)` };

  return (
    <div className={`resizable-split-window-container ${props.vertical ? "vertical" : "horizontal"}`}>
      <div className="split-pane" style={splitSizeA}>{props.children[0]}</div>
      <div
        className={`splitter ${isHidden ? "hidden" : "shown"}`}
        onMouseDown={(e) => handleMouseDown(e)}
      ></div>
      <div className="split-pane" style={splitSizeB}>{props.children[1]}</div>
    </div>
  );
}


export default function MainView() {
  return <div>
    <ResizableSplitPane initialSize={0.2} vertical={false}>
      <GroupList />
      <ResizableSplitPane initialSize={0.8} vertical={true}>
        <ItemList />
        <PreviewBox />
      </ResizableSplitPane>
    </ResizableSplitPane>
  </div>
}