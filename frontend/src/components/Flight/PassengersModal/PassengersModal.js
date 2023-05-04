import { useRef, useEffect, useState } from "react";
import styles from "./PassengersModal.module.css";

const PassengersModal = (props) => {
  const modalRef = useRef(null);
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const clickOutsideHandler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        props.modalHandler();
      }
    };
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [modalRef]);

  const loadPassengers = () => {
    const formData = new URLSearchParams();
    formData.append("airline_name", props.airline);
    formData.append("flight_num", props.flightNum);
    formData.append("dep_date", props.depDate);
    formData.append("dep_time", props.depTime);

    fetch("http://localhost:5000/view_passengers", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error viewing ratings");
        }
      })
      .then((data) => {
        setPassengers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadPassengers();
  }, []);

  return (
    <div className={styles.modal} ref={modalRef}>
      <div>
        <h2>Passengers</h2>
        {passengers.length === 0 ? (
          <p>No passengers</p>
        ) : (
          passengers.map((passenger) => (
            <div>
              <p>{passenger.name}</p>
              <p>{passenger.email}</p>
            </div>
          ))
        )}
      </div>
      <div>
        <button onClick={props.modalHandler}>Ok</button>
      </div>
    </div>
  );
};

export default PassengersModal;
