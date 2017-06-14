import React from 'react'

import { snapShotToArray } from '../utils'



export default class LazyLoad extends React.PureComponent {
  static contextTypes = {
    database: React.PropTypes.object.isRequired,
  }

  state = {
    error: null,
    loading: false,
    result: null,
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.context.database.ref(this.props.table).once('value').then((result) => {
      this.setState({ result: snapShotToArray(result), loading: false })
    })
    .catch((error) => {
      console.error('LazyLoad error ->', error)
      this.setState({ error })
    })
  }

  render() {
    if (this.state.loading) {
      return this.props.loadingComponent || null
    }

    if (this.state.error) {
      return this.props.errorComponent || null
    }

    if (this.state.result) {
      return this.props.children(this.state.result)
    }

    return null
  }
}
