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

  return (
    <ul className={styles.nav}>
      <li>
        <NavLink to="/">Sky Quest L'avion</NavLink>
      </li>
      {isLoggedIn ? (
        <li>
          <button>Log Out</button>
        </li>
      ) : (
        <li>
          <button>Log In</button>
        </li>
      )}
    </ul>
  );
};

export default Navbar;
