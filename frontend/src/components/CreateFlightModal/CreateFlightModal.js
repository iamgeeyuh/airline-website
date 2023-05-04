import { useRef, useEffect, useState, useContext } from "react";
import FoundFlight from "../Flight/FoundFlight/FoundFlight";
import styles from "./CreateFlightModal.module.css";
import AuthContext from "../../context/auth-context";

const CreateFlightModal = (props) => {
  const ctx = useContext(AuthContext);
  const modalRef = useRef(null);
  const [flights, setFlights] = useState([]);

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

  const futureFlights = () => {
    const formData = new URLSearchParams();
    formData.append("airline_name", ctx.isLoggedIn.airline);

    fetch("http://localhost:5000/view_flights", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error logging in");
        }
      })
      .then((data) => {
        setFlights(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    futureFlights();
  }, []);

  return (
    <div className={styles.modal} ref={modalRef}>
      <h1>Flight Added</h1>
      <FoundFlight flights={flights} page="staff" />
      <button onClick={props.modalHandler}>Ok</button>
    </div>
  );
};

export default CreateFlightModal;
