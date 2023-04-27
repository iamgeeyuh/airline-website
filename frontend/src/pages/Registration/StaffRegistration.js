import { useState, useContext } from "react";
import styles from "./Registration.module.css";
import AuthContext from "../../context/auth-context";

const StaffRegistration = () => {
  const ctx = useContext(AuthContext);

  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  const [emails, setEmails] = useState([]);
  const [currentEmails, setCurrentEmails] = useState("");

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDOB] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [airline, setAirline] = useState("");
  const [valid, setValid] = useState(true);
  const [complete, setComplete] = useState(true);

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

  const handleCurrentEmailsChange = (event) => {
    setCurrentEmails(event.target.value);
  };

  const handleAddEmails = () => {
    setEmails([...emails, currentEmails]);
    setCurrentEmails("");
  };

  const handleRemoveEmails = (index) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    const newPhoneNumbers = [...phoneNumbers, currentPhoneNumber];
    const newEmails = [...emails, currentEmails];
    const phoneLength = newPhoneNumbers.length;
    const emailLength = newEmails.length;

    formData.append("num_of_emails", emailLength);
    formData.append("num_of_phones", phoneLength);
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("date_of_birth", dob);
    for (let i = 0; i < newEmails.length; i++) {
      formData.append(`email[${i}]`, newEmails[i]);
    }
    formData.append("password", password);
    for (let i = 0; i < newPhoneNumbers.length; i++) {
      formData.append(`phone_num[${i}]`, newPhoneNumbers[i]);
      console.log(newPhoneNumbers[i]);
    }
    formData.append("isCustomer", false);
    formData.append("username", username);
    formData.append("airline_name", airline);
    const formValues = [
      fname,
      lname,
      dob,
      ...newEmails,
      username,
      password,
      airline,
      ...newPhoneNumbers,
    ];
    const isEmpty = formValues.some((value) => value.trim() === "");
    if (isEmpty) {
      setComplete(false);
      setValid(true);
      return;
    }
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
        }
        setValid(data.register);
        setComplete(true);
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
            <label>Primary Email</label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              value={currentEmails}
              onChange={handleCurrentEmailsChange}
            />
            <div>
              <button type="button" onClick={handleAddEmails}>
                Add Email
              </button>
            </div>
          </div>
        </div>

        {emails.map((email, index) => (
          <div key={index}>
            <label>Additional Email </label>
            <input
              type="email"
              value={email}
              placeholder="johndoe@gmail.com"
              onChange={(e) => {
                const newEmails = [...emails];
                newEmails[index] = e.target.value;
                setEmails(newEmails);
              }}
            />
            <div>
              <button type="button" onClick={() => handleRemoveEmails(index)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <div>
          <div>
            <label>Primary Phone </label>
            <input
              type="tel"
              placeholder="5555555555"
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
        {!complete && <p>Missing fields.</p>}
        <button type="submit" onClick={submitHandler}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default StaffRegistration;
