import { useRef, useEffect, useState } from "react";
import Ratings from "../Ratings";
import styles from "./RatingsModal.module.css";

const RatingsModal = (props) => {
  const modalRef = useRef(null);
  const [ratings, setRatings] = useState([]);
  const [avg, setAvg] = useState(0);

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

  const loadRatings = () => {
    const formData = new URLSearchParams();
    formData.append("airline_name", props.airline);
    formData.append("flight_num", props.flightNum);
    formData.append("dep_datetime", props.depDate + " " + props.depTime);

    console.log(props.depDate)
    console.log(props.depTime)

    fetch("http://localhost:5000//view_flight_ratings", {
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
        setRatings(data.rates);
        setAvg(data.avg_rating);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadRatings();
  }, []);

  return (
    <div className={styles.modal} ref={modalRef}>
      <div>
        <h2>Ratings</h2>
        {avg !== 0 && <p>Avg Rating: {avg} stars</p>}
        {ratings.length == 0 ? (
          <p>No reviews</p>
        ) : (
          ratings.map((rating) => (
            <Ratings
              name={rating.name}
              review={rating.review}
              rating={rating.rating}
            />
          ))
        )}
      </div>
      <div>
        <button onClick={props.modalHandler}>Ok</button>
      </div>
    </div>
  );
};

export default RatingsModal;
