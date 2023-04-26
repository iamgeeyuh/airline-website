import { useState } from "react";
import styles from "./FlightSearch.module.css";

const FlightSearch = () => {
  const [way, setWay] = useState(true);

  const wayHandler = (event) => {
    setWay(event.target.value == "One Way");
  };
  return (
    <form className={styles.flightSearch}>
      <div>
        <div>
          <label>From</label>
          <input type="text" placeholder="New York City" />
        </div>
        <div>
          <label>To</label>
          <input type="text" placeholder="Chicago" />
        </div>
      </div>
      <div>
        <div>
          <label>Departure</label>
          <input type="date" />
        </div>
        {!way && (
          <div>
            <label>Return</label>
            <input type="date" />
          </div>
        )}
        <div>
          <button>Search</button>
        </div>
      </div>
      <select onChange={wayHandler}>
        <option>One Way</option>
        <option>Two Way</option>
      </select>
    </form>
  );
};

export default FlightSearch;
