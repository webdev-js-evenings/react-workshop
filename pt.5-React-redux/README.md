![Nautč se React.js](https://image.ibb.co/dnb7tv/react_event_fb_title_v03.png)

# Naučte se React.js 6 - Redux
## Minule
[Minulý workshop](../pt.4-React-sprava-stavu) ukázal, jak si vytáhnout stav z komponenty "někam jinam". Neboť už Sumerové, jak známo, zaznamenávali stavy jejich aplikací mimo view vrstvu. Nebyli to prasata, aby psali SQL query a připojení do databází přímo do "HTML".

Vytažení stavu z "živých" komponent přineslo výhody v tom, že s kód komponent zpřehlednil. Nebylo už třeba řešit `setState()`, nebylo už ani potřeba rozlišovat mezi `this.state` a `this.props`. Najednou se mohly všechny komponenty přepsat do pouhých funkcí.

## Dneska
Tak to je všechno pěkný, ale má to pár much. Zdůrazňoval jsem, že jádro každé aplikace - její byznysová logika - leží ve změnách. Tedy v tom, jak data v průběhu času transformujeme.

Hezky navržená relační databáze je sama o sobě k ničemu, pokud se do ní nedá zapisovat a údaje měnit a nebo je vytahovat a prezentovat. Tohle všechno je **transformace dat**. Tedy merit každá aplikace.

Dnešní workshop se tedy bude točit okolo transformací dat. Hlavně bude o tom, jak se začít dívat na aplikace spíš jako na sekvence událostí než pouhé "obrazovky".

Jdeme na to.

## Apka
Dneska se teda budeme bavit vytvářením apky, která vám pomůže spočítat daně. Hurá, konečně něco opravdu užitečného, což? Zapneme si tam dokonce Firbasku, aby to bylo trošku srandovnější - ale uvidíme, jestli se k tomu vůbec dostaneme. V první řadě si navrhneme tvar stavu aplikace.


## Model
Tedy modelová vrstvička aplikace.

K výpočtu daně potřebujeme znát určitě příjem. Příjem se dá vypočítat ze sumy pohledávek neboli vydaných faktur. Takže určitě bude potřeba seznam faktur.

Každá faktura bude mít číslo, odběratele, cenu, DPH a celkovou cenu. Klasika.

Faktury by mělo být možné přidávat upravovat atd atd. To je jasné.

Daňová kalkulačka si pak vždycky při změně faktur přepočítá všechny potřebné informace. To je samozřejmě pouze jenom příjem, který je potřeba pro výpočet daně. Ještě si k tomu vypočítáme DPHáčko, podle toho, jak zbyde čas.

Takže stav bude vypadat nějak takhle:
```js
const initialData = {
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
    email: '',
    id: 0,
  }
}
```

Přihlášené user si tu zatím ponecháme a použijeme ho pro práci s Firebaskou.

## Akce!
Tak ještě naposledy. To co utváří aplikace jsou **změny stavu**. To je po tvaru stavu to nejdůležitější v aplikaci. Proto je dobré o takových akcí mít vždy co největší podvědomí a vědět přesně, co dělají. Nebo dokonce co celá aplikace může dělat.

V minulé lekci jsme neměli definováno nic jako "akce". Změnu stavu aplikace byla provedena buďto přes `this.setState()` na React komponentně.

Nebo přes nějaký předaný callback přes props, který jsme si nějak sémanticky pojmenovali. Třeba `setTodoDraft()` nebo `addTodo()`.

Tohle můžeme prohlásit za dostačující. Za docela hezkou architekturu.

Jen drobné vylepšení můžeme poskytnout do naší aplikace tak, že přidáme nějakou jasnější informaci o tom, co se v aplikaci děje. Sice z názvu funkce `addTodo()` je jasné, že přidává další TODOčko, ale možná by nebylo od věci si akce pojmenovat nějakuo hezkou konstantou ve stringu třeba `ADD_TODO`.

Tohle se může hodit například při debugování nebo při streamování akcí přes sockety do jiného počítače. Také můžeme pak poměrně jasně vidět, jaké akce jaká část aplikace využívá a můžeme si je sémanticky shlukovat. navíc nám to nedá tolik práce. Případné API si představuji takto:
```js
const addTodo = action('ADD_TODO', (todoText) => {
  return {
    text: todoText,
    id: uuid.v4(),
  }
}) => {
  action: 'ADD_TODO',
  payload: {
    text: todoText,
    id: id,
  }
}
```
Prostě jenom funkci obalíme.

Další prvek vylepšení funkcí by mohlo být oddělení toho, jak se vytváří akce (jestli přichází jen z UI nebo jestli přichází jako nějaká aktivita třeba ze sítě nebo z URL apod.). Pokud tohle chování oddělíme můžeme si pak všimnou toho, že se naše aplikace izoluje od okolního světa:

```
                _________AKCE________
                |                   |
                A                   A
--Kliknutí--->  K                   K  <----------HTTP--------
--WebSocket-->  C     Naše apka     C  <-----history.push()---
                E                   E
                |                   |
                ---------AKCE--------
```
To sem hezky nakreslil!

Akce se chovají jako hranice mezi okolním světem (prohlížeč, klávesnice, síť) a naší aplikací, bude to taková hradba, aby se do apky nedostával bordel zvenčí.

Jediná věc, které bude rozumět naše aplikace budou jenom akcičky. To znamená, že bude vědět, jak zpracovat takovýto příkaz:
```js
{
  action: 'ADD_TODO',
  payload: {
    'todoText': 'Nová todo',
    'id': '12323SDFSDFadf',
  }
}
```
Ale nebude cesta, jak v apce něco "zavolat" nějakou metodu zvenčí. Jakákoliv komunikace s naší aplikací se bude muset přeložit do předem definované akce, které bude apka rozumět.

Teď ale je otázka, jak bude apka akce zpracovávat. O to se postará Store.

## Store
V předešlé lekci jako Store, neboli jako komponenta držící stav, nám postačila jen kmponenta. A posloužila opravdu dobře. Komponenty totiž sami od sebe umí vše překreslit při nějakém volání `setState()` takže nebylo potřeba vytváře nějaké listenery apod.

Ale to, že stav byl je v komponentně sebou neslo tu nevýhodu, že byl pouze jenom celý přístupný jen v jedné "vrchní" chytré komponentě a né někde dole.

Pokud si představíme nějaký strom komponent:
![Strom komponent](http://arqex.com/wp-content/uploads/2015/02/trees.png)

Tak všude vidíme tenhle nevinný obrázek. No jo, ale většina aplikací je daleko, daleko komplexnějších a mají v sobě ohromné zanoření komponentového stromu. Pokud máte jenom dvě úrovně, tak máte miniaplikačku. Takové Avocode má takových úrovní fakt mraky a každá velká aplikaci na tom bude podobně.

To znamená, že by bylo dost šílené si předávat všechny potřebané props pouze z jednoho místa až dolů někam totálně hluboko do stromu. Stalo by se tak, že by komponenty dostávaly props, které by jenom přeposílaly dál a to je znak trošku smrdutého kódu neboť není potřeba, aby lord prosil Jeana, aby mu přinesl klavír, protože na něm má doutník. Každý by měl dostat jen to, co potřebuje a tak je to i s Props.

Takže jak se toho zbavit.

No, naštěstí tu máme velkou obeličku a tou je React a jeho `context`.

### Context
Pokud jste o Contextu v Reactu neslyšeli, tak to je takový maličký hack. Je to vlastně takový DI container zabudovaný v Reactu, který funguje pouze přes Stringy. Jeho použití je následující.

Řekněme, že máme službu třeba `API`, které requestuje nějaké endpointy. Pokud byste se striktně držely Reactí filozofie, tak byste si museli předávat referenci na `API#get()` do stromu komponent až tam, kde je to potřeba. To je ale trošku šílené, ne?

Proč takle radši APIčko Reactu nepředhodit, aby ho distribuoval, kde je potřeba:
```js
class extends React.Component {
  static childContextTypes = {
    api: React.PropTypes.Object,
  }

  getChildContext() {
    return {
      api: new Api(new HttpRequestFactory()),
    }
  }

  render() {
    return (
      <HlavniKomponenty /> // ta má dítě DiteHlavniKomponenty
    )
  }
}

class DiteHlavniKomponenty extends React.Component {
  static contextTypes = {
    api: React.PropTypest.object.isRequired, // řekneme si o api v context, něco jako v /* @injext */ v Nette
  }

  render() {
    const api = this.conext.api // Juhů takle je API dostupné a nic není potřeba předávat přes props.

    return (..)
  }
}
```
Parádička. Samozřejmě zkušení architekti cítí, že je to prasárnička, ale to přejdeme. My si totiž ten kontext pečlivě schováme, abychom se o něj nemusely starat!

### Context provider
Často můžete vidět kód:
```js
render() {
  return (
    <ApiContextProvider api={new Api()}>
      <HlavniKomponenta />
    </ContextProvider>
  )
}
```
Takle se hází do Reactího stromu komponent kontext. Takováhle `ApiContextProvider` komponenta pak uvnitř vypadá takto:
```js
class ApiContextProvider extends React.PureComponet {
  static contextTypes = {
    api: React.PropTypes.object,
  }

  getChildContext() {
    return {
      api: this.props.api,
    }
  }

  render() {
    return this.props.children
  }
}
```
Takováhle komponenta pouze vezme svoje props a hodí je do contextu, aby byly přístupny hluboko v DOMu bez nutnosti je předávat.

Této vlastnosti využijeme, abychom už ale naprosto oddělili stav aplikace od Reactu a jeho API.

#### Connect
Connect bude dekorátor, kterým obalíme komponentu proto, aby byla schopná přijmout data z jednoho hlavní storu kdekoliv ve stromu komponent. Tedy ne už někde na vrcholu stromu, ale klidně někde hluboko ve stromu. API si předtavuji takto:
```js
class ConnectedReactComponent extends React.Component {
  render() {
    console.log(this.props.invoicesFromTheStore)

    return (...)
  }
}

connect({
  'invoices': 'invoicesFromTheStore', // klíč - klíč ve stavu, hodnota - název klíče v props, který půjde do componenty
}, actions)(ConnectedReactComponent)
```
Voila, elegantní, že? Samozřejmě komponenta se bude chovat porádně stejně jako každá jiná, jen bude trošku obohacena o pár klíčů ze Store.

Druhý parametry funkce `connect()` bude objekt s akcemi, ty pak přijdou do komponenty jako props:
```js
connnect(propsFromStore, {
  'onInvoiceAdd': () => ({ // V komponentě pak bude tahle funkce přístupná jako props.onInvoiceAdd
    'invoice': { // výseledek volání funkce bude přímu dispatchnut přes store
      price: 300,
      VAT: 21,
    }
  })
})(ConnectReactComponent)
```


### Gimme da Store
Takže store nebude nic jiného než event emitter, který bude mít referenci na stav a bude ho průběžně měnit:
```js
class Store {
  _listeners = []
  _state = {}

  constructor(initialState) {
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
}
```
Ok, super, jak ale budeme ten stav měnit?

Na si vytvoříme metodu `dispatch()`, která převezme akci a aplikuje ji na stav... Hmmmm. Aplikuje akci na stav:
```js
aplikujAkciNaStav(stav, akce) => nový stav
```
Tohle je hrozně jednoduchá myšlenka, na které se dá stavět.

Přece naše aplikace jest pouze a jenom o změnách nějakého stavu. Stav máme nadefinovaný a změna stavu - no minimálně její jedna část je akce, pamatujete? To je prostě jendoduchý popis změny:
```js
{
  action: 'ADD_TODO',
  payload: {
    'todoText': 'Nová todo',
    'id': '12323SDFSDFadf',
  }
}
```
Takováhle akce říká: Moje drahá aplikace, proveď prosímtě změnu stavu, kterou jsme pojmenoval `ADD_TODO` tak, že přidáš nové todočka s textem `Nová todo` a idčkem `12323SDFSDFadf`. Postarej se o to.

Dobře, takže máme vydefinovanou akci, teď ale jak aplikovat změnu. Potřebujeme totiž změni stav aplikace za pomoci výše vydefinované akce. Jak na to?

Takže my chceme vzít jednu akci a jeden stav a vytvořit z ní jednu věc -> nový stav.

To je vlastně redukování, vezmeme stav a akci a vrátíme změněný stav (nový stav). To je přece jasně zapsané tady:
```js
aplikujAkciNaStav(stav, akce) => nový stav
```
Takže stejně tak naimplementujeme metodu dispatch...
```js
dispatch({ action, payload }) {
  if (action === 'ADD_TODO') {
    this._state.todos.push({
      text: payload.todoText,
      id: payload.id
    })

    this._emitChange()
  }
}
```

A je to... No.. Je to. Trošku tu lžu, tohle nevrací totiž nic. Co ale kdybychom si tu změnu předali přes konstruktor do Storu?

A jak se ta změna jmenuje? No když něco `redukujeme`, tak se jedné o `reducer`:
```js
class Store {
  _listeners = []
  _state = {}
  _reducer = null

  constructor(initialState, reducer) {
    this._state = initialState
    this._reducer = reducer
  }

  //...
}
```
A teď metoda dispatch lépe a hezčeji:
```js
dispatch(action) {
  this._state = this._reducer(this._state, action)
  this._emitChange()
}

// samotný reducer - musí být čistá funkce
const reducer = (state, { action, payload }) => {
  if (action === 'ADD_TODO') {
    state.todos.push({
      text: payload.todoText,
      id: payload.id
    })
  }

  return state
}

// předání reduceru
new Store(initialState, reducer)
// Tadáá
```
A to je všechno! Máme naprosto luxusní nový store, který umí naprosto všechno, co naše aplikace bude pro změnu stavu potřebovat. Fakt!

Teď si to dáme hezky všechno dohromady, to znamená, že si vytvoříme:
- `StoreContextProvider`
- `Store`
- `Actions creators`
- `connect()` funkce pro pro spojování komonent se storem kdekoliv ve stromu

Tak si napimplementujeme přidávání Faktur. Mělo by to fungovat tak, že klikneme na tlačítku `Přidat fakturu`, vyskočí modální okno a tam bude jednoduchý formulář pro přidání faktury.

Do toho! Uvidíme co stihneme, příště to napojíme na Firebasku a live updaty!
