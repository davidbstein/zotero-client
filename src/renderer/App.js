
import { useSelector, useDispatch } from 'react-redux'
import Counter from './views/Counter'
import React from 'react'

function getUrlParams() {
  const params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
    params[key] = decodeURIComponent(value);
  });
  return params;
}

export default function App() {
  return <div id="container">Hello World<Counter /></div>;
}
