import { useRef, useEffect } from "react";
import styles from "./ViewReviewModal.module.css";

const ViewReviewModal = (props) => {
  const modalRef = useRef(null);

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

  return <div className={styles.modal} ref={modalRef}>
    <form>
        <button>Submit</button>
    </form>
  </div>;
};

export default ViewReviewModal;
