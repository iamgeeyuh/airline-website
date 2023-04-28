import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth-context";

const AddAirport = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  return (
    <div>
      {isLoggedIn.isLoggedIn && !isLoggedIn.isCustomer && (
        <div>Add Airport</div>
      )}
    </div>
  );
};

export default AddAirport;
