import connectReact from './connect'
export const connect = connectReact


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


export const applyMiddleWare = (middlewares) => (createStore) => {
  return (...args) => {
    const store = createStore(...args)

    const dispatch = middlewares.reduce((originalDispatch, middleware) => {
      return middleware(store)(originalDispatch)
    }, store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
}


export default  (initialState, initialReducers, services = {}) => {
  let listeners = []
  let state = initialState
  const reducers = initialReducers

  const listen = (listener) => {
    listeners.push(listener)
  }

  const unlisten = (listener) => {
    listeners = listeners.filter(candidate => candidate !== listener)
  }

  const getServices = () => {
    return services
  }

  const getState = (keys = []) => {
    return keys.reduce((state, key) => {
      return {
        [key]: state[key],
      }
    }, state)
  }

  const dispatch = (action) => {
    const nextState = reducers.reduce((reducedState, reducer) => {
      return reducer(reducedState, action)
    }, state)
    if (nextState === state) {
      return
    }

    state = nextState
    listeners.forEach(listener => listener())
    return state
  }

  services = {
    ...services,
    getState,
    dispatch,
  }


  return {
    listen,
    unlisten,
    dispatch,
    getState,
    getServices,
  }
}
