import { useRef, useEffect } from "react";
import styles from "./AddPlaneModal.module.css";

const AddPlaneModal = (props) => {
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
      <h2>Plane added!</h2>
      {props.planes.map((plane) => (
        <div>
          <p>{plane.airplane_id}</p>
          <p>{plane.manufacturer}</p>
          <p>{plane.manufacturing_date}</p>
        </div>
      ))}
      <button onClick={props.modalHandler}>Ok</button>
    </div>
  );
};

export default AddPlaneModal;
