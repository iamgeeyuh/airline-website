import Flight from "../Flight/Flight";
import styles from "./FoundFlight.module.css";

const FoundFlight = (props) => {
  return (
    <div>
      <h2 className={styles.foundFlight}>Flights</h2>
      <div>
        <Flight
          airline="Jet Blue"
          srcCity="New York City"
          srcAirport="JFK"
          dstCity="Boston"
          dstAirport="Boston Airport"
          flightNum="587"
          depDate="2023-04-04"
          depTime="15:00:00"
          arrDate="2023-04-04"
          arrTime="8:00:00"
          price="3000.00"
          page={props.page}
        />
      </div>
      <div>
        <Flight
          airline="Jet Blue"
          srcCity="New York City"
          srcAirport="JFK"
          dstCity="Boston"
          dstAirport="Boston Airport"
          flightNum="587"
          depDate="2023-04-04"
          depTime="15:00:00"
          arrDate="2023-04-04"
          arrTime="8:00:00"
          price="3000.00"
          page={props.page}
        />
      </div>
    </div>
  );
};

export default FoundFlight;
