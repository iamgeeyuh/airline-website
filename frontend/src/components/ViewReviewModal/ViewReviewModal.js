import { useRef, useEffect, useContext, useState } from "react";
import Ratings from "../Flight/Ratings/Ratings";
import styles from "./ViewReviewModal.module.css";
import AuthContext from "../../context/auth-context";

const ViewReviewModal = (props) => {
  const ctx = useContext(AuthContext);
  const modalRef = useRef(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

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

  const viewReview = () => {
    const formData = new URLSearchParams();
    formData.append("customer_email", ctx.isLoggedIn.email);
    formData.append("ticket_id", props.ticket_id);

    fetch("http://localhost:5000/view_rate_comment", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error viewing review");
        }
      })
      .then((data) => {
        console.log(data)
        setRating(data.rating);
        setComment(data.comment);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => viewReview(), []);

  return (
    <div className={styles.modal} ref={modalRef}>
      {rating == null && comment == null && <p>No reviews</p>}
      <Ratings rating={rating} review={comment} />
      <button onClick={props.modalHandler}>Ok</button>
    </div>
  );
};

export default ViewReviewModal;
