import { useState, useContext, useEffect } from "react";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";
import AuthContext from "../../context/auth-context";

const CustomerViewFlights = () => {
  const ctx = useContext(AuthContext);

  const [flights, setFlights] = useState([]);

  const futureFlights = () => {
    const formData = new URLSearchParams();
    formData.append("customer_email", ctx.isLoggedIn.email);

    fetch("http://localhost:5000/future_flights", {
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
        setFlights(data);
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
      <FoundFlight flights={flights} page="cancel" />
    </div>
  );
};

export default CustomerViewFlights;
