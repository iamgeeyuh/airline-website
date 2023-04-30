import { useState } from "react";
import FlightStatusModal from "../FlightStatusModal/FlightStatusModal";
import styles from "./FlightStatus.module.css";

const FlightStatus = () => {
  const [airline, setAirline] = useState("");
  const [flightNum, setFlightNum] = useState("");
  const [depDate, setDepDate] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState("");

  const modalHandler = () => {
    setModal(false);
  };

  const airlineHandler = (event) => {
    setAirline(event.target.value);
  };

  const flightNumHandler = (event) => {
    setFlightNum(event.target.value);
  };

  const depDateHandler = (event) => {
    setDepDate(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("airline_name", airline);
    formData.append("flight_num", flightNum);
    formData.append("dep_date", depDate);

    const formValues = [airline, flightNum, depDate];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }

    fetch("http://localhost:5000/check_flight_status", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error searching for status");
        }
      })
      .then((data) => {
        if (data.status == "empty") {
          setValid(false);
        } else {
          setAirline("");
          setFlightNum("");
          setDepDate("");
          setStatus(data.status);
          setModal(true);
          setValid(true);
        }
        setComplete(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form className={styles.flightStatus}>
      {modal && (
        <FlightStatusModal status={status} modalHandler={modalHandler} />
      )}
      {modal && <div className={styles.dimmedBackground} />}
      <h2>Check Flight Status</h2>
      <div>
        <div>
          <label>Airline Name</label>
          <input
            type="text"
            placeholder="Jet Blue"
            value={airline}
            onChange={airlineHandler}
          />
        </div>
        <div>
          <label>Flight Number</label>
          <input
            type="text"
            placeholder="370"
            value={flightNum}
            onChange={flightNumHandler}
          />
        </div>
        <div>
          <label>Departure</label>
          <input
            type="datetime-local"
            value={depDate}
            onChange={depDateHandler}
          />
        </div>
      </div>
      {!valid && <p>Flight does not exist.</p>}
      {!complete && <p>Missing fields.</p>}
      <button onClick={submitHandler}>Search</button>
    </form>
  );
};

export default FlightStatus;
