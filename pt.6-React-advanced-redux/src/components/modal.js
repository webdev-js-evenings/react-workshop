import React from 'react'


export default ({ children, title, onHideRequest }) => {
  return (
    <div className='modal-container'>
      <div className='modal-overlay' onClick={onHideRequest}></div>
      <div className='modal'>
        {title && <h2 className='modal-title centered'>{title}</h2>}
        <div className='modal-content'>{children}</div>
      </div>
    </div>
  )
}
