import { useContext, useEffect, useState } from "react";
import CustomerViewFlights from "./CustomerViewFlights";
import StaffViewFlights from "./StaffViewFlights";
import AuthContext from "../../context/auth-context";

const ViewFlights = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  return (
    <div>
      {isLoggedIn.isLoggedIn &&
        (isLoggedIn.isCustomer ? (
          <CustomerViewFlights />
        ) : (
          <StaffViewFlights />
        ))}
    </div>
  );
};

export default ViewFlights;
