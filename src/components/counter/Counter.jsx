import React from "react";
import styles from "./counter.scss";

const arrow = require("./arrow.svg");

/**
 * A counter button: tap the button to increase the count.
 */
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    const { count } = this.state;
    return (
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          this.setState((prevState) => ({ count: prevState.count + 1 }));
        }}
      >
        <img width="15px" src={arrow} alt="arrow" />
        <span>
          <strong>Counter: </strong>
          {count}
        </span>
      </button>
    );
  }
}

export default Counter;
