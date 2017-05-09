import React from 'react';
import logo from '../logo.svg';
import '../App.css';

import Clock from '../clock'
import Form from '../todo-form/form'
import Todo from '../todo-form/todo'

import initialState from '../initial-state'



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


const StateLessComponent = ({ ...state, addTodo, setTime, setTodoDraft }) => {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Webdev React!!</h2>
        <Clock tick={1000} time={state.time} onTick={setTime} />
      </div>
      <h2>Just a Component</h2>
      <h3>A list of todos</h3>
      <Form value={state.formValue}
        onChange={setTodoDraft}
        onSubmit={addTodo}
      />
      <ul className="list">
        {state.todos.map(todo => {
          return <Todo key={todo.id} todo={todo} />
        })}
      </ul>
    </div>
  )
}


const setTime = (nextTime) => {
  return {
    time: nextTime,
  }
}

const setTodoDraft = (todoDraft) => {
  return {
    formValue: todoDraft,
  }
}

const addTodo = (event, state) => {
  return {
   todos: [{
      'id': Date.now(),
      text: state.formValue,
    }].concat(state.todos),
  formValue: '',
  }
}


export default createApp(StateLessComponent)(initialState, {
  addTodo,
  setTime,
  setTodoDraft,
})
