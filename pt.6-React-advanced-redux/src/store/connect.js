import React from 'react'

export default (stateToProps = {}, actions = {}) => (Component) => {
  return class extends React.PureComponent {
    static contextTypes = {
      store: React.PropTypes.object.isRequired,
    }

    static displayName = Component.displayName || Component.name

    state = this.context.store.getState()

    componentDidMount() {
      this.context.store.listen(this._handleStoreChange)
    }

    componentWillUnmout() {
      this.context.store.unlisten(this._handleStoreChange)
    }

    _handleStoreChange = () => {
      this.setState( this.context.store.getState())
    }

    _createAction = (action) => {
      const services = this.context.store.getServices()
      const requestedServices = (action.services || []).reduce((providedServices, serviceName) => {
        return {
          ...providedServices,
          [serviceName]: services[serviceName],
        }
      }, {})

      return (...args) => {
        this.context.store.dispatch(action(...(args.concat([requestedServices]))))
      }
    }

    _prepareActions() {
      const actionKeys = Object.keys(actions)
      return actionKeys.reduce((wrappedActions, actionKey) => {
        wrappedActions[actionKey] = this._createAction(actions[actionKey])

        return wrappedActions
      }, {})
    }

    render() {
      const stateKeys = Object.keys(stateToProps)
      const state = stateKeys.reduce((state, stateKey) => {
        return {
          ...state,
          [stateToProps[stateKey]]: this.state[stateKey], // transform to keys from stateProps = {'stateKey': 'propsKey'}
        }
      }, stateKeys.length === 0 ? this.state : {})

      const props = {
        ...state,
        ...this.props,
        ...this._prepareActions(),
      }

      return <Component {...props} />
    }
  }
}
