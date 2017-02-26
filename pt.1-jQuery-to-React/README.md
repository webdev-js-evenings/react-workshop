![Nautč se React.js](https://image.ibb.co/dnb7tv/react_event_fb_title_v03.png)

# Naučte se React.js 1/3 - od jQuery po React pt.1
Vítejte na kurzu v rámci naší vývojářské facebookové skupiny [WebDev](https://www.facebook.com/groups/webdevjs/). Materiály, účast a vůbec všechno je zadáčo, akorát nás tak můžete sledovat na naší [fb skupině](https://www.facebook.com/groups/webdevjs/), to bychom byli rádi :).

Tenhle materiál se vztahuje jen k první části kurzu, budou navazovat další, které budou lektořit:

- Petr Brzek [@PetrBrzek](https://twitter.com/petrbrzek) @[Avocode](https://avocode.com/) - React prakticky
- Jirka Vyhnálek [@JiriVyhnalek](https://twitter.com/JiriVyhnalek) @Microsoft - state management, asynchronní kód

Tuhle část kurzu školí Vojta Tranta [@iVojta](https://twitter.com/iVojta). S Reactem si poprvé hrál na podzim roku 2013 a odplivával si nad "HTML v Javascriptu" a nad tim, že JSX transpilátor pro prohlížeč má 1.5MB. Taky mu React nedovolil upravovat input a děly se podobné šílenosti.

Dneska píše React denně ve firmě [Avocode](https://avocode.com/), kde dělá Javascriptového vývojáře na pozici lead kretén.

Moje znalosti jsem nabil především pozorováním práce [Honzy Kůči](https://twitter.com/jankuca), dík!

## Co se v této části naučíte
Tento kurz je určený pro vývojáře, kteří se dlouho dobu (jako já) pachtili s UI, které bylo napsané v jQuery bez jakékoli hluboké myšlenky. A stávalo se jim, že kdykoliv začali psát `$('.selector').each()`, si říkali, že zde není něco v pořádku a že musí existovat nějaká lepší cesta, jak to programovati.

Dnes v 2017 už je vynalezena lepší cesta, jak psát komplexní UI a ta cesta je tzv. "reactí" deklarativní. A o přerodu z jQuery špaget
do deklarativního šablonového kódu si budeme povídat v této části kurzu Naučte se React.js!


## Co k tomu bude potřeba
Naklonovat si tenhle repozitář, to jsme se hezky naučili v [jiném kurzu](https://github.com/webdev-js-evenings/git-workshop) od WebDevu, nastartovat oblíbený textový editor (osobně doporučuji [VSCode](https://code.visualstudio.com/)) a pokud máte chuť si nad tímto repozitářem rozběhat obezličky jako je Flow nebo Eslint, tak pak stačí jen:

```
yarn install
// či
npm i
```
**Pozor!** Tyhle nástroje **nejsou** potřeba k tomu, abyste si mohli všechno vyzkoušet. Kód v tomhle kurzu bude psát pomocí čitelného Javascriptu ES5 CSS a HTML. Jen mi prosím odpusťte, že se někdy neudržím a místo `function() {}.bind(this)` napíšu prostě rovnou `() => {}`, protože to je prostě pohodlnější a líp se to čte. Jinak nebudu využívat generatory, const, let, async ani nic podobného. Prostě jenom Javascript bez transpilování. Abych udělal radost [tomuhle haterovi](https://www.zdrojak.cz/clanky/piseme-vlastni-react/?show=comments#comments).


## Co budeme tvořit
Po dlouhém přemýšlení nad tím, kde bych nejlíp ukázal jQuery dobu kamennou a recyklovanou modernu jsem přišel na to, že hezký příklad by bylo vytvoření aplikačky pro zobrazování styleguidů. Přesně takovou aplikačku, která je například tahle: [http://getbootstrap.com/components/](http://getbootstrap.com/components/).

Dynamické UI na klientovi a použití nějakých klientských šablon se hlavně uplatňuje ve webových aplikacích, které vyžadují okamžitou reakci na užitelovi vstupy. V případě stránek o nich není potřeba příliš přemýšlet a člověk si povětšinou vystačí s prostým jQuery. Použití dynamického UI v klasických webových stránkách vede k [solidnímu overheadu](https://airbank.cz). Proto budeme tvořit v tomhle kurzu takovou maličkou aplikačku.

Náš úkol bude v podstatě vytořit tabulku se třemi sloupečky a několika řádkami. V prvním sloupečku bude formulář pro vyplnění nějakých dat do šablony dané UI komponenty.V druhém bude kód. No a ve třetím výstup.

No a jak se to člověk nejlépe naučí? Když si něco naimplementí, jdeme na to. První jQuery špagety tak, jak to dneska frčí ve většina firem Antona Hrabiše...


## Jak budeme přístupy hodnotit
Psaní UI je programování jako každé jiné, tím narážím na potřebu některých vývojářů nad psáním UI ohrnovat nos a říkat, že by to v Dreavieweru napsali za hodinu. Je to normální prográmko a troufám si říct, že v případě velkých UI je komplikovanější než serverová klasika request-response.

No a protože jsme si tedy ustanovili, že to programování je, zde prosím nabízím podle mě objektivní a velice abstraktní kritérie hodnocení kvality přístupu k implementaci:

1. testovatelnost
2. jednoduchost (čitelnost, udržovatelnost)
3. spolehlivost (nerozbitnost)
4. znovupoužitelnost

### jQuery old school
To byly časy... Prostě jsme měli něco jak rozběhat, aby se animovalo zatahování roletky, aby se skrýval odstavec při kliknutí na tlačítko. Krása. Pak se to ale zhoršovalo a my jsme museli takto ovládat složité velké UI. Avšak do té doby bylo všechno v pohodě. Takže začneme implementovat tuhle starou školu.

Tak hurá na prohlédnutí [kódu](./jQuery/imperative/index.html).

#### Přednosti
Všechno docela odsejpá, že. Prostě vybereme element na stránce přes obligátní selector, uděláme s ním, co je potřeba a je to. Není potřeba nic vymýšlet, je to jeden řádek kódu díky metodě `$.hide()`.

Nahrazování textu je takové trošku kostrbaté, musí se vytvořit `<span>` a tomu dát nějaká zvláštní třída a pak následně vybrat span a nastavit mu html. Třeba takto `$('span.variable').html('next text')`. To se taky dá vydržet. Minimálně do doby, dokud takových proměnných není moc.

Kopírování elementů je následně naprosto primitivní, jenom je třeba naklonovat Lička a dát je tam, kam je potřeba.
Můžete si toho všimnout dole, kde se přidává další option do dropdownu. Tahle option ještě představuje další "jídlo" řekněme, že zkoušíme vytvořit interaktivní jídelní lístek, který se má objevovat dole v seznamu, ale taky jako jedna z možností v dropdownu.
Mazání je trošku problém. Protože budeme chtít smazat nejen Ličko představující jídla dole pod komponentami, ale i to v dropdownu, že?

### Problémy
No smazat taková IDčka je těžké. Protože jakmile klikáme na křížek u Lička dole, tak musíme nějak vybrat Ličko v dropdownu. Jak ale tyhle dvě Lička spárovat? První myšlenka se nabízí je párovat podle názvu jídla. To pak znemožňuje mít dvě jídla stejného jména. Takže lepší je vytvořit nějaké identifikátor třeba přes `Date.now()` a přidat ho jako adata atribut nebo jako třídu do Lička. A pak přes nějak filtrovat.

Samozřejmě tohle s sebou nese řadu problémů. Například to znamená, že pokud bychom vypisovali jídla kdekoliv jinde, tak se musí vytvářet na jednom místě všechny, aby měly stejná IDčka a taky se musí z jednoho místa všude přidávat. Pokud bychom vypisovali jídla na deseti místech...
Mazání takový problém není, protože stačí jenom `$('mea-ID').remove()` a jeto, všechny Lička jídel s danym ID jsou smazány.

Všechno je docela v pořádku, pokud operujeme jenom s Ličkami. Kód se dá nakopírovat. Horší je, když jídla přidáváme do Selectu. Nebo potřebujeme jenom název jídla. Pořád s sebou neseme celé Ličko.

Co napříkald ve chvíli, kdybychom neměli Lička jídel, kde kopírovat? Prostě by nebyl element na který bychom mohli zavolat ono `$('li.meal').clone()`. Pak musíme vytvořit něco jako template - prázdnou předlohu Lička, který bud v DOMu schovaný. To vypadá jako dost šílenej nápad. Neboť na serveru budeme muset vypisovat seznam jídel a k tomu ještě nezapomenout ten kód nakopírovat pod `foreach` a dám mu nějakou třídu třeba `meal-template`. WTF.

Co například ve chvíli, kdy nám přijde přes AJAX kus nové stránky, kde jsou zase další Lička s jídly, tentokrát, co přišly ze serveru.
Jak je napárujeme s existujícími, aby neexistovaly duplicity? Takový úkol je prakticky nemožný a radši tohoto přístupu zanecháme.

Tenhle přístup je naprosto v pořádku pro jednoduché komponenty - přidávání tříd elementům, schovávání elementu na click atd. Tam se dá říct, že se osvědčil. Jakmile ale máme vytvářet DOM, tak se tenhle přístup začíná sám ničit..

### Hodnocení jQuery old school přístupu

#### Testovatelnost 4-
Museli byste nakopírovat reálný funkční DOM a přidat ho do testů a k tomu použít `JSDOM`. Pak by to mělo jít testovat - zavolá se funkce a kontrolujete stav `JSDOMu`. Problém je ale v tom, že jQuery pracuje na scopu celého DOMu, takže možná vyzkoušíte jednu část. Ale pokud byste chtěli mít otestováno všechno, tak neustále potřebujete všechny varianty reálného DOMu, který může prohlížeč dostat. A to se vám v testu nepovede namockovat...

#### Jednoduchost 4-
Jenom ten, kdo zná přesně celou strukturu aktuální DOMu dokáže [tenhle kód](./jQuery/imperative/index.js) nějak upravit nebo opravit. Z kódu není patrné na první pohled, co dělá a kdybych vám řekl, že potřebujeme přidat ještě další komponentu, tak současný kód těžko zkopírujete, neb potřebujete zcela jiné selektory a **kód je závislý na daném DOMu**.

#### Spolehlivost 5
Vzhledem k tomu, že se kód těžko testuje je jasné, že není spolehlivý. To, že tenhle přístup funguje je díky tomu, že používá selektory. Ano většina z nich je jednoduchých například `$('.dropdown-btn-result')`. To je jenom jedna unikátní třída. Ale to znamená, že pokud jsou na stránce dvě taková komponenty, tak vyberete obět. To znamená, že musíte vybírat v nějakém kontextu.
Třeba takhle `$('.btn-dropdown-result button')`. To znamená, že se nejen spoléháte na existenci elementu s daným selektorem, ale také na to, že je v DOMu nějak zanořený. To znamenák že pokud se DOM nějak změní - zanoření, název třídy atd. Javascript se rozbije a vzhledem k tomu, že zřejmě nebudete aktualizovat mock v v testech, ani si toho nemáte šanci všimnout.

#### Znovupoužitelnost 5
Kód je závislí na daném DOMu. Není možné ho přenést na jakoukoliv stránku. DOM prostě musí odpovídat. Dokonce je těžké ten kód i adaptovat. Protože například používá `.append()` a i pro append je potřeba znát strukturu DOMu.


### Verdikt - JQuery old school - průměr 4.75
Společným jmenovatelem všech problémů je **závislost Javascriptu na DOMu**. Totální. Ačkoliv máme Javascript v odděleném souboru, není možná ho "odtrhnout" od DOMu. A to právě díky imperativnímu přístupu jQuery staré školy.

Tenhle přístup funguje dobře pro drobnosti - přidání tříd, schování jednoho elementu. Není ale schopný nějak komponenty skládat do sebe, každá komponenta je izolovaná "ve svých třídách" neexistuje API mezi komponentami, které by umožňovalo komunikaci mezi nimi. Tohle se pro větší UI prostě nehodí.

Potřebujeme najít způsob, jak snížit závislost Javascriptu na DOMu a to se nepovede pokud budeme dál chtít jenom měnit existující DOM. Abychom se zbavili závislosti na DOMu, je třeba ho vytvářet a nejsnažší cesta jsou šablony v HTML.


## HTML šablony a jQuery
Však tvorba UI byla vyřešná dávno před jQuery, ne? Stačí prostě vytvořit šablonu a do ní vypsat proměnné a je to. Prostě šablona a proměnné.

I ve světě frontendu existují šablony. Nyní dokonce i existuje `<template>` tag.

V našem případě použijeme profláklou knihovnu na šablony v HTML, která je implementovaná i pro Javascript - [Handlebars.js](http://handlebarsjs.com/), které používá Ember.

Teď si zkusíme příklad s Style guidem naimplementit s šablonou.
[Kód je zde](template/index.js).

### Přednosti
Jak si můžete všimnout ve zdrojáku, tak v první části části, kde se implementí funkcionalita buttonu, nenastalo zas tak velké zlepšení ve srovnání s jQuery. Kód pořád připomíná špagety. Ale je zde pár zlepšení, o kterých se dá pohovořit.

Například implicitní propojení DOMu s JSkem přes přes selektory už není tak pevné jako v jQuery špagetě. Důvod je takový, že není třeba manuálně měnit DOM. Jenom v případě, kdy chceme nově renderovaný DOM nacpat zpátky na svojě místo do DOMu, kam patří. V takovém případě používáme funkci `render(html, where)`. Kde první parametr je vyrenderované HTML ze šablony a druhý je element, kam se má umístit.
Stále je ale potřeba vybírat elementy - obsahující šablony, element, kam se má výsledek vykreslit, inputy.

Toto tvrdé propojení s DOMem se dá minimalizovat tak, že celý kus HTML, který obsahuje dynamické prvky, bude v šabloně.

Tento přístup je naimplementovaný v části `dropdown` v druhé půlce [zdrojáku](template/index.js). Tenhle zdroják je mnohem jednodušší než jeho předci a dělá téměř to samé. Celá věda se redukovala prakticky jenom do dvou funckí `update()` a `render()`. Render vkládá výsledek templaty do DOMu, `update()` následně aplikuje objekt proměnných na šablonu. Pak stačí dát tyhle funkce dohromady v `renderApp()` a to je všechno, co je potřeba k vyrenderování apky s novým stavem. Taky se nám konečně objevuje datová strukturu reprezentující data v apce v proměnné `defaultComponentContext`. [Šablona nadále vypadá jako HTML](template/index.html) a je poměrně pochopitelné, jak funguje.

### Problémy
Problém ale nastává v aktualizaci šablony. Původně jsme chtěli při zmačknutí klávesy nad inputem hned aplikovat změny v datech a to nefunguje. Důvod je ten, že jakmile napíšeme nějaký znak, je zachycen v listeneru `input` a nastavíme proměnné v kontext a pomocí `renderApp()` aktualizujeme HTML výstup aplikace, tak tenhle výstup nahradí původní elementy. Tudíž se ztratí focus z inputu a smaže se i text, který jsme tam napsali. Tohle je problém, který s sebou nese jednoduchost znovuvytváření DOMu, nicméně je odstranitelná a dostaneme se k ní později. Zatím ji obejdeme tak, že přidáme submit tlačítko pod formulář s inputy a proměnné nastavíme až ve chvíli, kdy se na formuláři zavolá event submit. Teď by měla fungovat aktualizace textu v dropdownu. Paráda.

Nyní bychom chtěli inteligentně naimplementovat přidávání dalších Liček do dropdownu. Tady bych se ale pozstavil. Celkem jednoduše jsme si nadefinovali jak má vypadat tvar formuláře pro data do šablony
```js
[
  { name: 'text', type: 'string' },
  { name: 'droped', type: 'boolean' }, // tenhle type nepude vyifovat v handlebars, leda přes helper
  // http://stackoverflow.com/questions/24191182/how-to-check-type-of-object-in-handlebars
  { name: 'options', type: [{ name: 'text', type: 'string' }] }
]
```
Na první pohled jest vindo, že můžeme změnit typy ze `string` a `boolean` na `text` a `checkbox`. S tím není problém. Ale problém je už se zanořením pole `options`. Options má vkládat další Lička do dropdownu a mají se ve formuláři držet, aby je bylo možné smazat z jednoho místa a aby jejich stav odpovídal stavu v šabloně. Problém je ale ten, že v Handlebars šablonách prostě není možné bez použití nějakého helperu říct - pokud mám proměnnou typu pole pod klíčem `type`, tak chci rekurzivně renderovat pole jako před tím ale pouze chci použít jiné proměnné.
V handlebars není operátor `typeof` a není možné rekurzně volat šablonu. Handlebars jsou prostě parser stringu, stejně jako jakýkoliv jiný šablonovací jazyk. Šablony totiž fungují tak, že zanalyzují string a převedou ho na nějaký jazyk - v našem případě Javascript a ten pak krmí daty, aby získaly nové HTML. Featury jako jsou cykly nebo type check se musí ručně dodělávat. Pokud chcete docílit rekurze, tak prostě musíte kód zkopčit. Stejně jako byste to dělali třeba v PHP. Jistě, že jsou implementace, které tohle dovedou, nicméně tohle je konceptuální myšlenka šablon - jsou to parsery stringu. Ještě by bylo záhodno zmínit, že každá šablona má jinou syntaxi a každá umí něco jiného...

Duplikace kódu se nevyhneme (říkám kódu, neb šablony **jsou** kód). Kupříkladu je to vidět na tom, že my potřebujeme [vyrenderovat HTML kód](template/index.html) do příkladu v tagu `<xmp>` ale i do výsledku, který se zobrazuje. V takovém případě se kód musí zduplikovat (nebo použít jinou šablonovací knihovnu, helper, cokoliv...).

Tyhle všechny problémy se dají nějak pochopit, ale pořád jsme tam kde jsme byli co do API. Pořád musíme tahat data z inputů přes listener, který je pověšený přes selektor. Nemáme žádná "sémantická" data, která by v takovém listeneru přišla. Kupříkladu pokud kliknu na nějakou option v dropdownu, tak dostanu jenom její element, nedostanu žádné její IDčko nebo entitu, kvůli které byla vytvořena. Pokud bych tyhle data chtěl, pořád musím použít data atribut nebo podobný in-html hack.

### Hodnocení přístupu HTML šablony a jQuery

#### Testovatelnost 2-
Tady nastalo obrovské zlepšení. Stále bude zřejmě potřeba JSDom, ale pokud se nám povede zavolat `Handlebars.compile(template)(context)`, tak výsledek tohoto volání je HTML a to už se dá zkontrolovat jednoduše podle selektorů apod. Samozřejmě problém bude ve chvíli, pokud budeme chtít šablonu někam vkládat. Ale s tím se nedá nic moc dělat, dokud nebude celá stránka vytvořená jako Javascriptová šablona.
Navíc bez rekurze se šablona těžko rozsekává na malé testovatelné kousky. Ačkoli šablony vždy odpovídá vloženým proměnným, tak často bývá příliš velká na to, aby šla rozumně testovat.

#### Jednoduchost 2
Dá se říct, že kód je jednoduchý. Šablona je čitelná i bez znalosti programování. Není problém přidat nějaký button do HTML nebo vypsat options v cyklu. Ani přidat další dynamickou proměnnou není těžké, stačí jí dopsat do konfigurace `context.vars`. Jediná složitost je ve vkládání šablony zpět do DOMu. Horší je to trošku s omezeným výběrem helperů v šablonách. Například `typeof` či rekurze není triviální.

#### Spolehlivost 2-
Nespolehlivost tkví v tom, že šablona je pouze string a je potřeba ji naparsovat. Většina parserů jsou hloupé a nedokáže odhalit nedefinované proměnné, typos apod. Není žádná ucelená cesta, jak definovat API šablony. Prostě říct, že šablona bere tyto proměnné tohoto typu a není možné je staticky či za běhu kontrolovat. Stejně tak se pořád musí registrovat listenery přes selektor a přes metodu `.on` na dokument. To je pořád taková oklika.

#### Znovupoužitelnost 3
Chybí mi zde jednoduchá rekurze. Šablona jako taková je relativně znovupoužitelná. Ale pokud by bylo možné ji rozsekat na menší části, které by měly jasně definované API nejen pro to, jaká data zobrazují, ale také jaká data mohou vrace v callbacku, tak by byla znovupoužitelnost za 1.

### Verdikt - HTML šablony a jQuery - průměr 2,5
Téměř dvojnásobné zlepšení! Pokud máme komplikované UI, tak se alespoň podle mého pozorování vyplatí jít do šablon a do tvorby HTML spíše než do jeho ruční úpravy.

Hlavní problém, na který jsem narazil při programování byla nemožnost definovat API k šabloně. Nadále se musím podívat do kódu, abych zjistil, jakého typu asi jaká proměnná bude, které všechny proměnné v kódu jsou a jestli se nic nerozbije pokud tu kterou opomenu. Samozřejmě pořád musím ještě řešit poslouchání událostí přes jQuery styl a poslouchání listenerů bez sémantických informací o DOMu, kde se event vyskytla. Bez API pořád není možné poskládat velkou aplikace, bej jednotného jednoduchého API není možné komunikovat se světem okolo bez obskurdit s jQuery a s DOMem

Šablony jako takové představují další problémy. Každý šablonovací engine umí tohle, druhý támhleto. Všechny se dají nějak rozšířit, ale jejich hlavní problém je to, že nejsou tak mocné jako Javascript, není prostě možné tam použít všechny možnosti Javascriptu, ačkoli jako takové se do Javascriptu kompilují. Šablony jsou prostě jenom trošku lepší `String.replace()`.

Další problém byla nemožnost udržet referenci na element ve chvíli, kdy se změní a celá šablona se hned překreslít a nové elementy přibudou do DOMu a staré se smažou. To znamená, že při napsání do inputu z něj mizí focus a text, co jsem do něho napsal. Musí se to obcházet přes submit, ale dá se to vyřešit i lépe, k tomu se dostanu.

Abych se dostal ještě na lepší známku, je tudíž potřeba vymyslet systém, který vyřeší:

1. definovaní API pro šablony - datové typy, kontrola existence, sématické informace v event listenerech
2. bude mít stejnou syntax jako Javascript, abych mohl použít `typeof`, cykly, rekurzy atd.
3. kvůli spolehlivosti je potřeba se zcela zbavit závislosti na DOMu
4. eventuálně udržování reference na původní objekty v DOMu.

## Project Javascript
Protože Javascript má všechno, co potřebujeme - dokážu nadefinovat APIčko (sic bez typového checku, ale můžeme zkusit třeba Typescript či flow). Měl bych být schopný nadefinovat jednoduché callbacky, která budou poskytovat užitečné informace - třeba v seznamu kurů mi vrátí entitu kurzu apod. Použiju všechno, co Javascript nabízí - `typeof`, iterace, transformace.
Pokud použiju jednoduché funkce, tak kód bude jednoduše testovatelný. A šablona se rozseká na maličké částečky, které pudou skládat jako lego.
Jednoduše se zbavím závislosti na DOMu tak, že ho budu vytvářet jako by to byla šablona.
Nějakou chytrou technikou by mělo být možné udržet reference na původní objekty v DOMu i při smazání přes `el.innerHTML = ''`.

Zkusíme to!

Kód si prohlédněte a vyzkoušejte [zde](./pt.1-jQuery-to-React/javascript/index.html).

### Přednosti
#### Sbohem DOMe
Všechny problémy jQuery a javascriptových šablon jsme vyřešili, jak je to možné? Prve je se potřeba podívat na to, jestli máme nějak spojený aktuální DOM s Javascriptovým kódem.

Odpověď je samozřejmě prostá. DOM není nijak spojený s našim Javascriptem. Jenom v jednom jediném bodě, kdy říkáme, kam se má komponenta vyrenderovat. Bez takové obezličky bychom se ale neobešli, navíc kód, který tuhle obezličku využívá je triviální:
```js
function renderDOM(newDOM, element) {
  element.innerHTML = ''
  element.appendChild(newDom)
}

var nextDOM = createDOM({ ... })

renderDOM(nextDOM, document.getElementById('app'))
```
Tenhle kus kódu v sobě **nemá** ani kousek business logiky. To, jak se aplikace chová nebo jak vypadá je obsaženo pouze ve funkci `createDOM()`, která pouze a jenom vytváří HTML tagy - v našem případě rovnou vytváří instance elementů přes `document.createElement()` - takže by se závislost na `document` dala brát jako závislost na DOMu. To ovšem je ale nesmysl, protože objekt `DOM`, který používáme na vytváření DOMu, tedy tento:
```js
function createDOM(props) {
  return DOM.div({}, 'Ahoj!')
}
```
Se dá funkci předat jak parametr:
```js
function createDOM(DOM, props) {
  return DOM.div({}, 'Ahoj!')
}
```
A co to znamená? No to znamená prostě jenom to, že by pro mě nebyl problém vytvořit takovou implementaci objektu `DOM`, která by vracela místo JS objektů pouhé stringy elementů: `<div>Ahoj!</div>`. Jak?
```js
// původní vytváření objektu DOM používá globální document
// document si ale můžeme naimplementovat jinak a předat ho do createDOM()
var createElement = (tag) => {
  var children = []
  var attrs = {}
  return {
    innerHTML: '',

    toString: function() {
      return `<${tag}${this.getAttrs()}>${children.map((child) => child.toString()).join('')}</${tag}>`
    },

    getAttrs: function() {
      var ret = []
      Object.keys(attrs).forEach(key => {
        var value = attrs[key]
        if (key.toLowerCase() == 'classname') {
          value = String(attrs[key])
          key = 'class'
        }

        ret.push(`${key}="${value}"`)
      })
      if (ret.length > 0) {
        return ` ${ret.join(' ')}`
      }
      return ''
    },

    appendChild: function(child) {
      children.push(child)
    },
  }
}

// název serverDocument protože takováto implementace je snadno použitelná na serveru
var serverDocument = {
  createElement: createElement,
}


//definice createDOM()
function createDOM(document) {
  return ['div', 'span', 'label', 'p', 'input', 'button', 'form'].reduce(function(DOM, tag) {
    DOM[tag] = function(attrs, children) {
      var elem = document.createElement(tag)
      elem = Object.assign(elem, attrs)

      if (typeof children === 'string') {
        elem.appendChild(document.createTextNode(children))
      } else {
        children = children || []
        children.forEach(function(child) {
          var child = typeof child === 'string' ? document.createTextNode(child) : child
          elem.appendChild(child)
        })

        return elem
      }
    }

    return DOM
  }, {})
}

// pro vytvářní stringových elementů místo DOM objektů pak stačí jen toto
var DOM = createDOM(serverDocument)

DOM.div({className: 'ahoj-class'}, 'ahoj') // -> string: <div class="ahoj-class">ahoj</div>
```
Nyní nám je zcela jedno, co dokáže `document`, prostě si ho naimplementujeme jak potřebuje pro jakékoliv prostředí.

Kód jsem vzal odtud: https://github.com/vojtatranta/supertiny-app-lib.

Tedy zcela jsme se izolovaly od DOMu jako takového.
#### API, Testovatelnost, spolehlivost
API nyní definujeme jako u jakékoliv jiné javascriptové funkce - type hinty sice v Javascriptu nejsou, ale můžeme si je přidat typescriptem nebo Flow typem. Takže s trochou představivosti můžeme říct, že třeba funkce pro vypsání jména uživatele vypadá takto:
```js
function UserBlock(userName, email, userId, onUserClick) {
  function handleUserClick() {
    onUserClick(userId) // pošleme do handleru sémantickou informace na jakého Usera bylo kliknuto podle jeho ID
  }

  return DOM.div({
    className: 'user-block',
    onclick: handleUserClick,
  },
    DOM.strong({}, 'User name:'), DOM.span({}, userName), DOM.br({}),
    DOM.strong({}, 'E-mail:'), DOM.span({}, email), DOM.br({}),
    DOM.strong({}, 'Photo:'), Gravatar(email)
  )
}

// použití
function renderHeader(userData, getAPIUserDetails) {

  // tato funkce se zavolá po kliknutí všimněte si, že ji posíláme jako callback do UserBlock
  function onUserDetailRequest(userId) {
    getAPIUserDetails(userId) // získáme data z user api
      .then((userData) => {
        console.log(userData)
      })
  }

  return DOM.div({
    className: 'header',
  }, UserBlock(userData.userName, userData.email, userData.id, onUserDetailRequest))
}
```
Nejenže jsme definovali, jaká data tečou do šablony a jaká se tedy vykreslí. Dokonce píšeme vše v Javascriptu, takže nám JSko pěkně hlásí chyby, když nějaké uděláme, né jako Handlebars. Můžeme využít nástroje jako `eslint` pro kontrolu kódu a upravnit tragičnost jazyka JávaScrypt.

Testování je triviální. Všechny funkce jsou čisté, prostě jim dát nějaké parametry a ony vám vrátí kus HTML, ať už jako string nebo jako DOM objekty.
Testování pak není problém, prostě jenom zkontrolujete výstup. Není potřeba vytvářet nějaký mock celého HTML ani žádnou podobnou šílenost. Navíc se dají funkce skládat jako lego a pokud otestujete jednu funkci, tak víte, že se těžko něco rozbije, pokud jich dáte více dohromady. K dokonalosti tu chybí jen tvrdé typování, toho s v Javascriptu asi nedočkáme, ale má ho třeba geniální jazyk [Elm](http://elm-lang.org/), doporučuji ho vyzkoušet!

Spolehlivost? No, tak změna jedné třídy v našem "HTML" už nic nerozbije. Aplikace není nijak závislá na selektorech nebo na tom, jak jsou jednotlivé elementy zanořené. Tady už také není problém.

> Tady na tom místě bych chtěl podotknout, že paradoxně tím, že jsme přesunuli vytváření HTML to Javascriptu jsme docílili opravdového **oddělení** JS a HTML.

Teď už se logika nijak nemíchá s HTML tak, jako tomu bylo v jQuery příkladu. Nejsme už závislíst na zanoření elementů nebo na unikátnosti jednotlivých selectorů. Navíc tím, že jsme nepoužili klasické šablony, které parsují string a pak ho interpretují sme dostali pod ruku celou moc programovacíme jazyka Javascript a nejsme už nijak omezeni zvlášnostmi implementaci nějakého šablonovacího enginu.

### Problémy
Bohužel, všechno má svoje pro a proti. Najednou už nemáme žádné HTML a všechno píšeme v Javascriptu. Srdce programátora jásá, kodér pláče. Je pravdou, že pokud jste do teď uměli jenom HTML a CSS a sem tam jste něco naprasili v jQuery, tak taková znalosti už vám tady přestávají stačit. Na druhou stranu, vždycky je dobré se něco naučit, obzvlášť v oblasti Javascriptu. Otevírá to obrovské možnosti. Jak jsem psal ve svém článku [Kam došel svět frontendu do ledna 2016](https://medium.com/@vojta/kam-do%C5%A1el-sv%C4%9Bt-frontendu-do-1-2016-f84cbff1156#.4mrykl9lm).

Je samozřejmě potřeba si přiznat, že taktov vytvořené HTML opravdu není dvakrát čitelné. Všude jsou jenom volání funkcí, která jen opravdu vzdáleně připomínají nějaké HTML. Podle mého názoru se v tomto kódu dá vyznat lépe, než pokud použijeme jQuery přístup navazování business logiky. Nicméně tento kód už není zdaleka tak podobný HTML jako klasické šablony a jehorší v něm najít, kde jaký `<div>` začíná a kde končí. Je těžké všechno správě uzávorkovat. Zkrátka by asi bylo o trošku lepší mít něco, co je stejně čitelné jako šablona, ale přitom mocné jako Javascript.

Prázdné HTML? Ano, to je velký problém. Naše aplikace se vypíše až v prohlížeči. To znamená, že tím trpí SEO a i výkon, protože aplikace v prohlížeči musí nejdřív stáhnout Javascript, aby se dokázala vůbec vykreslit. Naštěstí dokážeme naimplementovat renderování šablony na straně serveru poměrně jednoduše, takže to není takový problém. Horší oříšek je to, jak správě dostávat data do šablony, aby na každé stránce bylo zajištěno že má data, která potřebuje a ani víc ani méně. Tohel se snaží vyřešit [Relay](https://facebook.github.io/relay/) a [GraphQL](http://graphql.org/learn/). A není to zrovna lehký úkol...

Další problém je to, že v zájmu jednoduchosti pokaždé vytváříme celé nové HTML aplikace při každé změně. To má za následek to, že pokud bychom chtěli měnit stav aplikaci při každém zmačknutí klávesy nad inputem, tak by to znamenalo, že se pokaždé překreslí celá aplikace. To je samozřejmě dost zbytečné, stačilo by, kdyby se překreslil jen ten kousek, který se změnil.

Navíc neustálé nahrazování DOMu za jiný má důsledky i v tom, že jakmile něco napíšu do inputu, tak ztratím i focus, protože se nahradí input element jinou instancí....

### Hodnocení přístupu s pouhým Javascriptem

#### Testovatelnost - 1
Tady není co dodat. Čistá funkce se testuje naprosto triviálně. Stačí ji zavolat s argumenty a zkontrolovat výstup.

Případné callbacky se testují také snadno - najde se element s callbackem a zavolá se s danými parametry.

#### Jednoduchost - 2
Tohle je asi kontroverzní část. Sic je potřeba dost kódu na to, abychom něco takového rozběhali, ale nakonec je pak triviální psát jakékoliv UI. Narozdíl od jQuery se ale postupné přidávání feature nekomplikuje a přidat další kus UI je jenom o tom zavolat další funkci.

Samozřejmě v neprospěch jednoduchosti hovoří to, že nepíšeme nic podobného HTML. Voláme funkce v Javascriptu a s tím si celá řada kodéru prostě nemusí poradit. Zkrátka nyní potřebujeme frontendové programátory, kodéři nám už nestačí a to může být komplikace.

Sice by se dalo říct, že rozdělení UI do komponent vše zjednodušuje, už nemáme dlouhé špagety HTML šablon, ale i tak volím **2**, protože je mi jasné že s tím budou v agenturách problémy.

#### Spolehlivost - 1
Jak jsem psal výše, změna struktury HTML nebo změna třídy na elementu nic nerozbije. Navíc se dají snadno napsat testy. Spolehlivost tedy není problém.
#### Znovupoužitelnost - 1
Nic není znovupoužitelnějšího než jednoduchá matematická funkce. O tom zkrátka není sporu. A naše UI je tvořeno pouze funkcemi, které vracejí strukturu DOMu. Takže stačí pouze funkci vzít a použít jí jinde. Či psát funkce pro layout obecně a můžeme si vytvořit vlastní knihovnu pro tvoření layoutu tak, že může být naimplementovaná pro bootstrap či pro flexbox.
### Verdikt - Pouhý Javascript - průměr 1,25
Celkový dojem pouze kalí to, že tyhle javascriptové "šablony" nejsou tak perfektně čitelné a vypadají cize ve srovnání s HTML šablonami. K tomu jsou ještě problémy s výkonem v tom smyslu, že při každé změně stavu překreslujeme celé HTML celé aplikace a to prostě zbytečné mrhní prostředky a ztrácíme focus na elementech apod.

Jinak jsme všechny problémy vyřešili. Máme definované API, kód je testovatelný, máme po ruce mocný Javascript, nejsme závislí nijak na DOMu.

Takže k téměř dokonalého šablonování nám chybí ještě toto:
- dokopat Javascript ke kontrole typů argumentů, chodících do šablon
- zefektivnit vykreslování šablony - aby se upravilo jen to, co je potřeba a udržovaly se instance inputů, aby neztrácely focus apod.
- přidat možnost psát šablony v přívětivějším duchu tak, aby kodéři neprskali
## Co teď?
Tohle už jsou netriviální problémy, se kterýma si těžko poradíme v dvouhodinnovém kurzu. Těžko tady naimplementujeme algoritmus pro aktualizaci DOMu jen v místech, kde se něco změnilo nebo těžko donutíme Javasript kontrolovat typy.

Ovšem nic z toho nás nemusí trápit, všechny tyhle problémy už řeší nejslavnější [UI knihovna React](https://facebook.github.io/react/) a o té se povíme v [další části](../pt.2-React).
