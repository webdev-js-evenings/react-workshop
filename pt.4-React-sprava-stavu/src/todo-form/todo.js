import React from 'react'


export default ({ todo, onClick }) => (
  <li onClick={() => onClick(todo)}>
    {todo.text}
  </li>
)
