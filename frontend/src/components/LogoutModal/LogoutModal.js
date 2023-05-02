import { useEffect, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LogoutModal.module.css";
import AuthContext from "../../context/auth-context";

const LogoutModal = () => {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    const clickOutsideHandler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        ctx.setIsLoggedIn({ type: "logout" });
        ctx.setLoginModal(false);
        navigate("/");
      }
    };
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [modalRef]);

  const logoutHandler = () => {
    ctx.setIsLoggedIn({ type: "logout" });
    ctx.setLoginModal(false);
    navigate("/");
  };

  return (
    <div className={styles.modal} ref={modalRef}>
      <h2>You've been logged out.</h2>
      <button onClick={logoutHandler}>Ok</button>
    </div>
  );
};

export default LogoutModal;
