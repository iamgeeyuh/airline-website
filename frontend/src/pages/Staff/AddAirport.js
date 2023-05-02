import { useContext, useEffect, useState } from "react";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import styles from "./StaffForm.module.css";
import AuthContext from "../../context/auth-context";

const AddAirport = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [airportCode, setAirportCode] = useState("");
  const [airportName, setAirportName] = useState("");
  const [airportType, setAirportType] = useState("international");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);
  const [modal, setModal] = useState(false);

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

  const modalHandler = () => {
    setModal(false);
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

    const formValues = [airportCode, airportName, city, country];

    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      setModal(false);
      return;
    }

    fetch("http://localhost:5000/add_airport", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error creating flight");
        }
      })
      .then((data) => {
        setModal(data.add_airport);
        setValid(data.add_airport);
        setComplete(true);
      })
      .catch((error) => {
        console.log(error);
      });
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
              <select onChange={airportTypeHandler}>
                <option>international</option>
                <option>domestic</option>
                <option>both</option>
              </select>
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
      {modal && <SuccessModal modalHandler={modalHandler} message="Airport has been added!" />}
      {modal && <div className={styles.dimmedBackground}></div>}
    </div>
  );
};

export default AddAirport;
