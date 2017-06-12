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


## První primitivní middleware
Middleware? Co je to middleware. V jazyce Reduxu je middleware funkce obalující klíčovou funkci `dispatch()`.

Middleware musí splňovat tu podmínku, že vrací vždy novou funkci, to je celé, nic víc není potřeba. Aby takový argument měl smysl, musí jako argument dostávat původní dispatch funkci.

A k čemu je takový middleware praktický? Tak například - k logování.
Představte si, že chceme logo jaká akce jde do dispatch funkce a jaký je nový stav po aplikace téhle funkce. Takový middleware by vypadal tedy takto:
```js
const loggerMiddleware = (dev = true) => (originalDispatch) => {
  const logIt = (title, toLog) => {
    if (!dev) {
      return
    }

    console.log(title, toLog)
  }

  return (action) => {
    const nextState = originalDispatch(action)
    logIt('Action:', action)
    logIt('State:', nextState)
    return nextState
  }
}
```

Je to jasné? Mimochodem, funkci `logIt()` bychom si mohli prostě předat jako argument, docela elegantní, ne?
Jak takový middleware ale teď použít? Mnooo, tak zřejmě ho musíme předat do storu při jeho konfiguraci:
```js
const store = createStore(initialData, [reducer], [loggerMiddleware])
```
Takže je potřeba upravit `createStore()` funkci. A to tak, aby přijímala ještě pole middlewareů, které bude potřeba aplikovat a ještě naimplementovat funkci uvnitř storu, která se bude jmenovat `creatDispatchWithMiddleware()` a bude apliakovat middlewary.

Jak taková aplikace middleware bude vypadat? No. Máme pole funkcí, které vrací obalené dispatche a potřebueje z toho udělat jednu funkci... Tak to je prostě reducke, ne?
```js
const createDispatchWithMiddleware = (middleWares) => {
  return middleWares.reduce((originalDispatch, middleware) => {
    return middleware(originalDispatch)
  }, dispatch)
}
```
To je docela elegantní, ne?

A funguje to? No však si tenhle middleware zkuste aplikovat :).

Oukej, takže máme middleware pro logování.

Za chvíli se vrhenem na komplikovanější middleware!

## Async
Tak nejdřív, abychom mohli bejt async, tak si musíme popovídat o Dependency Injection.

### Dependency Injection
Tohle je už takové zaklínadlo, že. Psali o tom daleko zkušenější a lepší progáči, než jsem já, proto si doporučuju přečíst třeba [tento článek od Davida Grudla](https://phpfashion.com/co-je-dependency-injection).

Dočteno, super. Prostě jde o to, abychom předávali závislosti přímo tam, kde jsou potřeba a v našem případě to neděláme kvůli "čistotě" kódu, ale **hlavně** kvůli testovatelnosti.

Vezměme si například tuhle closurku (closure proto, protože funkce používá proměnné z vyšší scope - `fetch`):
```js
export default const fetchInvoice = (invoiceId) => {
  return fetch('invoices/' + invoiceId)
}
```
Moje otázka zní - jak byste testovali takový kód.

Každý asi umí otestovat tuhle funkci:
```js
const addNumbers = (a, b) => {
  return a + b
}

// test
const five = addNumbers(2, 3)

if (five !== 5) {
  throw new Error('Test failed!!')
}
```
Rozumíme? OK. Tohlae je přece jednoduché. Neboť `addNumbers()` jest čistá funkce, která pouze a jenom sčítá dvě čísla.

Ovšem ale v příkladu s funkci `fetchInvoie()` jsem docela v háji, ne? Jak dokážeme "dostat" do chvíle, kde `fetch()` začne něco dělat v síti, jak dokážeme tohle nějak namockovat? Abychom otestovali, že funkce dělá, to co má?

To nejde... S takovouhle funkcí to prostě **nejde**. A proč to nejde? No proto, že využívá globální proměnné!

Vždyť `fetch()` je globální proměnná nebo snad ne? A co nás učili na základní škole? Globální proměnné jsou zlo!

Takže funkci upravíme:
```js
export default const fetchInvoice = (invoiceId, customFetch) => {
  return customFetch('invoices/' + invoiceId)
}
```
Výborně, custom api si už hezky předáváme a teď jak to otetujeme?
```js
const mockResponse = {
  'id': 123,
  'customer': 'Avocode',
  ...
}
const customFetchMock = () => {
  return Promise.resolve(mockResponse)
}

fetchInvoice(123, customFetchMock).then((result) => {
  if (result !== mockResponse) {
    throw new Error('Test failed!')
  }
})
```
Tadá! Testovatelný kód WTF. Stačí pouze psát takový kód, který **vrací** výsledky a všechny proměnné, které potřebuje pro svůj chod vždy dostává přes parametry (klidně i v closure).

#$# DI Container
Samozřejmě je otravný všechny pořád někam předávat a tak by asi nebylo od věci, kdybychom si nějak chytře všechny služby předávali.

V našem příkladu budeme používat `firebase`, což je externí služby tj. typický kandidát pro předávání jako závislost.

Samozřejmě to můžeme naprasit a ze souboru si vyexportovat singleton a ten všude importovat:
```js
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

export default client.database()


// někde jinde
import database from './firebase'
```
Ale jak víme, to je prostě prasárna největšího kalibru, že. Proto je prostě lepší vymylset si mechanismus, který bude do akcí předávat závislosti.

Samozřejmě i tohle **je** prasárna, ale zatím jsem nenašel lepší a pohodlenější způsob jak s DI pracovat. Ano, dá se na to použít monády, ale tam ještě zdaleka nejsem / jsme :).

Tak jak si to představuji.

## DI v Reduxu
Víme, že action creatory musí projít přes `connect()`, kde se propojují s funkcí `dispatch()` jinak jsou prd platné, že? Tudíž by bylo super, kdybychom nějak v action creatoru řekli storu, aby nám poslal služby, které při konfiguraci získá:
```js
// poskytneme storu data přes unikátní klíče
const store = createStore(initialData, [reducer], [], {
  firebase: client,
  database: client.database()
})

// v actions.js
const requestInvoiceFromApi = (invoiceId, { database }) => {
  return database.ref(`users/${id}`).once('value')
}
requestInvoiceFromApi.services = [
  // takhle si vyžádám service database do objektu který bude vždy poslední parametr funkce
  'database'
]
```
Tak jdeme na to, ne? Stačí jenom servicy uložit do storu, přidat k nim getter a pak ve funkci connect je vytáhnout do akcí.

Takže bude potřeba upravit funkce `connect()` která spojuje akce se Reactem a `dispatch()` funkcí:
```js
_createAction = (action) => {
  const services = this.context.store.getServices()
  const requestedServices = (action.services || []).reduce((providedServices, serviceName) => {
    return {
      ...providedServices,
      [serviceName]: services[serviceName],
    }
  }, {})

  return (...args) => {
    this.context.store.dispatch(action(...(args.concat([requestedServices]))))
  }
}

_prepareActions() {
  const actionKeys = Object.keys(actions)
  return actionKeys.reduce((wrappedActions, actionKey) => {
    wrappedActions[actionKey] = this._createAction(actions[actionKey])

    return wrappedActions
  }, {})
}
```
Takže jsme si vytvořili metodu `_createAtion()`, která zase jenom obalí původní action creator (funkce vracející akci) a podle klíčů, které může action creator mít v property `services` (funkce v Javascriptu je také objekt), ji předáme jako poslední argument požadovaný objekty se závislostmi.

No není to ale elegantní? Samozřejmě by to šlo vyřešit i jinou cestou, ale tohle je myslím dostatečné, zatím...

