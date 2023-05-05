import { useContext, useEffect, useState } from "react";
import CreateFlightModal from "../../components/CreateFlightModal/CreateFlightModal";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const CreateFlight = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [flightNum, setFlightNum] = useState("");
  const [airplaneID, setAirplaneID] = useState("");
  const [depTime, setDepTime] = useState("");
  const [depCode, setDepCode] = useState("");
  const [arrTime, setArrTime] = useState("");
  const [arrCode, setArrCode] = useState("");
  const [price, setPrice] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);
  const [modal, setModal] = useState(false);

  const modalHandler = () => {
    setModal(false);
  };

  const flightNumHandler = (event) => {
    setFlightNum(event.target.value);
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

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("flight_num", flightNum);
    formData.append("departure_datetime", depTime);
    formData.append("arrival_datetime", arrTime);
    formData.append("arrival_airport_code", arrCode);
    formData.append("departure_airport_code", depCode);
    formData.append("airplane_id", airplaneID);
    formData.append("base_price", price);
    formData.append("status", "on-time");
    formData.append("airline_name", ctx.isLoggedIn.airline);

    const formValues = [
      flightNum,
      depTime,
      arrTime,
      arrCode,
      depCode,
      airplaneID,
      price,
    ];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }

    fetch("http://localhost:5000/create_flight", {
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
        setModal(data.length !== 0);
        setValid(data.length !== 0);
        setComplete(true);
      })
      .catch((error) => {
        console.log(error);
      });

    setFlightNum("");
    setAirplaneID("");
    setDepTime("");
    setDepCode("");
    setArrTime("");
    setArrCode("");
    setPrice("");
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
                value={flightNum}
                onChange={flightNumHandler}
              />
            </div>
            <div>
              <label>Airplane ID</label>
              <input
                type="text"
                value={airplaneID}
                onChange={airplaneIDHandler}
              />
            </div>
          </div>
          <div>
            <div>
              <label>Departure Time</label>
              <input
                type="datetime-local"
                value={depTime}
                onChange={depTimeHandler}
              />
            </div>
            <div>
              <label>Departure Airport Code</label>
              <input type="text" value={depCode} onChange={depCodeHandler} />
            </div>
          </div>
          <div>
            <div>
              <label>Arrival Time</label>
              <input
                type="datetime-local"
                value={arrTime}
                onChange={arrTimeHandler}
              />
            </div>
            <div>
              <label>Arrival Airport Code</label>
              <input type="text" value={arrCode} onChange={arrCodeHandler} />
            </div>
          </div>
          <div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="3000"
                value={price}
                onChange={priceHandler}
              />
            </div>
          </div>
          {!valid && <p>Invalid input.</p>}
          {!complete && <p>Missing fields.</p>}
          <button onClick={submitHandler} type="submit">
            Submit
          </button>
        </form>
      )}
      {modal && <CreateFlightModal modalHandler={modalHandler} />}
      {modal && <div className={styles.dimmedBackground}></div>}
    </div>
  );
};

export default CreateFlight;
