
export default (dev = true) => (store) => (next) => {
  const logIt = (title, toLog) => {
    if (!dev) {
      return
    }

    console.log(title, toLog)
  }

  return (action) => {
    const nextState = next(action)
    logIt('Action:', action)
    logIt('State:', nextState)
    return nextState
  }
}
