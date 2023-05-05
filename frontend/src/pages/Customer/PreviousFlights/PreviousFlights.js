import { useState, useContext, useEffect } from "react";
import FoundFlight from "../../../components/Flight/FoundFlight/FoundFlight";
import AuthContext from "../../../context/auth-context";

const PreviousFlights = () => {
  const ctx = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const prevFlights = () => {
    const formData = new URLSearchParams();
    formData.append("customer_email", ctx.isLoggedIn.email);

    fetch("http://localhost:5000/prev_flights", { 
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error loading flights");
        }
      })
      .then((data) => {
        setFlights(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    prevFlights()
  }, []);

  return (
    <div>
      {isLoggedIn.isLoggedIn && isLoggedIn.isCustomer && (
        <FoundFlight flights={flights} page="review" />
      )}
    </div>
  );
};

export default PreviousFlights;
