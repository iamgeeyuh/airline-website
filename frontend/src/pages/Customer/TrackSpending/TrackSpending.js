import { useState, useContext, useEffect } from "react";
import Chart from "../../../components/Chart/Chart";
import styles from "./TrackSpending.module.css";
import AuthContext from "../../../context/auth-context";

const TrackSpending = () => {
  const ctx = useContext(AuthContext);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [totalSpending, setTotalSpending] = useState(0);
  const [showChart, setShowChart] = useState(false);
  const [complete, setComplete] = useState(true);
  const [spendingLst, setSpendingLst] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  const startHandler = (event) => {
    setStart(event.target.value);
  };

  const endHandler = (event) => {
    setEnd(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("start", start);
    formData.append("end", end);
    formData.append("airline_name", ctx.isLoggedIn.airline);

    const formValues = [start, end];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      return;
    }

    fetch("http://localhost:5000/total_tickets", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error loading chart");
        }
      })
      .then((data) => {
        setSpendingLst(data.months);
        setTotalSpending(data.tickets);
        setComplete(true);
        setShowChart(true);
      })
      .catch((error) => {
        console.log(error);
      });

    setStart("");
    setEnd("");

    return (
      <div>
        {isLoggedIn.isLoggedIn && isLoggedIn.isCustomer && (
          <div>
            <form className={styles.totalTickets}>
              <h4>View Sales in Range:</h4>
              <div>
                <div>
                  <label>Start Date</label>
                  <input type="date" value={start} onChange={startHandler} />
                </div>
                <div>
                  <label>End Date</label>
                  <input type="date" value={end} onChange={endHandler} />
                </div>
                <div>
                  <button type="submit" onClick={submitHandler}>
                    Submit
                  </button>
                </div>
              </div>
              {!complete && <p>Missing fields.</p>}
            </form>
            {showChart && <h3>Total Tickets: {totalSpending}</h3>}
            {showChart && <Chart dataPoints={spendingLst} />}
          </div>
        )}
      </div>
    );
  };
};

export default TrackSpending;
