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

Tak pokud se podíváte na kód [zde](../pt.1-jQuery-to-React/javascript/server.html) a spustíte si ho v prohlížeči, tak si všimnete prostě textu, který se vypíše jenom na klientu tj. html, které přichází ze serveru je prázdné, je tam pouze jeden `<div id="app"></div>`, kam se renderuje aplikace. Renderování probíhá jenom na klientovi.

No a když se podíváte [sem](../pt.1-jQuery-to-React/javascript/server.js) tak tady je kód pro spuštění klasického HTTP serveru v Node.js, který zatím nedělá nic. Spustíte si ho příkazem:
```
yarn server
```
Na url [http://localhost:9999](http://localhost:9999) vám nyní běží ten zázrak. Vypíše se pouze nějaký text, nic zvláštního.

No ale pokud vezmu náš známý kód, který přes objekt `DOM`, který přes metody `DOM.div(), DOM.span() ...` vytvářel DOM elementy a zkopírujete ho do `server.js` a změníte dvě řádky, tak uvidíte, jaké se budou dít věci...

Stačí jenom upravit tyhle řádky:
```
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
