![Nautč se React.js](https://image.ibb.co/dnb7tv/react_event_fb_title_v03.png)

# Naučte se React.js 7 - advanced Redux
## Minule
Jsme si tedy ukázali tu nejzákladnější architekturu Reduxu. Řekli jsme si, že je to jenom implementace fluxu a celá jeho existence je opravdu jednoduchoučká.

Skočili jsme ve chvíli, kdy šlo již přidávat faktury do naší skvělé aplikace.

## Dneska
Dneska tedy přijde na řadu pokročilá práce s Reduxem. To znamená že si naimplmenentíme:
- routování
- lenses ("koukání" do stavu přes čočky)
- více než jeden reducer
- middleware
- asynchronní volání

Ale nejdřív si trošku celý ten Store zrefaktorujeme, protože je to příliš mnoho kódu. Redux se dá napsat na tři řádky a tak to taky uděláme!

A pak se hned vrhneme na to routování. Bylo by totiž fajn, kdyby se modal pro přidání  / úpravu faktury zobrazoval jakmile přijdeme a nějakou URL, to by bylo mega cool.

Tak se na to vrhneme.

## Lehký refaktor storu
Store je vlastně primitivní komponenta, která má naprosto jednoduché API, vlastně jde jenom o tři metody:
- `getState()`
- `dispatch()`
- `listen()`

Pokud potřebujeme jen tři metody, tak fakt není potřeba vytvářet třída, která navíc má všechny své properties public, takže si to zabalíme všechno do closure:
```js

const createStore = (initialState, initialReducers) => {
  let listeners = []
  let state = initialState
  let reducers = initialReducers

  const _emitChange = () => {
    listeners.forEach(listener => listener())
  }

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
    state = reducers.reduce((reducedState, reducer) => { return reducer(reducedState, action) }, state)
    console.info('Action dispatched:', action.action, action.payload, state)
    _emitChange()
  }

  return {
    listen,
    unlisten,
    dispatch,
    getState,
  }
}
```

Nic moc změna, pořád se vlastně jedná o třídu. Jediné relevantní vylepšení je to, že se nedá ke stavu přistupovat jinak než přes `getState()` to samé platí o ostatních proměnných ve funkci `createStore()`.

Zjednodušování by mohlo jít mnohem dál, kdyby React byl snadno schopný přijímat nový context. To zatím možné není, ale prozradím vám, že dostačující implmenetace Reduxu vypadá takto:
```js
const createDispatch = (initialState, reducers, onChange) => {
  return (action) => {
    const nextState = reducers.reduce((reducedState, reducer) => {
      return reducer(reducedState, action)
    }, initialState)

    onChange(nextState, createDispatch(nextState, reducers, onChange))
  }
}

const renderApp = (state, dispatch) => {
  console.log(state)
  window.dispatch = dispatch
  return
}

const dispatch = createDispatch({ 'actionCounter': 0 }, [(state) => ({
  ...state,
  actionCounter: state.actionCounter + 1,
})], renderApp)

window.dispatch = dispatch
// zavolání dispatch() pak změní stav aplikace
```
Funkční ukázku si můžete prohlédnou [zde](./store/mini-redux.js).

No to jentak na okraj. Zatím to necháme roztahanější a trochu čitelnější, abychom se v toho nezbláznili.
