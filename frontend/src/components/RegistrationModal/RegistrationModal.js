import { NavLink } from "react-router-dom";
import { useContext } from "react";
import styles from "./RegistrationModal.module.css";
import AuthContext from "../../context/auth-context";

const RegistrationModal = () => {
  const ctx = useContext(AuthContext);

  return (
    <div className={styles.registrationModal}>
      <h2>Congratulations! Your account has been registered.</h2>
      <NavLink to="/" onClick={() => ctx.setRegModal(false)}>
        Home
      </NavLink>
    </div>
  );
};

export default RegistrationModal;
