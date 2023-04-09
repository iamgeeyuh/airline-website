import { useEffect, useRef, useContext, useState } from "react";
import AuthContext from "../../../context/auth-context";
import styles from "./LoginModal.module.css";

const LoginModal = () => {
  const ctx = useContext(AuthContext);
  const modalRef = useRef(null);
  const [isCustomer, setIsCustomer] = useState(true);

  useEffect(() => {
    const clickOutsideHandler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        ctx.modalHandler(false);
      }
    };
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [modalRef]);

  const isCustomerHandler = (event) => {
    event.stopPropagation();
    setIsCustomer(event.target.value === "customer");
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={submitHandler} className={styles.modal} ref={modalRef}>
      <div className={styles.type}>
        <button
          className={isCustomer ? styles.selected : styles.notSelected}
          type="button"
          value="customer"
          onClick={isCustomerHandler}
        >
          Customer
        </button>
        <button
          className={isCustomer ? styles.notSelected : styles.selected}
          type="button"
          value="staff"
          onClick={isCustomerHandler}
        >
          Staff
        </button>
      </div>
      <div className={styles.form}>
        <h2>Login</h2>
        <input placeholder={isCustomer ? "E-Mail" : "Username"} />
        <input placeholder="Password" />
        <button type="submit">Sign In</button>
      </div>
    </form>
  );
};

export default LoginModal;
