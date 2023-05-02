import { useContext, useEffect, useState } from "react";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const ChangeFlightStatus = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [flightNum, setFlightNum] = useState("");
  const [depTime, setDepTime] = useState("");
  const [newStatus, setNewStatus] = useState("on-time");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);
  const [success, setSuccess] = useState(false);
  const flightNumHandler = (event) => {
    setFlightNum(event.target.value);
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
    formData.append("airline_name", ctx.isLoggedIn.airline);
    formData.append("new_status", newStatus);

    const formValues = [flightNum, depTime];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      setSuccess(false);
      return;
    }

    fetch("http://localhost:5000/change_status", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error creating flight");
        }
      })
      .then((data) => {
        setValid(data.change_status);
        setSuccess(data.change_status);
        setComplete(true);
      })
      .catch((error) => {
        console.log(error);
      });
    setNewStatus("on-time");
    setFlightNum("");
    setDepTime("");
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
              <select onChange={newStatusHandler}>
                <option>on-time</option>
                <option>delayed</option>
              </select>
            </div>
          </div>
          <div>
            <div>
              <label>Flight Number</label>
              <input
                type="text"
                onChange={flightNumHandler}
                placeholder="370"
                value={flightNum}
              />
            </div>
            <div>
              <label>Departure Time</label>
              <input
                type="datetime-local"
                onChange={depTimeHandler}
                value={depTime}
              />
            </div>
          </div>
          {!valid && <p>Flight does not exist.</p>}
          {!complete && <p>Missing fields.</p>}
          {success && <p style={{ color: "green" }}>Status changed.</p>}
          <button type="submit" onClick={submitHandler}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangeFlightStatus;
