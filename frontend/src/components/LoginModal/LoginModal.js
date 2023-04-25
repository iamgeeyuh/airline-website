import { useEffect, useRef, useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import styles from "./LoginModal.module.css";

const LoginModal = () => {
  const ctx = useContext(AuthContext);
  const modalRef = useRef(null);
  const [isCustomer, setIsCustomer] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (ctx.isLoggedIn.isLoggedIn) {
      navigate("/");
    }
  }, [ctx.isLoggedIn]);

  useEffect(() => {
    const clickOutsideHandler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        ctx.setModal(false);
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
    setValid(true);
  };

  const userHandler = (event) => {
    setUsername(event.target.value);
  };

  const passHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("isCustomer", isCustomer);
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error logging in");
        }
      })
      .then((data) => {
        if (data.user) {
          ctx.setIsLoggedIn(isCustomer ? "customer" : "staff");
          ctx.setModal(false);
        } else {
          setValid(data.user);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setUsername("");
    setPassword("");
  };

  const navHandler = () => {
    console.log("hi");
    ctx.setModal(false);
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
        <h2>{isCustomer ? "Customer" : "Staff"} Login</h2>
        <input
          placeholder={isCustomer ? "E-Mail" : "Username"}
          value={username}
          onChange={userHandler}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={passHandler}
        />
        {!valid && <p>Incorrect login information.</p>}
        <button type="submit">Sign In</button>
        <div>
          {isCustomer ? (
            <NavLink to="/CustomerRegistration" onClick={navHandler}>
              Create an account
            </NavLink>
          ) : (
            <NavLink to="/StaffRegistration" onClick={navHandler}>
              Join the team
            </NavLink>
          )}
        </div>
      </div>
    </form>
  );
};

export default LoginModal;
