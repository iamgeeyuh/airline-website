import StaffFlightSearch from "../../components/Flight/StaffFlightSearch/StaffFlightSearch";
import FoundFlight from "../../components/Flight/FoundFlight/FoundFlight";

const StaffViewFlights = () => {
  return (
    <div>
      <StaffFlightSearch />
      <FoundFlight page="staff" />
    </div>
  );
};

export default StaffViewFlights;
