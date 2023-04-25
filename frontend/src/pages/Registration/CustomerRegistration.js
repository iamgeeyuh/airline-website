import { useState } from "react";
import styles from "./Registration.module.css";

const CustomerRegistration = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [dob, setDOB] = useState();
  const [address, setAddress] = useState();
  const [apt, setApt] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [zip, setZip] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passNum, setPassNum] = useState();
  const [passExp, setPassExp] = useState();
  const [passCountry, setPassCountry] = useState();

  const fnameHandler = (event) => {
    setFname(event.target.value);
  };

  const lnameHandler = (event) => {
    setLname(event.target.value);
  };

  const dobHandler = (event) => {
    setDOB(event.target.value);
  };

  const addressHandler = (event) => {
    setAddress(event.target.value);
  };

  const aptHandler = (event) => {
    setApt(event.target.value);
  };

  const cityHandler = (event) => {
    setCity(event.target.value);
  };

  const stateHandler = (event) => {
    setState(event.target.value);
  };

  const zipHandler = (event) => {
    setZip(event.target.value);
  };

  const emailHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const passNumHandler = (event) => {
    setPassNum(event.target.value);
  };

  const passExpHandler = (event) => {
    setPassExp(event.target.value);
  };

  const passCountryHandler = (event) => {
    setPassCountry(event.target.value);
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
    
  };

  return (
    <div className={styles.registrationContainer}>
      <form className={styles.registration}>
        <h2>Customer Registration</h2>
        <div>
          <div>
            <label>First Name </label>
            <input type="text" placeholder="John" onChange={lnameHandler} />
          </div>
          <div>
            <label>Last Name </label>
            <input type="text" placeholder="Doe" onChange={fnameHandler} />
          </div>
          <div>
            <label>Date of Birth </label>
            <input type="date" />
          </div>
        </div>
        <div>
          <div>
            <label>Address </label>
            <input
              type="text"
              placeholder="123 Main St"
              onChange={addressHandler}
            />
          </div>
          <div>
            <label>Apartment</label>
            <input type="text" placeholder="3A" onChange={aptHandler} />
          </div>
        </div>
        <div>
          <div>
            <label>City </label>
            <input type="text" placeholder="Anytown" onChange={cityHandler} />
          </div>
          <div>
            <label>State </label>
            <input type="text" placeholder="CA" onChange={stateHandler} />
          </div>
          <div>
            <label>Zip Code </label>
            <input type="text" placeholder="12345" onChange={zipHandler} />
          </div>
        </div>
        <div>
          <div>
            <label>Email </label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              onChange={emailHandler}
            />
          </div>
          <div>
            <label>Password </label>
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

        <div>
          <div>
            <label>Passport Number </label>
            <input
              type="text"
              placeholder="123456789"
              onChange={passNumHandler}
            />
          </div>
          <div>
            <label>Passport Expiration Date </label>
            <input type="date" onChange={passExpHandler} />
          </div>
          <div>
            <label>Passport Country </label>
            <input
              type="text"
              placeholder="USA"
              onChange={passCountryHandler}
            />
          </div>
        </div>
        <button type="submit" onClick={submitHandler}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CustomerRegistration;
