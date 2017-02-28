![Nautč se React.js](https://image.ibb.co/dnb7tv/react_event_fb_title_v03.png)

# Naučte se React.js 1/3 - React pt.2
Tak v minulé části jsme si vyvětlili a ukázali, proč není super nápad používat jQuery styl na velká UI. Nebyl to hejt na knihovnu jQuery, byl to hejt na styl, jakým se používá na tvorbu dynamického UI.

Klasická HTML šablony implementované v Javascriptu se pro takový úkol hodí mnohem více, ale jejich problém tkví v tom, že jsou jenom parsovače stringu používající `String.replace()` a nic víc. Nepomáhají nám psát lepší a bezpečnější kód.

Nicméně přístup vytváření HTML je cestou, kterou se vydat, daleko lépe se hodí pro tvoření velkého UI.

Jako poslední jsme si ukázali styl, kdy píšeme celé UI v Javascriptových funkcích a tahle cesta vyřešila všechny problémy jQuery přístupu či javascriptových HTML šablon.

Narazili jsme ale na neduhy a k jejich vyřešení potřebujeme splnit tyto body:

- dokopat Javascript ke kontrole typů argumentů, chodících do šablon
- zefektivnit vykreslování šablony - aby se upravilo jen to, co je potřeba a udržovaly se instance inputů, aby neztrácely focus apod.
- přidat možnost psát šablony v přívětivějším duchu tak, aby kodéři neprskali

Asi vás nepřekvapí, že všechny tyhle problémy vyřeší knihovna React za nás. Jdeme na to.
## Zázraky funkcí
Ještě než se vrhneme na samotný React, tak bych se chtěl vrátit k našemu přístup s čistým Javascriptem. Slíbil jsem, že si ukážeme, jak jednoduché je si napsat serverové renderování, pokud máme čisté funkce. No a co jsem slíbil, to dodržím!

Tak pokud se podíváte na kód [zde](../pt.1-jQuery-to-React/javascript/server.html) a spustíte si ho v prohlížeči, tak si všimnete prostě textu, který se vypíše jenom na klientu tj. HTML, které přichází ze serveru je prázdné, je tam pouze jeden `<div id="app"></div>` kam se renderuje aplikace. Renderování probíhá jenom na klientovi.

No a když se podíváte [sem](../pt.1-jQuery-to-React/javascript/server.js) tak tady je kód pro spuštění klasického HTTP serveru v Node.js, který zatím nedělá nic. Spustíte si ho příkazem:
```bash
yarn server
```
Na url [http://localhost:9999](http://localhost:9999) vám nyní běží ten zázrak. Vypíše se pouze nějaký text, nic zvláštního.

No ale pokud vezmu náš známý kód, který přes objekt `DOM`, který přes metody `DOM.div(), DOM.span() ...` vytvářel DOM elementy a zkopírujete ho do `server.js` a změníte dvě řádky, tak uvidíte, jaké se budou dít věci...

Stačí jenom upravit tyhle řádky:
```js
var DOM = createDOM(document)
// na:
var DOM = createDOM(serverDocument)

// a
res.send(html.replace('{HTML}', 'SERVER'))
// na:
res.send(html.replace('{HTML}', renderApp(initialState)))
```
Restartujeme server a voilá!

To bylo snadné, co? Zkuste si tohle udělat se nějakou Javascriptovou šablonou, jestli to pude tak snadno.

Asi vás nepřekvapí, že téhle jednoduchosti využívá React a je schopný svoje šablony vyrenderovat i na Node.js serveru!

To znamená, že SEO netrpí a aplikace nečeká na to, až stáhne Javascript, aby vůbec něco zobrazila, skvělé!

## Hurá na ten React
Takže už opustíme do Reactu jako takového.

### Těžké začátky...
Určitě jste zaregistrovali články jako slavné Javascript Fatique nebo vtípky na téma, že při hackathlonu se povedlo nainstalovat pouze Babel, takže se nikdo ani k Reactu nedostal.

Jak to tak chodí, všechno to jsou takové polopravdy. React se dá použít stejným stylem jako jQuery, byť to opravdu je daleko od nějaké produkční konfigurace.

Nicméně jsme skončili někde [zde](./basic.html). V tomhle příkladu renderujeme dvě úrovně nadpisu a k tomu ještě ukážeme `input`, který upravuje hlavní nadpis. Myšlenka byla taková, že při každém stisknutí klávesy se má aktualizovat nadpis podle toho, co je v inputu. To sice funguje, ale input ztrácí focus. Ten důvod je jasný, naše primitivní implementace není schopná udržet instance vyrenderované komponenty, takže ji pořád nahrazuje.

Stejně tak mrháme výkonem, protože přerenderováváme celou aplikaci, ačkoli to je naprosto zbytečné, potřebovali bychom v DOMu aktualizovat jen ty kousky, které se změnili.

Myslím, že tedy pohřbíme vlastní implementaci a vrhenem se na něco, co je už daleko víc vyvoněné a funkční no a to je React.

#### Jak to rozjet
Jak ho ale naroubujeme na naší implementaci DOMu? No, věřte tomu nebo ne, je potřeba do naší implementačky přidat nahoru jen pár řádek a pár jich smazat.

V podstatě jde jenom o to nahradit:
```js
var DOM = createDOM()

// Reactí
var DOM = ReactDOM

// a místo
renderApp(dom, appElement)

// použít funkci z Reactu
ReactDOM.render(React.createElement(app, defaultData), appElement)
```
Abychom získali všechny globální proměnné, které jsou potřeba, stačí pouze jenom nakopčit do hlavičky klasickým stylem pár scriptů. Jsou to tyhle:
```html
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="https://unpkg.com/react@15/dist/react.js"></script>
<script src="https://unpkg.com/react-dom@15/dist/react-dom.js"></script>
<script src="https://unpkg.com/react-dom@15/dist/react-dom-server.js"></script>
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```
No a pokud jste vše pečlivě nahradilim měla by se vám tedy v souboru íbasic.html](./basic.html) zobrazit to samé, co bez Reactu.

Takže co, je to teda těžké nebo ne?

### Co ten React vlastně je
Trošku jsme se vykašlali na teoretickou část, tak co ten React vlastně je?

No tak srovnání s jQuery je dost nefér, neboť jQuery je knihovna, která toho svede mnohem více než React.

React totiž dělá jenom jednu věc a dělá ji poměrně dobře - šlo by to lépe. React je pouze knihovna pro tvorbu DOMu a jeho efektní modifikaci. Nic víc ni míň.

Reactem tedy sám o sobě neumí:
- request na server
- parsování cookies
- routování
- modelovat logiku aplikace

React se tedy soustředí na jednu jedinou část v procesu psaní SPA aplikace a to je view - DOM a jeho chytré aktualizování. Proto se React nedá srovnávat ani s Angularem. Neboť Angular je programovací rámec aplikace - framework, v podstatě tu aplikaci píšete "v mezích" nebo "uvnitř" Angularu. Kdežto React je opravdu jenom knihovna pro vypisování HTML. Pokud tedy budete chtít psát nějakou velkou aplikaci, tak se zřejmě neobejdete bez něčeho jako je Angular.

Například v Avocode jsme si postavili vlastní "framework" byť si teda myslim, že ten náš "framework" je tak jednoduchý, že se o frameworku opravdu nedá mluvit.

Samozřejmě okolo Reactu vyrostlo nějakolik přístupů jak tvořit aplikace a některé z nich jsou opravdu revoluční, třeba Flux arichtektura a její implementace Redux. Nebo úžasně jednoduché MobX. O těhle srandách se brzy dovíte.

Teď ale bychom si měli říct, jak přemýšlet "React way" a tak si zkusíme napsat pár jednoduchostí.

### Zvláštnosti
Opravdu divnost Reactu, která je taková no, jak to vyjádřit. Prostě každej si toho všimne a začne se tomu vysmívat, asi proto neexistuje výraz. Prostě něco, čeho si všimnete jako prvního, vysmějete se tomu, zavřete tab prohlížeče a napíšete o tom posměšný tweet. Tak taková věc je v Reactu JSX.

Co to je? Toto:
```js
const renderButton = (props) => {
  return (
    <button className="btn btn-success">Click me</button>
  )
}
```
Říkáte si WTF? Jakože HTML v Javascriptu? Tak je čas opustit přednášku, napsat posměšný tweet :)).

Tohle má svoje důvody.

Pamatujete si, jak jsme se bavili o tom, že psát UI, jehož výstupem je HTML v čistých javascriptových funkcích je prostě nečitelné a nepřehledné? To samé si řekli vývojáři Reactu a vymysleli tuhle syntax - JSX.

V první řadě bych chtěl podtrhnout a skoro vykřiknout, že tohle **není** HTML. Neboť HTML je statický značkovací jazyk. Zatímce JSX v podstatě je Javascript. To, že napíšete:
```js
return (
  <button className="btn btn-success">Click me</button>
)
```
Říkáte: Zavolej funkci `button` s argumetem `{ className: 'btn btn-success', children: 'Click me' }`.

Nic víc!!! Navíc tenhle kód nejde ani spustit v prohlížeči (jde to, ale není to dobrý nápad dělat v produkci), tohle je čistě pseudosyntaxe, syntaxsugar nad Javascriptem. Nic víc nic míň. Bylo to vynalezeno právě proto, aby kodéři neprskali a měli se čeho chytit. Hlavně prosím prosím, neříkejte HTML v JavaScriptu nebo mi vybuchne hlava :)).

Takže co se jako s timhle kódem stane, aby šel pustit v prohlížeči?

Před:
```js
const renderButton = (props) => {
  return (
    <button className="btn btn-success">Click me</button>
  )
}
```
Po kompilaci:
```js
const renderButton = (props) => {
  return (
    React.createElement('button', {
      'className': "btn btn-success",
      'children': 'Click me',
    })
  )
}
```
Takže žádné HTML, jenom funkce, která vrací DOM element - Javascriptový objekt, žádný HTML string.

Abychom si vyzkoušeli JSX, tak klidně můžeme použít `standalone babel transpiler` rovnou v prohlížeči.

Tohle je jenom na hraní! Ten transpiler je obrovský, takže to v produkci nemá co dělat. Pro produkci je nejlepší si kód prostě hezky zkompilovat a připravit, né to cpát prasácky jako inline skripty bez explicitní závislosti!!!

Ukázku JSX přímo v prohlížeči si můžete prohlédnout zde a rovnou začnem psát naší styleguidovou apku, tentokrát už zcela v Reactu.
### Základy React API
#### Tvorba komponent a props
React API je snadné. Můžete si vybrat, jestli psát komponenty jako funkce:
```js
const renderButton = (props) => {
  return (
    <button className="btn btn-success">Click me</button>
  )
}
```
Nebo jako třídy.
```js
class Button extends React.Component {
  render() {
    return (
      <button className="btn btn-success">Click me</button>
    )
  }
}
```
V případě třídy nám `props` tj. argumenty předané takto:
```js
<button className="btn btn-success" onClick={naKlik}>Click me</button>
```
Přicházejí jako `this.props`.
Tudíž, zavoláme-li třídu `Button` takto:
```js
const renderButton = (props) => {
  return (
    <Button className="btn btn-success" onClick={naKlik}>Click me</Button>
  )
}
```
Tak uvnitř této třídy budu mít dostupné:
```js
this.props = {
  className: 'btn btn-success',
  onClick: naKlik,
}
```
Takže důležitý pojem jsou `props`. To jsou parametry předané komponentě, v případě funkce je jasné že jsou jako první argument funkce. Props jsou vždy objekt.

#### Stav komponent - state
Pokud předáváte jenom props, tak nejste schopni nic měnit za běhu - aplikace prostě jenom vyrenderuje, nic víc, není možné nic změnit.

Na změnu stavu komponenty používáme metodu `this.setState()`.

Tahle metoda bere jako argument funcki nebo objekt. Jednodušší je předat objekt.

`this.setState()` je možné logicky použít jenom u komponent, které jsou vytvořené jako třídy. Takže můžeme udělat třeba jednoduché počítadlo kliknutí.

Zdrojá si prohlédněte [zde](./counter.html).
```html
<script type="text/babel" data-presets="es2015,stage-0,react">
class Counter extends React.Component {
  state = {
    count: 0,
  }

  handleClick = () => {
    this.setState({
      count: this.state.count + 1,
    })
  }

  render() {
    return (
      <div>
        <button className="btn btn-success"
          onClick={this.handleClick}
        >{`You clicked: ${this.state.count} times`}</button>
      </div>
    )
  }
}

ReactDOM.render(<Counter />, document.getElementById('app'))
</script>
```
Pozor, tady spouštíme `JSX` v prohlížeči - znovu opakuji, prohlížeč nedokáže spustit `JSX`. Proto musíme použít prasárnu a transpilovat přímo v prohlížeči, všimněte si proto `<script>` tagu:
```html
<script type="text/babel" data-presets="es2015,stage-0,react"></script>
```
Nepoužíváme `text/javascript` ale `text/babel` a k tomu ještě divoká nastavení přes `data-presets`. Zatím netřeba řešit proč to tak je, stačí zkopčit a jet. Nezapomeňte na všechny skript z hlavičky!! Jinak vám to nepojede.

Tak tohle jsou opravdové základy Reactího API, je toho víc. Zbytek se dozvíte od Petra Brzka a Jirky Vyhnálka.

Teď ale k naší styleguidové apce.
### Create React app
Je opravdu blbej nápad používat všechny skripty inline a transpilovat babelem přímo v prohlížeči, je to pomalé a stejně to v produkci nikdy nepoužijete, leda byste byli... No... Ale radši nechci ani řikat kdo.. :))

V repu jsem připravil takovou ultimátní hračičku, která se jmenuje `CRAP` neboli `create-react-app`. To je opravdu ta nejjednodušší cesta jak rozjet apku v Reactu. No a pak se můžete smát těm haterům, kteří nikdy nerozjeli Babel :).

Takže stačí napsat v rooto tohodle repa. (samozřejmě po instalaci NPM balíčků)
```bash
node_modules/.bin/create-react-app moje-aplikacka
```
Co to udělá? No prostě to vytvoří složku `moje-aplikacka` a když se pak do ní nastavíte, tak můžete jednoduše spustit
```bash
npm start
```
A rozběhne se vám reactí apka se všema možnejma vychytávkama, aniž byste hnuli prstem... Zdrojáky jsou samozřejmě hezky dostupné v `moje-aplikacka/src` a jakmile je upravíte a uložíte, tak se stránka refreshne bez práce.

Navíc máte k dispozici JSX a vůbec všechno a pěkně to funguje. Takže si jdeme hrát!

Přepíšeme Aspoň dvě styleguidové komponenty do pravých reactích komponent! Jdeme na to!

Inspirace je [zde](./index.html).
