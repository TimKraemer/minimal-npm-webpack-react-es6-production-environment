import React from "react";
import ReactDOM from "react-dom";
import App from "./components/counter/Counter"; // FIXME: this could be nicer
import {AppContainer} from "react-hot-loader";

const appPath = "./components/counter/Counter";

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('root')
    );
};

render(App);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept(appPath, () => {
        const NewApp = require(appPath).default;
        render(NewApp)
    });
}