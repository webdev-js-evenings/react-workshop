import React from 'react';
import logo from '../logo.svg';
import '../App.css';

import Clock from '../clock'
import Form from '../todo-form/form'
import Todo from '../todo-form/todo'



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
      <h2>Stateless component</h2>
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
