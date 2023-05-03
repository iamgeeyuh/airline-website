import { useState } from "react";
import styles from "./HomeFlightSearch.module.css";

const FlightSearch = (props) => {
  const [way, setWay] = useState(true);
  const [srcCity, setSrcCity] = useState("");
  const [srcAirport, setSrcAirport] = useState("");
  const [dstCity, setDstCity] = useState("");
  const [dstAirport, setDstAirport] = useState("");
  const [depDate, setDepDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

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

  const depDateHandler = (event) => {
    setDepDate(event.target.value);
  };

  const returnDateHandler = (event) => {
    setReturnDate(event.target.value);
  };

  const wayHandler = (event) => {
    setWay(event.target.value === "One Way");
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("src_city", srcCity);
    formData.append("src_airport", srcAirport);
    formData.append("dst_city", dstCity);
    formData.append("dst_airport", dstAirport);
    formData.append("dep_date", depDate);
    formData.append("return_date", returnDate);
    formData.append("isOneWay", way);

    fetch("http://localhost:5000/search_flight", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error searching");
        }
      })
      .then((data) => {
        props.flightsHandler(data);
        console.log(data)
      })
      .catch((error) => {
        console.log(error);
      });
    setDepDate("");
    setSrcAirport("");
    setSrcCity("");
    setDstAirport("");
    setDstCity("");
    setReturnDate("");
  };

  return (
    <form className={styles.flightSearch}>
      <h2>Search Flights</h2>
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
            <input
              type="text"
              placeholder="JFK"
              value={srcAirport}
              onChange={srcAirportHandler}
            />
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
      </div>
      <div>
        <div>
          <select onChange={wayHandler}>
            <option>One Way</option>
            <option>Two Way</option>
          </select>
          <label>Departure</label>
          <input
            type="datetime-local"
            value={depDate}
            onChange={depDateHandler}
          />
        </div>
        {!way && (
          <div>
            <label>Return</label>
            <input
              type="datetime-local"
              value={returnDate}
              onChange={returnDateHandler}
            />
          </div>
        )}
      </div>
      <button onClick={submitHandler}>Search</button>
    </form>
  );
};

export default FlightSearch;
