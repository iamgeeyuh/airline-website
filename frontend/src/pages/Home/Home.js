import { useState } from "react";
import HomeFlightSearch from "../../components/Flight/HomeFlightSearch/HomeFlightSearch";
import FlightStatus from "../../components/Flight/FlightStatus/FlightStatus";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";
import styles from "./Home.module.css";

const Home = () => {
  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);

  const flightsHandler = (flightsLst) => {
    setFlights(flightsLst);
    setShowFlights(true);
  };

  return (
    <div>
      <div className={styles.home}>
        <div className={styles.search}>
          <HomeFlightSearch flightsHandler={flightsHandler} />
        </div>
        <div className={styles.search}>
          <FlightStatus />
        </div>
      </div>
      {showFlights && <FoundFlight flights={flights} />}
    </div>
  );
};

export default Home;
