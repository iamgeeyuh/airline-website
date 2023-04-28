import { useContext, useEffect, useState } from "react";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const AddAirport = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  return (
    <div className={styles.staffFormContainer}>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <form className={styles.staffForm}>
          <h2>Add Airport</h2>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default AddAirport;
