import { useState } from "react";
import styles from "./Registration.module.css";

const StaffRegistration = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState("");

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

  return (
    <div className={styles.registrationContainer}>
      <form className={styles.registration}>
        <h2>Staff Registration</h2>
        <div>
          <div>
            <label>First Name:</label>
            <input type="text" required placeholder="John" />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" requried placeholder="Doe" />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input type="date" required />
          </div>
        </div>
        <div>
          <div>
            <label>Email:</label>
            <input type="email" requried placeholder="john.doe@example.com" />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" requried />
          </div>
        </div>
        <div>
          <div>
            <label>Primary Phone </label>
            <input
              type="tel"
              placeholder="(555) 555-5555"
              value={currentPhoneNumber}
              requried
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StaffRegistration;
