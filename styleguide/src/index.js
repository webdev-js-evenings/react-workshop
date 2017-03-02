import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Button from './components/button'
import './index.css';

const Pozdrav = (props) => {
  return (
    <h2>{`Pozdrav: ${props.name || 'Nikoho'}` }</h2>
  )
}
Pozdrav.propTypes = {
  name: React.PropTypes.string,
}


const DropDown = (props) => {
  console.log(props)
  return (
    <div className="btn-group btn-dropdown">
  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Action <span className="caret"></span>
  </button>
  <ul className={`dropdown-menu ${props.collapsed ? 'hidden' : 'show'}`}>
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li role="separator" className="divider"></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>
  )
}
DropDown.propTypes = {
  collapsed: React.PropTypes.bool,
}



const appState = {
  components: [Button, DropDown, Pozdrav],
}





ReactDOM.render(
  <App {...appState} />,
  document.getElementById('root')
);
