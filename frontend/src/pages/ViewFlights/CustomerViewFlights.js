import { useState } from "react";
import CustomerFlightSearch from "../../components/CustomerFlightSearch/CustomerFlightSearch";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";

const CustomerViewFlights = () => {
  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);

  const flightsHandler = (flightsLst) => {
    setFlights(flightsLst);
    setShowFlights(true);
  };

  return (
    <div>
      <CustomerFlightSearch />
      {showFlights && <FoundFlight flights={flights} />}
    </div>
  );
};

export default CustomerViewFlights;
