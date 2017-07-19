import React from "react";
import styles from "./counter.scss";

const arrow = require("./arrow.svg");

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
      <button
        className={styles.button}
        onClick={() => {
          this.setState({ count: this.state.count + 1 });
        }}
      >
        <img width={"15px"} src={arrow} alt="arrow" />
        <span>
          <strong>Counter: </strong> {this.state.count}
        </span>
      </button>
    );
  }
}
export default Counter;
