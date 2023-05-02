import { useState } from "react";
import Chart from "../Chart/Chart";
import styles from "./RevenueChart.module.css";

const RevenueChart = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [ticketsSold, setTicketsSold] = useState([
    { label: "Jan", tickets: 0 },
    { label: "Feb", tickets: 10 },
    { label: "Mar", tickets: 0 },
    { label: "Apr", tickets: 0 },
    { label: "May", tickets: 1 },
    { label: "Jun", tickets: 4 },
    { label: "Jul", tickets: 0 },
    { label: "Aug", tickets: 5 },
    { label: "Sep", tickets: 0 },
    { label: "Oct", tickets: 3 },
    { label: "Nov", tickets: 0 },
    { label: "Dec", tickets: 12 },
  ]);
  const [year, setYear] = useState(currentYear);
  const [complete, setComplete] = useState(true);

  const yearHandler = (event) => {
    setYear(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    if (year === "") {
      setComplete(false);
      return;
    }
  };

  return (
    <div className={styles.revenueChartContainer}>
      <form className={styles.revenueChart}>
        <div>
          <label>Year</label>
          <input type="number" value={year} onChange={yearHandler} />
        </div>
        <div>
          <button onClick={submitHandler} type="submit">
            Submit
          </button>
        </div>
      </form>
      {!complete && <p className={styles.error}>Missing fields.</p>}
      <Chart dataPoints={ticketsSold} />
    </div>
  );
};

export default RevenueChart;
