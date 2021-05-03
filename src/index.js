import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { store, history } from './store';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import App from './components/App';

// import 'bootstrap';
import './assets/index.css';
// import 'react-select-2/dist/css/react-select-2.css';

ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {/* <Router> */}
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      {/* </Router> */}
    </ConnectedRouter>
  </Provider>

), document.getElementById('root'));
