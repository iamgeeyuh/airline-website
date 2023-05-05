import { useRef, useEffect, useContext, useState } from "react";
import SuccessModal from '../SuccessModal/SuccessModal'
import styles from "./ReviewModal.module.css";
import AuthContext from "../../context/auth-context";

const ReviewModal = (props) => {
  const ctx = useContext(AuthContext);
  const modalRef = useRef(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const ratingHandler = (event) => {
    setRating(event.target.value);
  };

  const commentHandler = (event) => {
    setComment(event.target.value);
  };

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

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("customer_email", ctx.isLoggedIn.email);
    formData.append("flight_num", props.flightNum);
    formData.append("airline_name", props.airline);
    formData.append("rating", rating);
    formData.append("comment", comment)

    fetch("http://localhost:5000/rate_comment", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error reviewing");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.modal} ref={modalRef}>
      <form>
        <div>
          <div>
            <label>Rating</label>
            <select onChange={ratingHandler}>
              <option>5</option>
              <option>4</option>
              <option>3</option>
              <option>2</option>
              <option>1</option>
            </select>
          </div>
          <div>
            <label>Comment</label>
            <input type="text" onChange={commentHandler} />
          </div>
        </div>
        <button type="submit" onClick={submitHandler}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewModal;
