
import { useSelector, useDispatch } from 'react-redux'
import MainView from '@/views/MainView'
import React from 'react'
import "@/css/main.scss"

function getUrlParams() {
  const params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = decodeURIComponent(value);
  });
  return params;
}


export default function App() {
  return <div id="container"><MainView /></div>;
}
