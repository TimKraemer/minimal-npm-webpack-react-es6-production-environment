import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./components/counter/Counter"; // FIXME: this could be nicer

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(App);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/counter/Counter', () => {
    /* eslint global-require: 0 */
    const NewApp = require('./components/counter/Counter').default;
    render(NewApp);
  });
}

