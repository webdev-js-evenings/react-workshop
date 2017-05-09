import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';

import Clock from '../clock'
import Form from '../todo-form/form'
import Todo from '../todo-form/todo'



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
