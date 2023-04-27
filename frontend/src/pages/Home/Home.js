import { useContext, useState, useEffect } from "react";
import StaffHome from "./StaffHome/StaffHome";
import CustomerHome from "./CustomerHome/CustomerHome";
import FlightSearch from "../../components/FlightSearch/FlightSearch";
import FoundFlight from "../../components/FoundFlight/FoundFlight";
import FlightStatus from "../../components/FlightStatus/FlightStatus";
import AuthContext from "../../context/auth-context";

const Home = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  return (
    <div>
      <FlightSearch />
      <FlightStatus />
      <FoundFlight />
      {isLoggedIn.isLoggedIn &&
        (isLoggedIn.isCustomer ? <CustomerHome /> : <StaffHome />)}
    </div>
  );
};

export default Home;
