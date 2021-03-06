export const openInvoiceModal = (invoiceId) => {
  return {
    action: 'INVOICE_MODAL_OPEN',
    payload: {
      id: invoiceId,
    }
  }
}

export const closeInvoiceModal = () => {
  return {
    action: 'INVOICE_MODAL_CLOSE',
    payload: {}
  }
}

export const onInvoicePropertyChange = (invoiceProperty, value) => {
  return {
    action: 'UPDATE_NEXT_INVOICE',
    payload: {
      invoiceProperty, value,
    }
  }
}


export const addInvoice = () => {
  return {
    action: 'ADD_NEXT_INVOICE',
    payload: {},
  }
}
