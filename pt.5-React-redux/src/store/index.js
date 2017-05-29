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
  user: {
    username: '',
    id: 0,
    email: '',
  }
}

class Store {
  _listeners = []
  _state = {}
  _reducer = null

  constructor(initialState, reducer) {
    this._state = initialState
  }

  _emitChange() {
    this._listeners.forEach(listener => listener())
  }

  listen(listener) {
    this._listeners.push(listener)
  }

  getState() {
    return this._state
  }

  dispatch(action) {
    this._state = this._reducer(this._state, action)
    this._emitChange()
  }
}


export default (initialState) => new Store(initialState)
