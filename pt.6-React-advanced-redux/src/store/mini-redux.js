
const createDispatch = (initialState, reducers, onChange) => {
  return (action) => {
    const nextState = reducers.reduce((reducedState, reducer) => {
      const st = reducer(reducedState, action)
    console.log('st', st)
      return st
    }, initialState)

    onChange(nextState, createDispatch(nextState, reducers, onChange))
  }
}

const renderApp = (state, dispatch) => {
  console.log(state)
  window.dispatch = dispatch
  return
}

const reducer = (state) => {
  return {
    ...state,
    actionCounter: state.actionCounter + 1,
  }
}

const dispatch = createDispatch({ 'actionCounter': 0 }, [reducer], renderApp)

window.dispatch = dispatch
