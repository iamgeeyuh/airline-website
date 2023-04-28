import { useContext, useEffect, useState } from "react";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const CreateFlight = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [flightNum, setFlightNum] = useState("");
  const [airline, setAirline] = useState("");
  const [airplaneID, setAirplaneID] = useState("");
  const [depTime, setDepTime] = useState("");
  const [depCode, setDepCode] = useState("");
  const [arrTime, setArrTime] = useState("");
  const [arrCode, setArrCode] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);

  const flightNumHandler = (event) => {
    setFlightNum(event.target.value);
  };

  const airlineHandler = (event) => {
    setAirline(event.target.value);
  };

  const airplaneIDHandler = (event) => {
    setAirplaneID(event.target.value);
  };

  const depTimeHandler = (event) => {
    setDepTime(event.target.value);
  };

  const depCodeHandler = (event) => {
    setDepCode(event.target.value);
  };

  const arrTimeHandler = (event) => {
    setArrTime(event.target.value);
  };

  const arrCodeHandler = (event) => {
    setArrCode(event.target.value);
  };

  const priceHandler = (event) => {
    setPrice(event.target.value);
  };

  const statusHandler = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("flight_num", flightNum);
    formData.append("departure_datetime", depTime);
    formData.append("airline_name", airline);
    formData.append("arrival_datetime", arrTime);
    formData.append("arrival_airport_code", arrCode);
    formData.append("departure_airport_code", depCode);
    formData.append("airplane_id", airplaneID);
    formData.append("base_price", price);
    formData.append("status", status);

    const formValues = [
      flightNum,
      depTime,
      airline,
      arrTime,
      arrCode,
      depCode,
      airplaneID,
      price,
      status,
    ];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }
  };

  return (
    <div className={styles.staffFormContainer}>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <form className={styles.staffForm}>
          <h2>Create Flight</h2>
          <div>
            <div>
              <label>Flight Number</label>
              <input
                type="text"
                placeholder="370"
                onChange={flightNumHandler}
              />
            </div>
            <div>
              <label>Airline Name</label>
              <input
                type="text"
                placeholder="Jet Blue"
                onChange={airlineHandler}
              />
            </div>
            <div>
              <label>Airplane ID</label>
              <input type="text" onChange={airplaneIDHandler} />
            </div>
          </div>
          <div>
            <div>
              <label>Departure Time</label>
              <input type="datetime-local" onChange={depTimeHandler} />
            </div>
            <div>
              <label>Departure Airport Code</label>
              <input type="text" onChange={depCodeHandler} />
            </div>
          </div>
          <div>
            <div>
              <label>Arrival Time</label>
              <input type="datetime-local" onChange={arrTimeHandler} />
            </div>
            <div>
              <label>Arrival Airport Code</label>
              <input type="text" onChange={arrCodeHandler} />
            </div>
          </div>
          <div>
            <div>
              <label>Price</label>
              <input type="number" placeholder="3000" onChange={priceHandler} />
            </div>
            <div>
              <label>Status</label>
              <input
                type="text"
                placeholder="on-time"
                onChange={statusHandler}
              />
            </div>
          </div>
          {!valid && <p>Flight already exists.</p>}
          {!complete && <p>Missing fields.</p>}
          <button onClick={submitHandler} type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateFlight;
