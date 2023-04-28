import { Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Root.module.css";
import LoginModal from "../../components/LoginModal/LoginModal";
import LogoutModal from "../../components/LogoutModal/LogoutModal";
import RegistrationModal from "../../components/RegistrationModal/RegistrationModal";
import AuthContext from "../../context/auth-context";

const Root = () => {
  const ctx = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn.isLoggedIn);
  const [loginModal, setLoginModal] = useState(ctx.loginModal);
  const [regModal, setRegModal] = useState(ctx.regModal);

  useEffect(() => {
    setLoginModal(ctx.loginModal);
  }, [ctx.loginModal]);

  useEffect(() => {
    setRegModal(ctx.regModal);
  }, [ctx.regModal]);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn.isLoggedIn);
  }, [ctx.isLoggedIn.isLoggedIn]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.scrollContainer}>
        <Outlet />
        {loginModal && (isLoggedIn ? <LogoutModal /> : <LoginModal />)}
        {loginModal && <div className={styles.dimmedBackground} />}
        {regModal && <RegistrationModal />}
        {regModal && <div className={styles.dimmedBackground} />}
      </div>
    </div>
  );
};

export default Root;
