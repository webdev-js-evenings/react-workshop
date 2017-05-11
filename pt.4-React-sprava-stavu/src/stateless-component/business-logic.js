export const setTime = (time) => {
  return {
    time,
  }
}

export const setFormValue = (nextValue) => {
  return {
    formValue: nextValue,
  }
}

export const addNewTodo = (formValue, todos) => {
  return {
    todos: [{
        'id': Date.now(),
        text: formValue,
      }].concat(todos),
    formValue: '',
  }
}
