import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

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



const client = firebase.initializeApp(config)
client.auth().signInAnonymously()

const store = createStore(initialData, [reducer], [], {
  firebase: client,
  database: client.database()
})

class StoreProvider extends React.PureComponent {
  static childContextTypes = {
    store: React.PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    return this.props.children
  }
}



window.store = store
ReactDOM.render(
  <StoreProvider store={store}><App /></StoreProvider>,
  document.getElementById('root')
)

