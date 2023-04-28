import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth-context";

const ChangeFlightStatus = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  return (
    <div>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <div>Change Flight Status</div>
      )}
    </div>
  );
};

export default ChangeFlightStatus;
