import React from 'react'


export const initialData = {
  vatRatio: 21,
  invoices: [{
    'id': '2017/1',
    'customer': 'Avocode Inc.',
    'price': 123000,
    'VAT': 25830,
    'total': 148830,
  }],
  tax: {
    income: 123000,
    costsRatio: 60,
    taxRatio: 15,
    tax: 7380,
  },
  nextInvoice: {
  },
  user: {
    username: '',
    id: 0,
    email: '',
  }
}


export const connect = (stateToProps = {}, actions = {}) => (Component) => {
  return class extends React.Component {
    static contextTypes = {
      store: React.PropTypes.object.isRequired,
    }

    state = this.context.store.getState()

    componentDidMount() {
      this.context.store.listen(this._handleStoreChange)
    }

    componentWillUnmout() {
      this.context.store.unlisten(this._handleStoreChange)
    }

    _handleStoreChange = () => {
      const stateKeys = Object.keys(stateToProps)
      const state = stateKeys.reduce((state, stateKey) => {
        return {
          [stateToProps[stateKey]]: state[stateKey], // transform to keys from stateProps = {'stateKey': 'propsKey'}
        }
      }, this.context.store.getState(Object.keys(stateKeys)))

      this.setState(state)
    }

    _prepareActions() {
      const actionKeys = Object.keys(actions)
      return actionKeys.reduce((wrappedActions, actionKey) => {
        wrappedActions[actionKey] = (...args) => {
          this.context.store.dispatch(actions[actionKey](...args))
        }

        return wrappedActions
      }, {})
    }

    render() {
      const props = {
        ...this.state,
        ...this.props,
        ...this._prepareActions(),
      }

      return <Component {...props} />
    }
  }
}

class Store {
  _listeners = []
  _state = {}
  _reducer = null

  constructor(initialState, reducer) {
    this._state = initialState
    this._reducer = reducer
  }

  _emitChange() {
    this._listeners.forEach(listener => listener())
  }

  listen(listener) {
    this._listeners.push(listener)
  }

  unlisten(listener) {
    this._listeners = this._listeners.filter(candidate => candidate !== listener)
  }

  getState(keys = []) {
    return keys.reduce((state, key) => {
      return {
        [key]: state[key],
      }
    }, this._state)
  }

  dispatch(action) {
    this._state = this._reducer(this._state, action)
    console.info('Action dispatched:', action.action, action.payload, this._state)
    this._emitChange()
  }
}


export default (initialState, reducer) => new Store(initialState, reducer)
