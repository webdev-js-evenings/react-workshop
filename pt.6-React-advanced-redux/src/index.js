import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import StoreProvider from './store/store-provider'
import { parse } from 'url'

import createStore, { applyMiddleWare, initialData } from './store'
import loggerMiddleware from './store/logger-middleware'
import reducer from './store/reducer'
import firebase from "firebase"

//import './store/mini-redux'


const config = {
  apiKey: "AIzaSyA5jKFg6VsSLkfKeeTz1ZrFfI3z6NML__0",
  authDomain: "state-container.firebaseapp.com",
  databaseURL: "https://state-container.firebaseio.com",
  projectId: "state-container",
  storageBucket: "state-container.appspot.com",
  messagingSenderId: "728941706922"
};

const promiseMiddleware = store => dispatch => action => {
  if (action instanceof Promise) {
    action.then(dispatch)
  } else {
    dispatch(action)
  }
}

const client = firebase.initializeApp(config)
client.auth().signInAnonymously()

const database = client.database()

const store = applyMiddleWare([promiseMiddleware])(createStore)(initialData, [reducer], {
  firebase: client,
  database,
})

const routes = {
  '/ahoj': (uri) => {
    console.log('ahoj uri', uri)
  }
}

const match = (routes, uri) => {
  const parsedUri = parse(uri, true)
  const { pathname } = parsedUri
  if (routes[pathname]) {
    return routes[pathname](parsedUri)
  }

  return null
}

window.addEventListener('popstate', () => {
  const action = match(routes, window.location.href + window.location.search)

  if (!action) {
    return
  }

  store.dispatch(action)
})

const initAction = match(routes, window.location.href + window.location.search)
if (initAction) {
  store.dispatch(initAction)
}

window.store = store
ReactDOM.render(
  <StoreProvider store={store} database={database}><App /></StoreProvider>,
  document.getElementById('root')
)

