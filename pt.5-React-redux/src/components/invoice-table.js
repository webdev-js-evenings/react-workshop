import React from 'react'

import InvoiceForm from './invoice-form'


class InvoiceTable extends React.PureComponent {
  state = {
    addInvoice: false,
  }


  _handleAddInvoiceToggle = () => {
    this.setState({ addInvoice: !this.state.addInvoice })
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
            <tr>
              <td>134TD</td>
              <td>Avocode</td>
              <td>132000</td>
              <td>23123</td>
              <td>123123213</td>
            </tr>
          </tbody>
        </table>
        {this.state.addInvoice && <InvoiceForm invoice={{}} onHideRequest={this._handleAddInvoiceToggle} />}
      </div>
    )
  }
}

export default InvoiceTable
