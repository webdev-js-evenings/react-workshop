import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import createStore, { initialData } from './store'
import reducer from './store/reducer'

//import './store/mini-redux'


const store = createStore(initialData, [reducer])

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

