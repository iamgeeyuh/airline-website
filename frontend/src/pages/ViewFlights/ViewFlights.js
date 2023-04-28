import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerViewFlights from "./CustomerViewFlights";
import StaffViewFlights from "./StaffViewFlights";
import AuthContext from "../../context/auth-context";

const ViewFlights = () => {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  if (!isLoggedIn.isLoggedIn) {
    navigate("/error");
  }

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
