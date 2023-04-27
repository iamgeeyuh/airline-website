import { useState } from "react";
import styles from "./FlightSearch.module.css";

const FlightSearch = () => {
  const [way, setWay] = useState(true);
  const [srcCity, setSrcCity] = useState("");
  const [srcAirline, setSrcAirline] = useState("");
  const [dstCity, setDstCity] = useState("");
  const [dstAirline, setDstAirline] = useState("");
  const [depDate, setDepDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const srcCityHandler = (event) => {
    setSrcCity(event.target.value);
  };

  const dstCityHandler = (event) => {
    setDstCity(event.target.value);
  };

  const srcAirlineHandler = (event) => {
    setSrcAirline(event.target.value);
  };

  const dstAirlineHandler = (event) => {
    setDstAirline(event.target.value);
  };

  const depDateHandler = (event) => {
    setDepDate(event.target.value);
  };

  const returnDateHandler = (event) => {
    setReturnDate(event.target.value);
  };

  const wayHandler = (event) => {
    setWay(event.target.value == "One Way");
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form className={styles.flightSearch}>
      <div>
        <div>
          <label>From</label>
          <div>
            <input
              type="text"
              placeholder="New York City"
              onChange={srcCityHandler}
            />
            <input type="text" placeholder="JFK" onChange={srcAirlineHandler} />
          </div>
        </div>
        <div>
          <label>To</label>
          <div>
            <input
              type="text"
              placeholder="Chicago"
              onChange={dstCityHandler}
            />
            <input
              type="text"
              placeholder="O'Hare"
              onChange={dstAirlineHandler}
            />
          </div>
        </div>
      </div>
      <div>
        <div>
          <select onChange={wayHandler}>
            <option>One Way</option>
            <option>Two Way</option>
          </select>
          <label>Departure</label>
          <input type="date" onChange={depDateHandler} />
        </div>
        {!way && (
          <div>
            <label>Return</label>
            <input type="date" onChange={returnDateHandler} />
          </div>
        )}
      </div>
      <button onClick={submitHandler}>Search</button>
    </form>
  );
};

export default FlightSearch;
