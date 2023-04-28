import Flight from "../Flight/Flight";

const FoundFlight = () => {
  return (
    <div>
      <h2>Flights Found</h2>
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
      />
    </div>
  );
};

export default FoundFlight;
