import { useState, useContext } from "react";
import styles from "./StaffFlightSearch.module.css";
import AuthContext from "../../context/auth-context";

const StaffFlightSearch = (props) => {
  const ctx = useContext(AuthContext);
  const [srcCity, setSrcCity] = useState("");
  const [srcAirport, setSrcAirport] = useState("");
  const [dstCity, setDstCity] = useState("");
  const [dstAirport, setDstAirport] = useState("");
  const [range, setRange] = useState("");
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
    formData.append("airline_name", ctx.isLoggedIn.airline);

    const formValues = [srcCity, srcAirport, dstCity, dstAirport];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      return;
    }

    fetch("http://localhost:5000/staff_view_flights", {
      method: "GET",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) { 
          return response.json();
        } else {
          throw new Error("Error searching for flights");
        }
      })
      .then((data) => {
        props.flightsHandler(data);
        setComplete(true);
      })
      .catch((error) => {
        console.log(error);
      });
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
      {!complete && <p>Missing fields.</p>}
      <button onClick={submitHandler}>Search</button>
    </form>
  );
};

export default StaffFlightSearch;
