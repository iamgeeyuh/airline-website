import { useState, useContext } from "react";
import styles from "./Registration.module.css";
import AuthContext from "../../context/auth-context";

const StaffRegistration = () => {
  const ctx = useContext(AuthContext);

  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [dob, setDOB] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [airline, setAirline] = useState();
  const [valid, setValid] = useState(true);

  const airlineHandler = (event) => {
    setAirline(event.target.value);
  };

  const userHandler = (event) => {
    setUsername(event.target.value);
  };

  const fnameHandler = (event) => {
    setFname(event.target.value);
  };

  const lnameHandler = (event) => {
    setLname(event.target.value);
  };

  const dobHandler = (event) => {
    setDOB(event.target.value);
  };

  const emailHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const handleCurrentPhoneNumberChange = (event) => {
    setCurrentPhoneNumber(event.target.value);
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, currentPhoneNumber]);
    setCurrentPhoneNumber("");
  };

  const handleRemovePhoneNumber = (index) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers.splice(index, 1);
    setPhoneNumbers(newPhoneNumbers);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("date_of_birth", dob);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone_num", phoneNumbers);
    formData.append("isCustomer", false);
    formData.append("username", username);
    formData.append("airline_name", airline);
    fetch("http://localhost:5000/registerAuth", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error authenticating");
        }
      })
      .then((data) => {
        if (data.register) {
          ctx.setRegModal(true);
        } else {
          setValid(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.registrationContainer}>
      <form className={styles.registration}>
        <h2>Staff Application</h2>
        <div>
          <div>
            <label>Airline</label>
            <input
              type="text"
              placeholder="Jet Blue"
              onChange={airlineHandler}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              onChange={emailHandler}
            />
          </div>
        </div>
        <div>
          <div>
            <label>First Name</label>
            <input type="text" placeholder="John" onChange={fnameHandler} />
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" placeholder="Doe" onChange={lnameHandler} />
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="date" onChange={dobHandler} />
          </div>
        </div>
        <div>
          <div>
            <label>Username</label>
            <input type="text" onChange={userHandler} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" onChange={passwordHandler} />
          </div>
        </div>
        <div>
          <div>
            <label>Primary Phone </label>
            <input
              type="tel"
              placeholder="(555) 555-5555"
              value={currentPhoneNumber}
              onChange={handleCurrentPhoneNumberChange}
            />
            <div>
              <button type="button" onClick={handleAddPhoneNumber}>
                Add Phone Number
              </button>
            </div>
          </div>
        </div>

        {phoneNumbers.map((phoneNumber, index) => (
          <div key={index}>
            <label>Additional Phone </label>
            <input
              type="tel"
              value={phoneNumber}
              placeholder="(555) 555-5555"
              onChange={(e) => {
                const newPhoneNumbers = [...phoneNumbers];
                newPhoneNumbers[index] = e.target.value;
                setPhoneNumbers(newPhoneNumbers);
              }}
            />
            <div>
              <button
                type="button"
                onClick={() => handleRemovePhoneNumber(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {!valid && <p>Username has been taken.</p>}
        <button type="submit" onClick={submitHandler}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default StaffRegistration;
