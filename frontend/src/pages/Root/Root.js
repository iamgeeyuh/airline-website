import { Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Root.module.css";
import LoginModal from "../../components/LoginModal/LoginModal";
import RegistrationModal from "../../components/RegistrationModal/RegistrationModal";
import AuthContext from "../../context/auth-context";

const Root = () => {
  const ctx = useContext(AuthContext);

  const [loginModal, setLoginModal] = useState(ctx.loginModal);
  const [regModal, setRegModal] = useState(ctx.regModal);

  useEffect(() => {
    setLoginModal(ctx.loginModal);
  }, [ctx.loginModal]);

  useEffect(() => {
    setRegModal(ctx.regModal);
  }, [ctx.regModal]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.scrollContainer}>
        <Outlet />
        {loginModal && <LoginModal />}
        {loginModal && <div className={styles.dimmedBackground} />}
        {regModal && <RegistrationModal />}
        {regModal && <div className={styles.dimmedBackground} />}
      </div>
    </div>
  );
};

export default Root;
