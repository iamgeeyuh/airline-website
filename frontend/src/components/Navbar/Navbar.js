import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import AuthContext from "../../context/auth-context";

const Navbar = () => {
  const ctx = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const loginHandler = () => {
    ctx.modalHandler(true);
  };

  return (
    <ul className={styles.nav}>
      <li>
        <NavLink to="/">Sky Quest L'avion</NavLink>
      </li>
      <li>
        <button onClick={loginHandler}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </li>
    </ul>
  );
};

export default Navbar;
