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
      ctx.setLoginModal(true);
    } else {
      ctx.setIsLoggedIn("logout");
    }
  };

  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <NavLink className={styles.navTitle} to="/">
            Sky Quest L'avion
          </NavLink>
        </li>
        <li>
          <button onClick={loginHandler}>
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </li>
        {!isLoggedIn && (
          <li>
            <NavLink to="/CustomerRegistration" className={styles.links}>
              Register
            </NavLink>
          </li>
        )}
        {!isLoggedIn && (
          <li>
            <NavLink to="/StaffRegistration" className={styles.links}>
              Join the Team
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
