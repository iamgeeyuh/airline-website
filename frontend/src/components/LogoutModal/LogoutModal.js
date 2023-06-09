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
        logoutHandler();
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
    logout();
    navigate("/");
  };

  const logout = () => {
    fetch("http://localhost:5000/logout", {
      method: "GET",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error logging in");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.modal} ref={modalRef}>
      <h2>You've been logged out.</h2>
      <button onClick={logoutHandler}>Ok</button>
    </div>
  );
};

export default LogoutModal;
