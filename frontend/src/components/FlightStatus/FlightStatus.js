import { useState } from "react";
import styles from "./FlightStatus.module.css";

const FlightStatus = () => {
  const [airline, setAirline] = useState("");
  const [flightNum, setFlightNum] = useState("");
  const [arrDate, setArrDate] = useState("");
  const [depDate, setDepDate] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);

  const airlineHandler = (event) => {
    setAirline(event.target.value);
  };

  const flightNumHandler = (event) => {
    setFlightNum(event.target.value);
  };

  const arrDateHandler = (event) => {
    setArrDate(event.target.value);
  };

  const depDateHandler = (event) => {
    setDepDate(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("airline_name", airline);
    formData.append("flight_num", flightNum);
    formData.append("arrival_date", arrDate);
    formData.append("dep_date", depDate);

    const formValues = [airline, flightNum, arrDate, depDate];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }
  };

  return (
    <form className={styles.flightStatus}>
      <h2>Check Flight Status</h2>
      <div>
        <div>
          <label>Airline Name</label>
          <input type="text" placeholder="Jet Blue" onChange={airlineHandler} />
        </div>
        <div>
          <label>Flight Number</label>
          <input type="text" placeholder="370" onChange={flightNumHandler} />
        </div>
        <div>
          <label>Arrival</label>
          <input type="date" onChange={arrDateHandler} />
        </div>
        <div>
          <label>Departure</label>
          <input type="date" onChange={depDateHandler} />
        </div>
      </div>
      {!valid && <p>Flight does not exist.</p>}
      {!complete && <p>Missing fields.</p>}
      <button onClick={submitHandler}>Search</button>
    </form>
  );
};

export default FlightStatus;
