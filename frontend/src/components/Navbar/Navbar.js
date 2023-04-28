import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import LogoutModal from "../LogoutModal/LogoutModal";
import styles from "./Navbar.module.css";
import AuthContext from "../../context/auth-context";

const Navbar = () => {
  const ctx = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const loginHandler = () => {
    ctx.setLoginModal(true);
  };

  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <h2>Sky Quest L'avion</h2>
        </li>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Home
          </NavLink>
        </li>
        {isLoggedIn.isLoggedIn && (
          <li>
            <NavLink
              to="/ViewFlights"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              View Flights
            </NavLink>
          </li>
        )}
        {isLoggedIn.isLoggedIn &&
          (isLoggedIn.isCustomer ? (
            <li></li>
          ) : (
            <>
              <li>
                <NavLink
                  to="/CreateFlight"
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Create Flight{" "}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ChangeFlightStatus"
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Change Flight Status
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/AddPlane"
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Add Plane
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/AddAirport"
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  Add Airport
                </NavLink>
              </li>
            </>
          ))}
        {!isLoggedIn.isLoggedIn && (
          <li>
            <NavLink
              to="/CustomerRegistration"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              Register
            </NavLink>
          </li>
        )}
        {!isLoggedIn.isLoggedIn && (
          <li>
            <NavLink
              to="/StaffRegistration"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              Join the Team
            </NavLink>
          </li>
        )}
        <li>
          <button onClick={loginHandler}>
            {isLoggedIn.isLoggedIn ? "Logout" : "Login"}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
