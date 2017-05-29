import React, { Component } from 'react';
import './App.css';

import InvoiceTable from './components/invoice-table'
import TaxesCalculator from './components/taxes-calculator'


class App extends Component {
  render() {

    return (
      <div className='App row'>
        <div className='flex-4'>
          <h2>Faktury</h2>
          <InvoiceTable invoices={this.props.invoices} />
        </div>
        <div className='flex-2'>
          <h2>Daně</h2>
          <TaxesCalculator {...this.props.tax} />
        </div>
      </div>
    );
  }
}

export default App;
