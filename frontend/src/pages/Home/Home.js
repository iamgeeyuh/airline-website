import { useState, useContext, useEffect } from "react";
import HomeFlightSearch from "../../components/Flight/HomeFlightSearch/HomeFlightSearch";
import FlightStatus from "../../components/Flight/FlightStatus/FlightStatus";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";
import styles from "./Home.module.css";
import AuthContext from "../../context/auth-context";

const Home = () => {
  const ctx = useContext(AuthContext);

  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  const flightsHandler = (flightsLst) => {
    setFlights(flightsLst);
    setShowFlights(true);
  };

  return (
    <div>
      {isLoggedIn.isLoggedIn && (
        <h1 style={{ textAlign: "center" }}>Welcome, {isLoggedIn.name}</h1>
      )}
      <div className={styles.home}>
        <div className={styles.search}>
          <HomeFlightSearch flightsHandler={flightsHandler} />
        </div>
        <div className={styles.search}>
          <FlightStatus />
        </div>
      </div>
      {showFlights && (
        <FoundFlight
          flights={flights}
          page={isLoggedIn.isLoggedIn && isLoggedIn.isCustomer && "purchase"}
        />
      )}
    </div>
  );
};

export default Home;
