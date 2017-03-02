import React from 'react'


const Button = (props) => {
  return (
    <button className={props.className}>{`Text: ${props.text}`}</button>
  )
}
Button.propTypes = {
  className: React.PropTypes.string,
  text: React.PropTypes.string,
}



export default Button
