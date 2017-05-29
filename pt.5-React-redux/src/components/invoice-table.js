import React, { Component } from 'react'


const InvoiceTable = () => {
  return (
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
  )
}

export default InvoiceTable
