# Poznámky k výkladu

## Příprava
### Flow
Flow je super nástroj na kontrolu kódu. Pokud si nemůžete dovolit rozjet Typescript nebo nemůžete mít pořádný jazyk na psaní UI, třeba Elm,
tak je **nutné** použít Flow, alespoň v módu `weak`.

### ESLint
Bez ESLintu si nedovedu představit vývoj. Jasně, kdo má IDE, tak ho nepotřebuje. Ale ESLint má možnost zdědit konfigurace, které používají vývojáři ve světě jako standard. Například AirBnB vytvořilo svojí sadu pravidel, která je populární. Nebo tenhle repozitář používá [Standard.js](http://standardjs.com/rules.html) nastavení. ESLint krom kontroly hezkosti kódu dovede ještě kontrolovat typické chyby jako neexistující proměnné atp.

## Implementace

### jQuery špagety
[kód je zde](./jQuery/imperative/index.html)

- výsledek má být ukázat, že je šílený pořád jenom kopírovat komponenty a psát k nim trošku jinej kód kvůli jinému HTML

- vysvětlit proč jsou v tom kódu ty spany - mají být naplněny textem

- nechat první button jako danger a ukázat, jak je těžké tam tu původní classu smazat, že je lepší to celé vyresetovat

- naimplementovat tlačítko reset

- naimplementit defaultně otevřený dropdown podle checkboxu

- Dropdown - zmínit, že unfold je naprosto v pohodě

- Dropdown naiplmenentovat přidávání dalších options -> problém s tím, že předlohy mohou být prázdné
- Ukázat problém se synchronizací - tak pohřbít jQuery

- Dropdown - ukázat sečteno, kde se templaty používaj

- idiocie toho, že mám použitý selectory, které jsou v HTML, ale JS mám v jinym souboru - tady se hezky ukáže seperation of concerns not technologies.

- tohle je totálně netestovatelný, leda by se mockovat celej dom a psali se query selectory

- nedá se procházet mezi stavy

### Templaty
- best practices https://code.tutsplus.com/tutorials/best-practices-when-working-with-javascript-templates--net-28364
- zlepšení v tom, že data už chodí jako JS objekty
- problém je v tom, že pořád se někdě vkládá html do DOMu
- NAIMPLEMENTOVAT - že celý řádek by byla šablona
- ukázat problém s rekurzí u formulářových prvků
- problém s šablonou a používání `$.html(html)` je v tom, že se všechny elementy nahradí, takže se vyresetují inputy a ztratí focus
- taky je jasný, že jakmile se něco napíše do inputu, kterej se okamžitě přerenderuje, tak zmizí, co sem do něj napsal - to ale je řešitelný pře submit button nebo nějaké chytré diffování - k tomu se dostaneme
- šablony maj jednu velikou nevýhodu - není tam javascript, ale jenom tupý string který umí jenom ifovat a vypisovat, nejde tam:
  - `typeof` a další normální funkce chybí (implementace od implementace)
  - nemají interface
  - rekurze - nemůžu použít na definici formuláře, která je rekurzní
  - našeptávání
  - kontrola existence proměnných
  - kontrola typos
  - jsou pomalé
  - ... you name it..
- proto nejde naimplementovat jednoduše formulář, protože nemám `typeof` na kontrolu typu fieldu
- nicméně šablony fungují poměrně hezky, až na to, že nemají pořádné API
- výborné je to, že view se dá vydefinovat jako `view = template(data)`
