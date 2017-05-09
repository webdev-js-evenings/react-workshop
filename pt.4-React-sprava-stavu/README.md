![Nautč se React.js](https://image.ibb.co/dnb7tv/react_event_fb_title_v03.png)

# Naučte se React.js 5 - na Redux
V téhle části si **pomalu** vysvětlíme proč se používá v React to, co se používá a proč to né zcela pasuje na možné známější backendové aplikace.

Prostě si opravdu napíšeme vlastní plnohodnotný balíček pro práci se stavem, vlastně takový Redux.

OK, né zas tak rychle. V první řadě si je třeba ukázat v čem je problém.

S Petrem jsme si konečně napsali docela pěknou aplikačku, která vám třeba pomůže v učení se té hrozné haldy pojmů okolo Javascriptu, že?

Takže se dá říct, že práce s komponentami už tak nějak zvládáme a můžeme se vrhnout na to trošku komplikovanější a to je konečně celá aplikace.

## Co je to aplikace
Každá aplikace se skládá ze tří částí, které můžou mít různé názvy, ale v zásadě se ustálilo označení:
* M - model
* V - view
* C - controller
---------------
* S - service

Věřte tomu nebo ne. Ekosystém okolo Reactu též ctí toto uspořádání, ačkoli se dá hovořit o nějakém to [CQRS](https://martinfowler.com/bliki/CQRS.html) nebo co to je.
Každopádně bych se rát pohyboval v přátelštějších prostředí než se koukat do nějakého šíleného computer science.

Pod čáru jsem ještě přidal zmínku o `Service`. Prostě servisy. Takový typ "třídy" se v aplikacích též hojně vyskytuje a má celou řadu vyjímečností...

### Jak se co nazývá v Reactu
Když jsme psali Reactí komponenty, tak bylo zvykem mít tu velkou root komponentu naplněnou stave `state`. V takovém případě takováto komponenta vlastně
zastává práci modelu a zároveň i kontroloru. Může dokonce zastávat i funkci view, pokud celá šablona bude vypsána v téhle jedné komponentně.
To ale jistě není rozumnější.

Takže narvat si tři části aplikaci do jedné "šablony" je samozřejmě zvláštní nápad, protože jasně mícháme něco, co má zcela jiné odpovědnosti, že? Takže se pustíme do rozsekávání nějaké masivní komponenty plné stavu.

Kde začít? Nejsnažší je pro začátek vzít veklkou komponentu, která vykresluje všechno a udělat z ní "kontroler" ve terminologie Reactu z ní můžeme udělat Root komponentu nebo "chytrou" komponentu, která drží handlery callbacků a stav.

Takže můžeme z ní udělat třeba něco takovéhleho:
```js
export default class StatefulComponent extends Component {
  state = {
    todos: [
      { id: 1, text: 'Nákup pro maminku na SváTek maTek' },
      { id: 2, text: 'Nakoupit na víkendovou kalbu 2 kila lososa rozpejkací bagetky' },
    ],
    user: {
      name: 'Vojta',
      email: 'vojta.tranta@gmail.com',
      id: 666,
    },
    time: Date.now(),
    formValue: '',
  }

  _handleTick = (time) => {
    this.setState({
      time,
    })
  }

  _handleFormChange = (nextValue) => {
    this.setState({
      formValue: nextValue,
    })
  }

  _handleFormSubmit = () => {
    this.setState({
      todos: [{
          'id': Date.now(),
          text: this.state.formValue,
        }].concat(this.state.todos),
      formValue: '',
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Webdev React!!</h2>
          <Clock tick={1000} time={this.state.time} onTick={this._handleTick} />
        </div>
        <h2>Stateful component</h2>
        <h3>A list of todos</h3>
        <Form value={this.state.formValue}
          onChange={this._handleFormChange}
          onSubmit={this._handleFormSubmit}
        />
        <ul className="list">
          {this.state.todos.map(todo => {
            return <Todo todo={todo} />
          })}
        </ul>
      </div>
    );
  }
}

```
Je to jednoduché, místo toho, aby komponenta renderovala všechno, tak si vybere jen pár elementů a pak je vypíše, předá jim správná props a povídá si s nimi přes callbacky v props.

Takováto architektura může připomínat klasický `Presenter` nebo `Controller`, který můžete znát z jiných jazyků či frameworků:
```php
class Controller extends BaseController {
  __construct($todoFacade, $context) {
    $this->todoFacade = $todoFacade;
    $this->context = $context;
  }

  public index($request) {
    return $this->_createResponse($request, 'templates/index', [
      'page_title' => 'Index page!',
      'todos' => $this->todoFacade->getTodos($request.get('page')),
    ]);
  }
}
```
Tohle je příklad v PHP. Tak nějak vypadá nějaký typický kontroler, který vykresluje indexovou stránku pomocí šablony, který je umístěná v `templates/index`. Data do ní cpe z nějaké databázové fasády `TodoFacade`.

Podobně funguje i rootová reaktí komponenta. Sebere data a narve je do šablony. Šablony jsou v tomto případě nějaké nižší jednodušší komponety, které z pravidla nedrží stav a jen využívají props.

Tedy závěrem můžeme jednoduše říci, že "chytrá" komponenta tedy taková, která má stav a realizuje callbacky z potomků a rozdává do nich props je vlastně takový controller tj. v MVC zaujímá písmenko C.

Hloupé komponenty jsou naproti tomu takové, která pouze přímají props a přes callbacky si povídají se svými předky. Předkům jsou tudíž plně podrobeny. Můžeme o nich tedy říct, že jsou to views, tedy V v MVC struktuře.

### A co "M"?
M je tedy model, jak se řeší modelová vrstva v reactových aplikacích?

Pomůžeme si zase příkladem ze známého světa PHP. Máme-li formulář, kde je například vypsán uživatelův profil, tak tento formulář často odpovídá jedné  řádce tabulce v databázi, která se typicky jmenuje `user` nebo `user_profile`. Jakmile zde upravíme nějaká data, a odešleme formulář, tak se celá stránka překreslí a my vidíme nový stav uživatelova profilu, jasné jako facka?

Tohle v SPA aplikacích ale samozřejmě nechceme. Proč bychom kvůli změně jednoho políčk překreslovali celou stránku, když by stačilo změnit pouze jednu hodnotu inputu, že.

Jak to tedy udělat. Budeme tedy mít nějakou instanci modelu `User` a všechny komponenty na ní budou poslouchat, jak se mění, že?

No, tak to úplně není. Každý model by musel být v tom případě nějaký event emitter a museli bychom ručně registrovat nebo odregistrovávat posluchače na tuto jednu instanci, která se navíc může v průběhu času měnit.

To by bylo trošku šílené.

Samotnout ideu modelu už v sobě mají Reactí komponenty zabudovanou. Je to property `state` a metoda `setState()`.

Zajímavé na tom je, že React se nesnaží vytváře nějaký Event emitter, vůbec se s ním v Reactových komonentách nesetkáte.

Pokud chcete změnit stav, prostě zavoláte `setState()` a to je všechno. Komponenta se sama překreslí a tím pádem aktualizuje i všechny svoje "děti", které vykresluje v metodě render.

Samozřejmě tohle není ideální a perfektní řešení z hlediska výkonu, ale z hlediska jednoduchosti není co vytknout, potřebuju-li změnit stav, tak to prostě udělám.

Model je tedy vyřešený?

### View != Model
Už staří Egypťané ve svých hyeroglifech varovali před tímto:
```php
<?php
  $mysql = mysql('localhost', 'root', 'mypassword');
  mysql_query('SELECT DATABASE accounting');
?>

<table>
<?php
  $inovices = mysql_query('SELECT * FROM invoices LIMIT 10')
?>
<tbody>
  <?php foreach($invoices as $invoice): ?>
    <tr>
      <?php foreach($invoice as $key => $value): ?>
        <td><?= $value ?></td>
       <?php endforeach; ?>
    </tr>
  <?php endforeach; ?>
</tbody>
</table>
```
Cítíte tu zrůdnost v tomhletom?

No zkrátka, není správně dávat logiku (logika != Javascript) - myšleno to, jak se data tahají apod, a view (šablony) na stejné místo.

Tedy přichází na scénu separation of concerns. React je knihovna pro tvorbu UI, není to knihovna pro správu dat.

Jen abychom si rozuměli. Není špatné mít pár klíču ve `state` aplikace, ale je špatně mít tam stav celé aplikace - pokud už je aplikace velká. Stejně tak není rozumné mít v root komponentě všechny metody pro jeho změnu. Například není důvod, aby proces přihlášení uživatele byl v komponentě `Homepage`, může být v `LoginForm`, ale tam zase není radno dávat nějaký http requesty a podobně.

Věcím je třeba dát řád podle toho, čeho se týkají a nemotat jablka a hrušky nebo skončíte u PHP a tam už jsme byli...

## Model? Stav!
React tak nějak přišel s myšlenkou, že bychom se na aplikace měli koukat čistě jako na funkci stavu:
```
aplikace = šablona(stav)
```
A to je vše, nic víc není potřeba.

A co je stav? No stav je pouze soubor klíčů je to v javascriptové terminologii objekt, který má klíče různých typů, u naší komponenty to vypadá takto:
```js
state = {
  todos: [
    { id: 1, text: 'Nákup pro maminku na SváTek maTek' },
    { id: 2, text: 'Nakoupit na víkendovou kalbu 2 kila lososa rozpejkací bagetky' },
  ],
  user: {
    name: 'Vojta',
    email: 'vojta.tranta@gmail.com',
    id: 666,
  },
  time: Date.now(),
  formValue: '',
}
```
A to je všechno, celá aplikace. Nic víc není potřeba k jejímu zobrazení, všechny informace jsou zde obsažené.

Tedy stav je vlastně objekt a proč bychom ho museli mít přímo v jedné komonentě, nešlo by ho prostě vytáhnout ven?

O co přijdem, pokud to uděláme? No přijdeme o možnost ho měnit přes `setState()` tak ho tedy necháme nadále obaleného v komponentě. Jaké budou benefity?

No můžeme vytvořit dekorátor:
```js
const createApp = (AppComponent) => (state) => {
  return class extends React.PureComponent {
    state = state

    _updatState = (stateUpdate) => {
      this.setState(stateUpdate)
    }

    render() {
      const props = {
        ...this.state,
        updateState: this._updatState,
      }

      return <AppComponent {...props} />
    }
  }
}
```
Dekorát je pouze funkce, která bere Reaktí komponentu jako argument a vrací funkci, která očekává stav jako argument a následně vrátí novou Reactí komopnentu, která je vlastně chytrá komponenta, která je ale už naprosto generická. Výhoda je taková, že už v žádné další komponentně nebude muset být schyzma mezi props a state, vše jsou prostě props.

Použití takovéhoto dekorátoru pak vypadá následovně:
```js
export default createApp(StateLessComponent)({
  todos: [
    { id: 1, text: 'Nákup pro maminku na SváTek maTek' },
    { id: 2, text: 'Nakoupit na víkendovou kalbu 2 kila lososa rozpejkací bagetky' },
  ],
  user: {
    name: 'Vojta',
    email: 'vojta.tranta@gmail.com',
    id: 666,
  },
  time: Date.now(),
  formValue: '',
})
```
Výsledek této funkce je Reactí komponenta, která předala do `StateLessComponent` celý zde nadefinovaný stav a k tomu ještě funkci `updateState`, která je vlastně `setState()` a to je vše.

Takže aplikace funguje dál, jen stačí všude smazat `this.state` a nahradit ho za `props` a `this.setState()` můžeme nahradit za prostou funkci `updateState()`.

Výsledná původní `StatefulComponent` je nyní mnohem jednodušší a přejmenovaná na `StatelessComponent`:
```js

const StateLessComponent = ({ ...state, updateState }) => {
  const _handleTick = (time) => {
    updateState({
      time,
    })
  }

  const _handleFormChange = (nextValue) => {
    updateState({
      formValue: nextValue,
    })
  }

  const _handleFormSubmit = () => {
    updateState({
      todos: [{
          'id': Date.now(),
          text: state.formValue,
        }].concat(state.todos),
      formValue: '',
    })
  }

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Webdev React!!</h2>
        <Clock tick={1000} time={state.time} onTick={_handleTick} />
      </div>
      <h2>Stateful component</h2>
      <h3>A list of todos</h3>
      <Form value={state.formValue}
        onChange={_handleFormChange}
        onSubmit={_handleFormSubmit}
      />
      <ul className="list">
        {state.todos.map(todo => {
          return <Todo todo={todo} />
        })}
      </ul>
    </div>
  )
}
```
Ok, takže stav máme mimo komponentu, teď ještě jeho změny.

### Sémantické a nesémantické callbacky
Asi jsem jediný na světě, kdo této záležitosti dal tak debilní jméno. Jaké záležitosti?

Podívejme se na tyto dvě komponenty:
```js

const Form = ({ children, onSubmit }) => (
  <form onSumit={onSubmit}>
    {children}
    <button>Submit</button>
  </form>
)

const UserForm = ({ onRegisterUserReqest }) => {
  let input
  const _handleFormSubmit = () => {
    const userName = input.value
    onRegisterUserReqest(userName)
  }

  return (
    <div className='user-form'>
      <h2>Registration:</h2>
      <Form onSubmit={_handleFormSubmit}>
        <label>User name:</label>
        <input ref={userNameInput => input = userNameInput} />
      </Form>
    </div>
  )
}
```
Co konkrétně tyto komponenty dělají není příliš podstatné. Jen si ale všimněme, že komponenta `Form` bere callback `onSubmit`. To je prostě obecný callback, pokaždý, když se formulář submitne, tak se tento callback zavolá a je jedno, jaká data jsou ve formuláři, jestli to je formulář pro přidání todo a nebo formulář pro přidání nového uživatele.

Zatímco "chytřejší" komponent `UserForm` bere callback `onRegisterUserRequest`. Tenhle callback už podle názvu značí co se daty bude dít po jejich odeslání. Ale ve své podstatě je to prostě jenom další `onSubmit` callback a nic víc.

Já tedy takovýmto callbackům říkám `sémantické` neboť mi v aplikaci řeší nějkaou byznys logiku. Zatímco `nesémantické` callbakcy jako třeba `onSubmit`, `onClick`, `onFocus` mi neříkají nic o tom, co se má stát, když se zavolají, prostě bylo na něco kliknuto nebo něco bylo submitnuto, nic víc.

Důvod, proč tyhle callbacky odlišuji je ten, že `sémantické` callbacky by se měly vyskytovat jen na úrovni `sémantické` komponenty. Zatímco jejím hloupým dětem (ahoj mami) by mělo bejt šumafuk, co se děje s daty, která odesílají či přijímají.

A co je sémantická komponenta? Však to je jednoduché.
Tohle je například nesémantická komponenta:
```js
const ListItem = ({ title, body, children, id, onClick }) => (
  <li onClick={onClick}>
    <small>#{id}</small>
    <strong>{title}</strong><br/>
    <p>body</p>
    {children}
  </li>
)
```
A tohle je sémantická:
```js
const TodoItem = ({ todo, onTodoClick }) => {
  return (
    <ListItem
      title={todo.title}
      body={todo.body}
      id={todo.id}
      onClick={(e) => onTodoClick(todo)}
    >
      <small>Created on {todo.created}</small>
    </ListItem>
  )
}
```
Je patrný rozdíl mezi těmito komponentami? Jedna pracuje s obecnými daty, druhá, ta sémantická, renderuje konkrétní data do požadované podoby a případně usměrňuje callbacky a vrací do nich přínosná data, napříkald do `onTodoClick` vrátí celý objekt `todočka`, zatímco nesémantická komponenta by prostě jenom vrátila klasický `onClick` s argumentem `e: Event`.

### Proč to vyprávím?
Je důležité si totiž uvědomit, kde končí "chytrý" kód, který implementuje business logiku a tudíž není univerzální a kód, který už je obecný, znovupoužitelný. To vám umožní zobecňovat koncepty a ušetřit si práci a aplikaci zjednodušit.

Co je ale mnohem důležitější je to, že tyhle sématické callbacky dělají vaší aplikací smysluplnou. Proto jsem psal, že tyhle sémantické callbacky definují business logiku a jejich propojení se stav je skutečné jádro aplikace. Není, není to stav aplikace jako takový, ale **cesta jakou se stav mění**.

To je teď největší slabina naší aplikace, změnu stavu je totiž definována pouze jako sémantický callback v "chytré" komponentě, který ačkoli je umístěný v komponentě přesně ví o tom, jak se má updatovat state, ačkoli by mu to mělo být putna. Zaměříme se tedy na refaktor téhle části kódu:
```js
const _handleTick = (time) => {
    updateState({
      time,
    })
  }

  const _handleFormChange = (nextValue) => {
    updateState({
      formValue: nextValue,
    })
  }

  const _handleFormSubmit = () => {
    updateState({
      todos: [{
          'id': Date.now(),
          text: state.formValue,
        }].concat(state.todos),
      formValue: '',
    })
  }
```
### Změna Je život
No tak si představme, že tyhle callbacky v aplikace vůbec nejsou, to by ta aplikace byla pouze jenom statická stránka, ne? Takový PHPečko. Vlastně tyhle funkce jsou to, co dávají téhle aplikaci smysl a jsou proto naprosto esenciální.

První úkol samozřejmě bude je dostat pryč z komponety tj. pryč z View.

Jak na to? Hmm...

Ideální by bylo, abychom dokázali volat z callbacků jenom funkce, která by nějak sami od sebe dokázali aktualizovat stav.

To znamená, že bychom dostali funkce jako prop a tu bychom zavolali na nějaký callback a bylo by to. Ta funkce by měla mít také přístup ke stavu, neboť například aktualizace `todos` je možná pouze na základě původního listu.

Bylo by tedy super prostě jenom aktualizovat stav například u hodin:
```js
export default ({ time, setTime }) => (
  <Clock tick={1000} time={time} onTick={setTime} />
)
```
A funkce `setTime` by jenom vrace aktualizaci stavu
```js
const setTime = (nextTime) => {
  return {
    time: nextTime,
  }
}
```
Hmmm, ale jak toho docílit? No... To je lehounce komplikované, budeme tuto funkci muset prohnat přes náš dekorátor a konteinerovou komponetu držící stav, takže upravíme dekorátor:
```js

const createApp = (AppComponent) => (state, actions) => {
  return class extends React.PureComponent {
    state = state

    _updatState = (stateUpdate) => {
      this.setState(stateUpdate)
    }

    _createActions() {
      return Object.keys(actions).reduce((actualActions, actionName) => {
        actualActions[actionName] = (...args) => {
          return this._updatState(actions[actionName](...args, this.state))
        }

        return actualActions
      }, {})
    }

    render() {
      const props = {
        ...this.state,
        ...this._createActions(),
      }

      return <AppComponent {...props} />
    }
  }
}
```
Metoda `_createActions` obalí funkce, které jí předáme tj: `createApp(Component)({ ..state }, { setTime })` -> funkci `setTime` takovou funkcí, která pokud je zavolaná tak pouze předá argumenty funkci `setTime` a výsledek její práce použije na aktualizaci stavu. K tomu ještě do funkce `setTime` přidá jako poslední argument aktuální stav, aby bylo vše jasné.

Voila!

## Čeho jsme docílili?
Pěkně jsme si zcela oddělili modelovou vrstvu a view vrstu a znatelně jsme rozsekali Controller. Z toho zbyla jenom čistá funkce, která pouze jenom předává data tam a callbacky je vrací zpátky.

Tohle je opravdu elegantní řešení a dá se povýšit ještě o úroveň výše no a to si povíme příště...
