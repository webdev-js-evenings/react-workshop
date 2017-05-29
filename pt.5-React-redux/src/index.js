import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import { initialData } from './store'

ReactDOM.render(<App {...initialData} />, document.getElementById('root'));
registerServiceWorker();
