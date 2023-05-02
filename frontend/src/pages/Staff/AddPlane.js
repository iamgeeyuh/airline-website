import { useContext, useEffect, useState } from "react";
import AddPlaneModal from "../../components/AddPlaneModal/AddPlaneModal";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const AddPlane = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [airplaneID, setAirplaneID] = useState("");
  const [seats, setSeats] = useState("");
  const [manufacturingDate, setManufacturingDate] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);
  const [modal, setModal] = useState(false);
  const [planes, setPlanes] = useState([]);

  const airplaneIDHandler = (event) => {
    setAirplaneID(event.target.value);
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

  const modalHandler = () => {
    setModal(false);
  };

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("airplane_id", airplaneID);
    formData.append("airline_name", ctx.isLoggedIn.airline);
    formData.append("manufacturer", manufacturer);
    formData.append("manufacturing_date", manufacturingDate);
    formData.append("seats", seats);

    const formValues = [airplaneID, manufacturer, manufacturingDate, seats];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }

    fetch("http://localhost:5000/add_airplane", {
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
        setModal(data.length === 0);
        setValid(data.length === 0);
        setPlanes(data);
        setComplete(true);
      })
      .catch((error) => {
        console.log(error);
      });
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
              <label>Seats</label>
              <input type="number" onChange={seatsHandler} />
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
              <input type="date" onChange={manufacturingDateHandler} />
            </div>
          </div>
          {!valid && <p>Plane already exists.</p>}
          {!complete && <p>Missing fields.</p>}
          <button type="submit" onClick={submitHandler}>
            Submit
          </button>
        </form>
      )}
      {modal && <AddPlaneModal modalHandler={modalHandler} planes={planes} />}
      {modal && <div className={styles.dimmedBackground}></div>}
    </div>
  );
};

export default AddPlane;
