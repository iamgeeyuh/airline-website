import { useState } from "react";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";

const CustomerViewFlights = () => {
  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);

  const flightsHandler = (flightsLst) => {
    setFlights(flightsLst);
    setShowFlights(true);
  };

  const futureFlights = () => {
    fetch("http://localhost:5000/myflights", {
      method: "GET",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

  futureFlights()

  return <div></div>;
};

export default CustomerViewFlights;
