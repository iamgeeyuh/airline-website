import { useState, useContext, useEffect } from "react";
import StaffFlightSearch from "../../components/StaffFlightSearch/StaffFlightSearch";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";
import AuthContext from "../../context/auth-context";

const StaffViewFlights = () => {
  const ctx = useContext(AuthContext);

  const [flights, setFlights] = useState([]);

  const flightsHandler = (flightsLst) => {
    setFlights(flightsLst);
  };

  const futureFlights = () => {
    const formData = new URLSearchParams();
    formData.append("airline_name", ctx.isLoggedIn.airline);

    fetch("http://localhost:5000/view_flights", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error logging in");
        }
      })
      .then((data) => {
        flightsHandler(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    futureFlights();
  }, []);

  return (
    <div>
      <StaffFlightSearch flightsHandler={flightsHandler}/>
      <FoundFlight flights={flights} page="staff"/>
    </div>
  );
};

export default StaffViewFlights;
