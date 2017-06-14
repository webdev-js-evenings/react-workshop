import { snapShotToArray } from '../utils'


const inject = (services) => (fn) => {
  fn.services = services
  return fn
}

export const openInvoiceModal = (invoiceId, { database }) => {
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

export const refreshInvoices = inject(['database', 'dispatch'])(({ database, dispatch }) => {
  database.ref('/invoices/').once().then(result => {
    dispatch({
      action: 'INVOICES_REFRESH',
      payload: { invoices: snapShotToArray(result) }
    })
  })
})

export const addInvoice = inject(['database', 'getState'])(async (formInvoiceProps, { database, getState }) => {
  const nextInvoice = getState().nextInvoice
  if (Object.keys(nextInvoice) === 0) {
    return
  }

  const invoice = {
    ...nextInvoice,
    ...formInvoiceProps,
  }


  await database.ref(`/invoices/${nextInvoice.id}`).set(invoice)

  return {
    action: 'ADD_NEXT_INVOICE',
    payload: { invoice },
  }
})
