import { useContext, useEffect, useState } from "react";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const AddPlane = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [airplaneID, setAirplaneID] = useState("");
  const [airline, setAirline] = useState("");
  const [seats, setSeats] = useState("");
  const [manufacturingDate, setManufacturingDate] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [age, setAge] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);

  const airplaneIDHandler = (event) => {
    setAirplaneID(event.target.value);
  };

  const airlineHandler = (event) => {
    setAirline(event.target.value);
  };

  const seatsHandler = (event) => {
    setSeats(event.target.value);
  };

  const manufacturingDateHandler = (event) => {
    setManufacturingDate(event.target.value);
  };

  const manufacturerHandler = (event) => {
    setManufacturer(event.target.value);
  };

  const ageHandler = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("airplane_id", airplaneID);
    formData.append("airline_name", airline);
    formData.append("manufacturer", manufacturer);
    formData.append("manufacturing_date", manufacturingDate);
    formData.append("seats", seats);
    formData.append("age", age);

    const formValues = [
      airplaneID,
      airline,
      manufacturer,
      manufacturingDate,
      seats,
      age,
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
          <h2>Add Plane</h2>
          <div>
            <div>
              <label>Airplane ID</label>
              <input type="text" onChange={airplaneIDHandler} />
            </div>
            <div>
              <label>Airline</label>
              <input
                type="text"
                placeholder="Jet Blue"
                onChange={airlineHandler}
              />
            </div>
          </div>
          <div>
            <div>
              <label>Manufacturer</label>
              <input
                type="text"
                placeholder="Boeing"
                onChange={manufacturerHandler}
              />
            </div>
            <div>
              <label>Manufacturing Date</label>
              <input
                type="datetime-local"
                onChange={manufacturingDateHandler}
              />
            </div>
            <div>
              <label>Seats</label>
              <input type="number" />
            </div>
          </div>
          <div>
            <div>
              <label>Age</label>
              <input type="number" onChange={ageHandler} />
            </div>
          </div>
          {!valid && <p>Plane already exists.</p>}
          {!complete && <p>Missing fields.</p>}
          <button type="submit" onClick={submitHandler}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default AddPlane;
