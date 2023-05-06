import { useState, useContext, useEffect } from "react";
import Chart from "../../../components/Chart/Chart";
import styles from "./TrackSpending.module.css";
import AuthContext from "../../../context/auth-context";

const TrackSpending = () => {
  const ctx = useContext(AuthContext);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [totalSpending, setTotalSpending] = useState(0);
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
    formData.append("customer_email", ctx.isLoggedIn.email);

    const formValues = [start, end];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      return;
    }

    fetch("http://localhost:5000/track_spend", {
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
        console.log(data);
        setSpendingLst(data.months);
        setTotalSpending(data.spending);
        setComplete(true);
      })
      .catch((error) => {
        console.log(error);
      });

    setStart("");
    setEnd("");
  };

  const loadSpending = () => {
    const formData = new URLSearchParams();

    formData.append("customer_email", ctx.isLoggedIn.email);

    fetch("http://localhost:5000/default_spending", {
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
        console.log(data);
        setSpendingLst(data.months);
        setTotalSpending(data.spending);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => loadSpending(), []);

  return (
    <div>
      {isLoggedIn.isLoggedIn && isLoggedIn.isCustomer && (
        <div>
          <form className={styles.totalSpending}>
            <h4>View Spending in Range:</h4>
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
          <h3>Total Spending: ${totalSpending}</h3>
          <Chart dataPoints={spendingLst} />
        </div>
      )}
    </div>
  );
};

export default TrackSpending;
