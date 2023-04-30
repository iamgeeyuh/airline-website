import { useContext, useEffect, useState } from "react";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const AddAirport = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [airportCode, setAirportCode] = useState("");
  const [airportName, setAirportName] = useState("");
  const [airportType, setAirportType] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);

  const airportCodeHandler = (event) => {
    setAirportCode(event.target.value);
  };

  const airportNameHandler = (event) => {
    setAirportName(event.target.value);
  };

  const airportTypeHandler = (event) => {
    setAirportType(event.target.value);
  };

  const cityHandler = (event) => {
    setCity(event.target.value);
  };

  const countryHandler = (event) => {
    setCountry(event.target.value);
  };

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const submitHandler = (event) => {
    event.preventDefault(event.target.value);
    const formData = new URLSearchParams();

    formData.append("airport_code", airportCode);
    formData.append("airport_name", airportName);
    formData.append("airport_type", airportType);
    formData.append("city", city);
    formData.append("country", country);

    const formValues = [airportCode, airportName, airportType, city, country];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }
  };

  return (
    <div className={styles.staffFormContainer}>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <form className={styles.staffForm}>
          <h2>Add Airport</h2>
          <div>
            <div>
              <label>Airport Code</label>
              <input type="text" onChange={airportCodeHandler} />
            </div>
            <div>
              <label>Airport Name</label>
              <input type="text" onChange={airportNameHandler} />
            </div>
            <div>
              <label>Airport Type</label>
              <input
                type="text"
                placeholder="domestic"
                onChange={airportTypeHandler}
              />
            </div>
          </div>
          <div>
            <div>
              <label>City</label>
              <input
                type="text"
                placeholder="New York City"
                onChange={cityHandler}
              />
            </div>
            <div>
              <label>Country</label>
              <input type="text" placeholder="USA" onChange={countryHandler} />
            </div>
          </div>
          {!valid && <p>Airport already exists.</p>}
          {!complete && <p>Missing fields.</p>}
          <button type="submit" onClick={submitHandler}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default AddAirport;
