import React from 'react'


const getInputTypeOfPropType = (propType) => {
  switch (propType) {
    case React.PropTypes.number:
      return 'number'

    case React.PropTypes.bool:
      return 'checkbox'

    case React.PropTypes.array:
      return 'array'

    default:
      return 'text'
  }
}

export const getFormFieldsFromPropTypes = (component) => {
  return Object.keys(component.propTypes || {}).map(key => {
    const propType = component.propTypes[key]
    return {
      type: getInputTypeOfPropType(propType),
      name: key,
      id: `${component.type || component.name}__${key}`,
    }
  })
}
