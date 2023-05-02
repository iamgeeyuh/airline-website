import { useRef, useEffect } from "react";

import styles from "./PurchaseModal.module.css";

const PurchaseModal = (props) => {
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
      <div>
        <h2></h2>
        
      </div>
      <div>
        <button onClick={props.modalHandler}>Ok</button>
      </div>
    </div>
  );
};

export default PurchaseModal;
