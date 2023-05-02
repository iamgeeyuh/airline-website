import { useState } from "react";
import styles from "./CustomerFlightSearch.module.css";

const CustomerFlightSearch = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const currentMonthString = `${currentYear}-${currentMonth}`;

  const [srcCity, setSrcCity] = useState("");
  const [srcAirport, setSrcAirport] = useState("");
  const [dstCity, setDstCity] = useState("");
  const [dstAirport, setDstAirport] = useState("");
  const [range, setRange] = useState(currentMonthString);
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);

  const srcCityHandler = (event) => {
    setSrcCity(event.target.value);
  };

  const dstCityHandler = (event) => {
    setDstCity(event.target.value);
  };

  const srcAirportHandler = (event) => {
    setSrcAirport(event.target.value);
  };

  const dstAirportHandler = (event) => {
    setDstAirport(event.target.value);
  };

  const rangeHandler = (event) => {
    setRange(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("src_city", srcCity);
    formData.append("src_airport", srcAirport);
    formData.append("dst_city", dstCity);
    formData.append("dst_airport", dstAirport);
    formData.append("range", range);

    const formValues = [srcCity, srcAirport, dstCity, dstAirport];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }
  };

  return (
    <form className={styles.flightSearch}>
      <h2>View Flights</h2>
      <div>
        <div>
          <label>From</label>
          <div>
            <input
              type="text"
              placeholder="New York City"
              value={srcCity}
              onChange={srcCityHandler}
            />
            <input type="text" placeholder="JFK" onChange={srcAirportHandler} />
          </div>
        </div>
        <div>
          <label>To</label>
          <div>
            <input
              type="text"
              placeholder="Chicago"
              value={dstCity}
              onChange={dstCityHandler}
            />
            <input
              type="text"
              placeholder="O'Hare"
              value={dstAirport}
              onChange={dstAirportHandler}
            />
          </div>
        </div>
        <div>
          <label>Range</label>
          <div>
            <input type="month" value={range} onChange={rangeHandler} />
          </div>
        </div>
      </div>
      {!valid && <p>Airport already exists.</p>}
      {!complete && <p>Missing fields.</p>}
      <button onClick={submitHandler}>Search</button>
    </form>
  );
};

export default CustomerFlightSearch;