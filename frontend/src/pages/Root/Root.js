import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Root.module.css";

const Root = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.scrollContainer}>
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
