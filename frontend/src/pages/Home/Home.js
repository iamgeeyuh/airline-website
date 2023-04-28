import FlightSearch from "../../components/Flight/FlightSearch/FlightSearch";
import FlightStatus from "../../components/Flight/FlightStatus/FlightStatus";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";
import styles from "./Home.module.css";


const Home = () => {
  return (
    <div>
      <div className={styles.home}>
        <div className={styles.search}>
          <FlightSearch />
        </div>
        <div className={styles.search}>
          <FlightStatus />
        </div>
      </div>
      <FoundFlight />
    </div>
  );
};

export default Home;
