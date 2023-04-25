const CustomerRegistration = () => {
  return (
    <form>
      <fieldset>
        <legend>Personal Information</legend>
        <div>
          <label htmlFor="first-name">First Name:</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            required
            placeholder="John"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="last-name">Last Name:</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            required
            placeholder="Doe"
            autoComplete="family-name"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="john.doe@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="new-password"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Address Information</legend>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            required
            placeholder="123 Main St"
            autoComplete="street-address"
          />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            required
            placeholder="Anytown"
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            required
            placeholder="CA"
            autoComplete="address-level1"
          />
        </div>
        <div>
          <label htmlFor="zip">Zip Code:</label>
          <input
            type="text"
            id="zip"
            name="zip"
            required
            placeholder="12345"
            autoComplete="postal-code"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Identification Information</legend>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="(555) 555-5555"
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="passport">Passport Number:</label>
          <input
            type="text"
            id="passport"
            name="passport"
            required
            placeholder="123456789"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="expiration-date">Passport Expiration Date:</label>
          <input
            type="date"
            id="expiration-date"
            name="expiration-date"
            required
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="country">Passport Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            required
            placeholder="USA"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" name="dob" required autoComplete="off" />
        </div>
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
};

export default CustomerRegistration;
