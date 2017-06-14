import React from 'react'

export default class StoreProvider extends React.PureComponent {
  static childContextTypes = {
    store: React.PropTypes.object.isRequired,
    database: React.PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      store: this.props.store,
      database: this.props.database,
    }
  }

  render() {
    return this.props.children
  }
}
