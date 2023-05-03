import { useState, useContext, useEffect } from "react";
import AuthContext from "../../../context/auth-context";

const PreviousFlights = () => {
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

    fetch("http://localhost:5000/user_prev_flights", {
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

  useEffect(() => {
    futureFlights();
  }, []);
};

export default PreviousFlights;
