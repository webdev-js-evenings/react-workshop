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
    return `<${this.tag} ${this.attrsToString()}>${this.children.map(child => child.toString())}</${this.tag}>`
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


app.get('*', (req, res) => {
  res.send(html.replace('{HTML}', 'SERVER'))
})

app.listen(9999, () => {
  console.log('App is running on port:', 9999)
})
