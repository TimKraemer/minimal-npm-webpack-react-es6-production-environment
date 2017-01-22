import React from "react";
import styles from "./counter.css";

/**
 * A counter button: tap the button to increase the count.
 */
class Counter extends React.Component {
    constructor() {
        super();
        this.state = {
            count: 0,
        };
    }

    render() {
        return (
            <button className={styles.button} onClick={() => {
                this.setState({count: this.state.count + 1});
            }}>
                <img width={"15px"} src={require("./arrow.png")} alt="arrow"/>
                <span dangerouslySetInnerHTML={{__html: require("./template.html")}}/> {this.state.count}
            </button>
        );
    }
}
export default Counter;
