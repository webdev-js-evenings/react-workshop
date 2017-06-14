export default (state, { action, payload }) => {
  switch (action) {
    case 'INVOICE_MODAL_OPEN':
      return {
        ...state,
        nextInvoice: {
          id: payload['id'],
        }
      }

    case 'INVOICE_MODAL_CLOSE':
      return {
        ...state,
        nextInvoice: {}
      }

    case 'UPDATE_NEXT_INVOICE':
      return {
        ...state,
        nextInvoice: {
          ...(state.nextInvoice || {}),
          [payload['invoiceProperty']]: payload['value'],
        }
      }


    case 'ADD_NEXT_INVOICE':
      return {
        ...state,
        nextInvoice: {},
        invoices: state.invoices.concat([payload.invoice])
      }
  }

  return state
}
