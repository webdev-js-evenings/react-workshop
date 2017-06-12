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
  return class extends React.PureComponent {
    static contextTypes = {
      store: React.PropTypes.object.isRequired,
    }

    static displayName = Component.displayName || Component.name

    state = this.context.store.getState()

    componentDidMount() {
      this.context.store.listen(this._handleStoreChange)
    }

    componentWillUnmout() {
      this.context.store.unlisten(this._handleStoreChange)
    }

    _handleStoreChange = () => {
      this.setState( this.context.store.getState())
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
      const stateKeys = Object.keys(stateToProps)
      const state = stateKeys.reduce((state, stateKey) => {
        return {
          ...state,
          [stateToProps[stateKey]]: this.state[stateKey], // transform to keys from stateProps = {'stateKey': 'propsKey'}
        }
      }, stateKeys.length === 0 ? this.state : {})

      const props = {
        ...state,
        ...this.props,
        ...this._prepareActions(),
      }

      return <Component {...props} />
    }
  }
}

const createStore = (initialState, initialReducers) => {
  let listeners = []
  let state = initialState
  let reducers = initialReducers

  const listen = (listener) => {
    listeners.push(listener)
  }

  const unlisten = (listener) => {
    listeners = listeners.filter(candidate => candidate !== listener)
  }

  const getState = (keys = []) => {
    return keys.reduce((state, key) => {
      return {
        [key]: state[key],
      }
    }, state)
  }

  const dispatch = (action) => {
    const nextState = reducers.reduce((reducedState, reducer) => { return reducer(reducedState, action) }, state)
    if (nextState === state) {
      console.info('Nothing changed.')
      return
    }

    state = nextState
    console.info('Action dispatched:', action.action, action.payload, state)
    listeners.forEach(listener => listener())
  }

  return {
    listen,
    unlisten,
    dispatch,
    getState,
  }
}


export default createStore
