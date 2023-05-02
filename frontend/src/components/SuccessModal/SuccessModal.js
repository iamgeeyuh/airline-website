import { useRef, useEffect } from "react";
import styles from "./SuccessModal.module.css";

const SuccessModal = (props) => {
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

  return (
    <div className={styles.modal} ref={modalRef}>
      <h2>{props.message}</h2>
      <button onClick={props.modalHandler}>Ok</button>
    </div>
  );
};

export default SuccessModal;
