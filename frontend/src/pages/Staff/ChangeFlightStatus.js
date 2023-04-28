import { useContext, useEffect, useState } from "react";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const ChangeFlightStatus = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [flightNum, setFlightNum] = useState("");
  const [airline, setAirline] = useState("");
  const [depTime, setDepTime] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);

  const flightNumHandler = (event) => {
    setFlightNum(event.target.value);
  };

  const airlineHandler = (event) => {
    setAirline(event.target.value);
  };

  const depTimeHandler = (event) => {
    setDepTime(event.target.value);
  };

  const newStatusHandler = (event) => {
    setNewStatus(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("flight_num", flightNum);
    formData.append("departure_datetime", depTime);
    formData.append("airline_name", airline);
    formData.append("new_status", newStatus);

    const formValues = [flightNum, depTime, airline, newStatus];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }
  };

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  return (
    <div className={styles.staffFormContainer}>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <form className={styles.staffForm}>
          <h2>Change Flight Status</h2>
          <div>
            <div>
              <label>New Status</label>
              <input
                type="text"
                onChange={newStatusHandler}
                placeholder="on-time"
              />
            </div>
          </div>
          <div>
            <div>
              <label>Flight Number</label>
              <input
                type="text"
                onChange={flightNumHandler}
                placeholder="370"
              />
            </div>
            <div>
              <label>Airline</label>
              <input
                type="text"
                onChange={airlineHandler}
                placeholder="Jet Blue"
              />
            </div>
            <div>
              <label>Departure Time</label>
              <input type="datetime-local" onChange={depTimeHandler} />
            </div>
          </div>
          {!valid && <p>Airplane already exists.</p>}
          {!complete && <p>Missing fields.</p>}
          <button type="submit" onClick={submitHandler}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangeFlightStatus;
