import { useState } from "react";
import styles from "./Registration.module.css";

const CustomerRegistration = () => {
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
        <h2>Customer Registration</h2>
        <div>
          <div>
            <label>First Name </label>
            <input type="text" placeholder="John" />
          </div>
          <div>
            <label>Last Name </label>
            <input type="text" placeholder="Doe" />
          </div>
          <div>
            <label>Date of Birth </label>
            <input type="date" />
          </div>
        </div>
        <div>
          <div>
            <label>Address </label>
            <input type="text" placeholder="123 Main St" />
          </div>
          <div>
            <label>Apartment</label>
            <input type="text" placeholder="3A" />
          </div>
        </div>
        <div>
          <div>
            <label>City </label>
            <input type="text" placeholder="Anytown" />
          </div>
          <div>
            <label>State </label>
            <input type="text" placeholder="CA" />
          </div>
          <div>
            <label>Zip Code </label>
            <input type="text" placeholder="12345" />
          </div>
        </div>
        <div>
          <div>
            <label>Email </label>
            <input type="email" placeholder="john.doe@example.com" />
          </div>
          <div>
            <label>Password </label>
            <input type="password" />
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
            <input type="text" placeholder="123456789" />
          </div>
          <div>
            <label>Passport Expiration Date </label>
            <input type="date" />
          </div>
          <div>
            <label>Passport Country </label>
            <input type="text" placeholder="USA" />
          </div>
        </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CustomerRegistration;
