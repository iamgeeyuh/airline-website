const StaffRegistration = () => {
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
          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" name="dob" required autoComplete="off" />
        </div>
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
};

export default StaffRegistration;
