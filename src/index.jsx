import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./components/counter/Counter";

const render = (App) => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("root")
  );
};

render(App);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./components/counter/Counter", () => {
    const App = require("./components/counter/Counter").default;
    render(App);
  });
}

