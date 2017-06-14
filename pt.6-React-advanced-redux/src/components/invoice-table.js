import React from 'react'

import InvoiceForm from './invoice-form'
import LazyLoad from './lazy-load'

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
              <LazyLoad table='/invoices/'>
              {(invoices) => (
                <tbody>
                    {invoices.map(invoice => {
                      return (
                        <tr key={invoice.id}>
                          <td>{invoice.id}</td>
                          <td>{invoice.customer}</td>
                          <td className='cell-right'>{invoice.price},-</td>
                          <td className='cell-right'>{invoice.vat},-</td>
                          <td className='total cell-right'>{Number(invoice.total || 0).toLocaleString()},-</td>
                        </tr>
                      )
                    })}
                </tbody>
              )}
            </LazyLoad>
          </table>
          <InvoiceForm onHideRequest={this._handleAddInvoiceToggle} />
        </div>
    )
  }
}

export default connect({}, actions)(InvoiceTable)
