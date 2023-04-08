import { useEffect, useRef, useContext } from "react";
import AuthContext from "../../../context/auth-context";
import styles from "./LoginModal.module.css";

const LoginModal = () => {
  const ctx = useContext(AuthContext);
  const modalRef = useRef(null);

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

  return (
    <form className={styles.modal} ref={modalRef}>
      Sign In
    </form>
  );
};

export default LoginModal;
