import React from 'react'

import Modal from './modal'

import { connect } from '../store'

import * as actions from '../actions'


export default connect({
  'nextInvoice': 'invoice',
  'vatRatio': 'VAT',
}, actions)((props) => {

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addInvoice()
  }

  const handleHideRequest = (e) => {
    e.preventDefault()
    props.onHideRequest()
  }

  const onInvoicePropertyChange = (property) => (e) => {
    props.onInvoicePropertyChange(property, e.target.value)
  }

  if (Object.keys(props.invoice).length === 0) {
    return null
  }

  const price = Number(props.invoice.price) || 0
  const vat = Math.round(price / 100 * Number(props.VAT))
  const total = price + vat

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
          <input className='form-control' defaultValue={price} id='price' onChange={onInvoicePropertyChange('price')}/>
        </div>
        <div className='form-group'>
          <label htmlFor='VAT'>DPH ({props.VAT}%):</label>
          <input className='form-control' disabled id='VAT' value={vat}/>
        </div>
        <div className='form-group'>
          <label htmlFor='total'><strong>Celkem:</strong></label>
          <input className='form-control' readOnly value={total}/>
        </div>
        <div className='form-buttons'>
          <button className='btn'>Přidat fakturu</button>
          <button className='btn btn-danger' onClick={handleHideRequest}>Zrušit</button>
        </div>
      </form>
    </Modal>
  )
})

