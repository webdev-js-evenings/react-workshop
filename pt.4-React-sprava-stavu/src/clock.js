import React from 'react'

import moment from 'moment'


export default class Clock extends React.Component {
  _timeout = null

  static defaultProps = {
    tickInterval: 'second',
  }

  componentDidMount() {
    this._timeout = setTimeout(this._handleTick, this.props.tick)
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
  }

  _handleTick = () => {
    this.props.onTick(
      moment(this.props.time)
      .add(this.props.tick / 1000, this.props.tickInterval)
    )
    setTimeout(this._handleTick, this.props.tick)
  }

 render() {
    return (
      <strong>{moment(this.props.time).format('H:mm:ss')}</strong>
    )
 }
}
