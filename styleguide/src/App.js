import React, { Component } from 'react';
import './App.css';
import ReactDOMServer from 'react-dom/server'
import Form from './components/form'
import { getFormFieldsFromPropTypes } from './utils'


class ComponentContainer extends Component {
  state = {}

  _handleInputChange = (propName, value) => {
    const obj = {}
    obj[propName] = value

    const stateUpdate = Object.assign({}, this.state, obj)
    this.setState(stateUpdate)
  }

  render() {
    const formFields = getFormFieldsFromPropTypes(this.props.component)
    const component = <this.props.component {...this.state} />

    return (
      <div className="row">
        <h2>{this.props.component.name || this.props.component.type}</h2>
        <div className="col-md-3">
          <Form fields={formFields} onFieldChange={this._handleInputChange}/>
        </div>
        <code>
        <xmp className="col-md-4" dangerouslySetInnerHTML={{__html: ReactDOMServer.renderToStaticMarkup(component)}}/>
        </code>
        <div className="col-md-5">
          {component}
        </div>
    </div>)
  }
}


class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>Styleguide</h1>
        {this.props.components.map(Component => {
          return <ComponentContainer component={Component} />
        })}
      </div>
    );
  }
}

export default App;
