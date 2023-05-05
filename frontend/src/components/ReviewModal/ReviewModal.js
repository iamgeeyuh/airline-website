import { useRef, useEffect } from "react";
import styles from "./ReviewModal.module.css";

const ReviewModal = (props) => {
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
      <form>
        <div>
          <div>
            <label>Rating</label>
            <select>
              <option>5</option>
              <option>4</option>
              <option>3</option>
              <option>2</option>
              <option>1</option>
            </select>
          </div>
          <div>
            <label>Comment</label>
            <input type="text" />
          </div>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default ReviewModal;
