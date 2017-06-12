import React from 'react'

import InvoiceForm from './invoice-form'

import { connect } from '../store'

import * as actions from '../actions'


class InvoiceTable extends React.PureComponent {
  state = {
    addInvoice: false,
  }


  _handleAddInvoiceToggle = () => {
    // this.setState({ addInvoice: !this.state.addInvoice })
    if (Object.keys(this.props.nextInvoice).length === 0) {
      this.props.openInvoiceModal(Date.now())
    } else {
      this.props.closeInvoiceModal()
    }
  }

  render() {
    return (
        <div>
        <button className='btn' onClick={this._handleAddInvoiceToggle}>Nová faktura</button>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Odběratel</th>
              <th>Částka</th>
              <th>DPH</th>
              <th>Celkem</th>
            </tr>
          </thead>
          <tbody>
            {this.props.invoices.map(invoice => {
              return (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.customer}</td>
                  <td>{invoice.price}</td>
                  <td>{invoice.VAT}</td>
                  <td>{invoice.total}</td>
                </tr>
              )
            })}

          </tbody>
        </table>
        <InvoiceForm invoice={{}} onHideRequest={this._handleAddInvoiceToggle} />
      </div>
    )
  }
}

export default connect({}, actions)(InvoiceTable)
