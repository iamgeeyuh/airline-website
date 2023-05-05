import { useContext, useEffect, useState } from "react";
import TotalTickets from "../../../components/TotalTickets/TotalTickets";
import styles from "./Revenue.module.css";
import AuthContext from "../../../context/auth-context";

const Revenue = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [lastYear, setLastYear] = useState("0");
  const [lastMonth, setLastMonth] = useState("0");

  const yearHandler = (value) => {
    if (value != null) {
      setLastYear(value);
    } else {
      setLastYear("0");
    }
  };

  const monthHandler = (value) => {
    if (value != null) {
      setLastMonth(value);
    } else {
      setLastMonth("0");
    }
  };

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const loadRevenue = () => {
    const formData = new URLSearchParams();
    formData.append("airline_name", ctx.isLoggedIn.airline);

    fetch("http://localhost:5000/revenue", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error loading revenue");
        }
      })
      .then((data) => {
        monthHandler(data.month);
        yearHandler(data.year);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => loadRevenue(), []);

  return (
    <div className={styles.revenue}>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <>
          <h2>Revenue</h2>
          <h4>Last Year's Revenue: ${lastYear}</h4>
          <h4>Last Month's Revenue: ${lastMonth}</h4>
          <TotalTickets />
        </>
      )}
    </div>
  );
};

export default Revenue;
