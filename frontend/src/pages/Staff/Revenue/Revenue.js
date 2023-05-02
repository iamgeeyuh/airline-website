import { useContext, useEffect, useState } from "react";
import RevenueChart from "../../../components/RevenueChart/RevenueChart";
import TotalTickets from "../../../components/TotalTickets/TotalTickets";
import styles from "./Revenue.module.css";
import AuthContext from "../../../context/auth-context";

const Revenue = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  return (
    <div className={styles.revenue}>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <>
          <h2>Revenue</h2>
          <h4>Last Year's Revenue:</h4>
          <h4>Last Month's Revenue:</h4>
          <RevenueChart />
          <TotalTickets />
        </>
      )}
    </div>
  );
};

export default Revenue;
