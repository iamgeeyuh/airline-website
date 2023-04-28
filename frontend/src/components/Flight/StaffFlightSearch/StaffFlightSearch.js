import { useState } from "react";
import styles from "./StaffFlightSearch.module.css";

const StaffFlightSearch = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const currentMonthString = `${currentYear}-${currentMonth}`;

  const [srcCity, setSrcCity] = useState("");
  const [srcAirport, setSrcAirport] = useState("");
  const [dstCity, setDstCity] = useState("");
  const [dstAirport, setDstAirport] = useState("");
  const [range, setRange] = useState(currentMonthString);

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
            <input type="text" placeholder="JFK" onChange={srcAirportHandler} />
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
              onChange={dstAirportHandler}
            />
          </div>
        </div>
        <div>
          <label>Range</label>
          <div>
            <input
              type="month"
              value={currentMonthString}
              onChange={rangeHandler}
            />
          </div>
        </div>
      </div>
      <button onClick={submitHandler}>Search</button>
    </form>
  );
};

export default StaffFlightSearch;
