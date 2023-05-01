import { useContext, useEffect, useState } from "react";
import FoundFlight from "../../../components/Flight/FoundFlight/FoundFlight";
import styles from "./ViewCustomers.module.css";
import AuthContext from "../../../context/auth-context";

const ViewCustomers = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);

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
    if (email == "") {
      setComplete(false);
      setValid(true);
      return;
    }
  };

  return (
    <div>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <>
          <div className={styles.viewCustomers}>
            <div className={styles.topCustomer}>
              <h2>Top Customer: </h2>
              <p>John Doe</p>
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
                {!valid && <p>Customer does not exist.</p>}
                {!complete && <p>Missing fields.</p>}
              </div>
            </form>
          </div>
          <div>
            <FoundFlight />
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCustomers;
