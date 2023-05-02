import { useState } from "react";
import StaffFlightSearch from "../../components/StaffFlightSearch/StaffFlightSearch";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";

const StaffViewFlights = () => {
  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);

  const flightsHandler = (flightsLst) => {
    setFlights(flightsLst);
    setShowFlights(true);
  };

  return (
    <div>
      <StaffFlightSearch />
      {showFlights && <FoundFlight flights={flights} />}
    </div>
  );
};

export default StaffViewFlights;
