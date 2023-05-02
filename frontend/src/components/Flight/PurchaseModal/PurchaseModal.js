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
      <form className={styles.purchaseModal}>
        <h2>Purchase Ticket</h2>
        <div>
          <div>
            <label>First Name</label>
            <input type="text" placeholder="John"/>
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" placeholder="Doe"/>
          </div>
        </div>
        <div>
          <div>
            <label>Email</label>
            <input type="email" placeholder="johndoe@gmail.com"/>
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="date" />
          </div>
        </div>
        <div>
          <div>
            <label>Card Type</label>
            <select>
              <option>credit</option>
              <option>debit</option>
            </select>
          </div>
          <div>
            <label>Name on Card</label>
            <input type="text" placeholder="John Doe"/>
          </div>
        </div>
        <div>
          <div>
            <label>Card Number</label>
            <input type="number" placeholder="0000000000000000"/>
          </div>
          <div>
            <label>Expiration Date</label>
            <input type="month" />
          </div>
        </div>
        <button type="submit">Ok</button>
      </form>
    </div>
  );
};

export default PurchaseModal;
