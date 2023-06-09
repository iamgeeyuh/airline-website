import Flight from "../Flight/Flight";
import styles from "./FoundFlight.module.css";

const FoundFlight = (props) => {
  return (
    <div className={styles.foundFlight}>
      <h2>Flights</h2>
      {props.flights.length === 0 ? (
        <p>No flights found.</p>
      ) : (
        <>
          {props.flights.map((flight) => (
            <div
              key={`${flight.flight_num}-${flight.departure_date}-${flight.departure_time}-${flight.airline_name}`}
            >
              <Flight
                airline={flight.airline_name}
                srcCity={flight.dep_city}
                srcAirport={flight.dep_airport_name}
                dstCity={flight.arr_city}
                dstAirport={flight.arr_airport_name}
                key={`${flight.flight_num}-${flight.departure_date}-${flight.departure_time}-${flight.airline_name}`}
                flightNum={flight.flight_num}
                depDate={flight.departure_date}
                depTime={flight.departure_time}
                arrDate={flight.arrival_date}
                arrTime={flight.arrival_time}
                price={flight.price}
                page={props.page}
                ticket_id={
                  props.page === "cancel" ||
                  props.page === "review" ||
                  props.page === "purchase"
                    ? flight.ticket_id
                    : null
                }
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FoundFlight;
