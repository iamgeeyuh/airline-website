import HomeFlightSearch from "../../../components/Flight/HomeFlightSearch/HomeFlightSearch";
import FlightStatus from "../../../components/Flight/FlightStatus/FlightStatus";
import FoundFlight from "../../../components/Flight/FoundFlight/FoundFlight";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div>
      <div className={styles.home}>
        <div className={styles.search}>
          <HomeFlightSearch />
        </div>
        <div className={styles.search}>
          <FlightStatus />
        </div>
      </div>
      <h2 className={styles.foundFlight}>Flights</h2>
      <FoundFlight page="home" />
    </div>
  );
};

export default Home;
