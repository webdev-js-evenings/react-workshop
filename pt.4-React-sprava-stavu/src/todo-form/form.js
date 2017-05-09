import React from 'react'


export default ({ value, onChange, onSubmit }) => {
  const handleFormSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <label>Todo</label><br/>
      <input type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
      /><br/>
      <button>Přidat todo</button>
    </form>
  )
}
