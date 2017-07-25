import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import Counter from "./components/counter/Counter";

const render = (App) => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("root")
  );
};

render(Counter);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./components/counter/Counter", () => {
    /* eslint-disable global-require */
    const HotCounter = require("./components/counter/Counter").default;
    render(HotCounter);
  });
}

