import React from 'react'


const FormField = (props) => {
  const field = props.field

  function handleInput(e) {
    if (field.type === 'checkbox') {

    props.onFieldChange(field.name, e.target.checked)
      return
    }

    props.onFieldChange(field.name, e.target.value)
  }

  return (
    <input
      className="form-control"
      type={field.type}
      name={field.name}
      onChange={handleInput}
      id={field.id}/>
  )
}


export default (props) => {
  function handleKeyPress(e) {
    console.log(e.target.name)
  }

  return (
    <div>
      {props.fields.map(field => {
        return (
          <div className="form-group">
            <label htmlFor={field.id}>{field.name}</label>
            <FormField field={field} onFieldChange={props.onFieldChange}/>
          </div>
        )
      })}
    </div>
  )
}
