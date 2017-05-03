import React from "react";
import ReactDOM from "react-dom";
/* eslint import/no-extraneous-dependencies: 0 */
import { AppContainer } from "react-hot-loader";
import App from "./components/counter/Counter";

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("root")
  );
};

render(App);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./components/counter/Counter", () => {
    /* eslint global-require: 0 */
    const NewApp = require("./components/counter/Counter").default;
    render(NewApp);
  });
}

