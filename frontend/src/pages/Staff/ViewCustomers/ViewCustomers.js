import { useContext, useEffect, useState } from "react";
import FoundFlight from "../../../components/Flight/FoundFlight/FoundFlight";
import styles from "./ViewCustomers.module.css";
import AuthContext from "../../../context/auth-context";

const ViewCustomers = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [email, setEmail] = useState("");
  const [topCustomer, setTopCustomer] = useState("");
  const [complete, setComplete] = useState(true);
  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const emailHandler = (event) => {
    setEmail(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();

    formData.append("email", email);
    if (email === "") {
      setComplete(false);
      return;
    }

    fetch("http://localhost:5000/view_customer", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error loading flights");
        }
      })
      .then((data) => {
        setFlights(data);
        setShowFlights(true);
        setComplete(true);
      })
      .catch((error) => {
        console.log(error);
      });

    setEmail("");
  };

  const loadTopCustomer = () => {
    const formData = new URLSearchParams();
    formData.append("airline_name", ctx.isLoggedIn.airline);

    fetch("http://localhost:5000/view_frequent_customers", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error loading top customer");
        }
      })
      .then((data) => {
        setTopCustomer(data.fname + " " + data.lname);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadTopCustomer();
  }, []);

  return (
    <div>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <>
          <div className={styles.viewCustomers}>
            <div className={styles.topCustomer}>
              <h2>Top Customer: </h2>
              <p>{topCustomer}</p>
            </div>

            <form>
              <h2>View Customers</h2>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={emailHandler}
                placeholder="johndoe@gmail.com"
              />
              <button type="submit" onClick={submitHandler}>
                Submit
              </button>
              <div className={styles.error}>
                {!complete && <p>Missing fields.</p>}
              </div>
            </form>
          </div>
          <div>
            {showFlights && <FoundFlight flights={flights} page="staff" />}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCustomers;
