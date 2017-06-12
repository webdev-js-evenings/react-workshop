import React from 'react'

import Modal from './modal'

import { connect } from '../store'

import * as actions from '../actions'


export default connect({}, actions)((props) => {

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addInvoice()
  }

  const onInvoicePropertyChange = (property) => (e) => {
    props.onInvoicePropertyChange(property, e.target.value)
  }

  if (Object.keys(props.nextInvoice).length === 0) {
    return null
  }

  return (
    <Modal {...props} title='Přidat fakturu'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='id'>Číslo:</label>
          <input className='form-control' id='id' defaultValue={props.invoice.id} onChange={onInvoicePropertyChange('id')}/>
        </div>
        <div className='form-group'>
          <label htmlFor='customer'>Zákazník:</label>
          <input className='form-control' id='customer' defaultValue={props.invoice.customer} onChange={onInvoicePropertyChange('customer')}/>
        </div>
        <div className='form-group'>
          <label htmlFor='price'>Cena:</label>
          <input className='form-control' defaultValue={props.invoice.price} id='price' onChange={onInvoicePropertyChange('price')}/>
        </div>
        <div className='form-group'>
          <label htmlFor='VAT'>DPH:</label>
          <input className='form-control' id='VAT' defaultValue={props.invoice.VAT} onChange={onInvoicePropertyChange('VAT')}/>
        </div>
        <div className='form-group'>
          <label htmlFor='total'>Celkem:</label>
          <input className='form-control' readOnly defaultValue={props.invoice.total} onChange={onInvoicePropertyChange('total')}/>
        </div>
        <div className='form-buttons'>
          <button className='btn'>Přidat fakturu</button>
          <button className='btn btn-danger' onClick={props.onHideRequest}>Zrušit</button>
        </div>
      </form>
    </Modal>
  )
})

