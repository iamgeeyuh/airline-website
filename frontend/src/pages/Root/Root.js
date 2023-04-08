import { Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Root.module.css";
import LoginModal from "../../components/Authentication/LoginModal/LoginModal";
import AuthContext from "../../context/auth-context";

const Root = () => {
  const ctx = useContext(AuthContext);

  const [modal, setModal] = useState(ctx.modal);

  useEffect(() => {
    setModal(ctx.modal);
  }, [ctx.modal]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.scrollContainer}>
        <Outlet />
        {modal && <LoginModal />}
        {modal && <div className={styles.dimmedBackground} />}
      </div>
    </div>
  );
};

export default Root;
