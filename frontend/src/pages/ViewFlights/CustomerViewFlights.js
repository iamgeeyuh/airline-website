import { useState, useContext } from "react";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";
import AuthContext from "../../context/auth-context";

const CustomerViewFlights = () => {
  const ctx = useContext(AuthContext);

  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);

  const flightsHandler = (flightsLst) => {
    setFlights(flightsLst);
    setShowFlights(true);
  };

  const futureFlights = () => {
    const formData = new URLSearchParams();
    formData.append("customer_email", ctx.isLoggedIn.email);

    fetch("http://localhost:5000/myflights", {
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
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  futureFlights();

  return <div></div>;
};

export default CustomerViewFlights;
