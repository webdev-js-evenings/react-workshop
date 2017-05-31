import React from 'react'


const TaxesCalculator = ({ income, tax, taxRatio, costsRatio }) => {

  return (
    <table>
      <tbody>
        <tr>
          <td className='key'>Příjem</td><td className='value'>{income.toLocaleString()},-</td>
        </tr>
        <tr>
          <td className='key'>Nákladový paušál</td>
          <td className='value'>
            <select defaultValue={costsRatio}>
              <option value={60}>60%</option>
              <option value={40}>40%</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>Náklady <small>{costsRatio}%</small></td>
          <td>35000,-</td>
        </tr>
        <tr>
          <td>Základ daně </td>
          <td>70000,-</td>
        </tr>
        <tr>
          <td className='tax'>Daň <small>{taxRatio}%</small></td>
          <td className='tax'><strong>{tax.toLocaleString()},-</strong></td>
        </tr>
      </tbody>
    </table>
  )
}

export default TaxesCalculator
