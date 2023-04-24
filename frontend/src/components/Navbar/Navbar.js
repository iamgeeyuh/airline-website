import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import AuthContext from "../../context/auth-context";

const Navbar = () => {
  const ctx = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const loginHandler = () => {
    if (!isLoggedIn) {
      ctx.setModal(true);
    } else {
      ctx.setIsLoggedIn("logout");
    }
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
