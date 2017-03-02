const express = require('express')


const app = express()
const html = '<!doctype HTML><html><head><meta charset="utf-8"><title>Server side!</title></head><body><div id="app">{HTML}</div></body></html>'

class StringElement {
  constructor(tag, children = []) {
    this.tag = tag
    this.children = children
  }

  appendChild(child) {
    this.children.push(child)
  }

  attrsToString() {
    let stringAttrs = ''
    Object.keys(this).forEach(attr => {
      if (attr === 'tag' || attr === 'children') {
        return
      }

      stringAttrs += `${attr}="${this[attr]}"`
    })

    return stringAttrs
  }

  toString() {
    return `<${this.tag} ${this.attrsToString()}>${this.children.map(child => child.toString()).join('')}</${this.tag}>`
  }
}

const serverDocument = {
  createElement(tag) {
    return new StringElement(tag)
  },

  createTextNode(node) {
    return node
  }
}

function createDOM(document) {
  return ['div', 'span', 'label', 'p', 'h1', 'input', 'button', 'form'].reduce(function(DOM, tag) {
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

var DOM = createDOM(serverDocument)

function renderDOM(DOM, elem, fel) {
  elem.innerHTML = ''
  elem.appendChild(DOM)
}


function renderApp(state) {
  return DOM.span({}, [state.text])
}

app.get('*', (req, res) => {
  res.send(html.replace('{HTML}', renderApp({ text: 'Jiný text' })))
})

app.listen(9999, () => {
  console.log('App is running on port:', 9999)
})
