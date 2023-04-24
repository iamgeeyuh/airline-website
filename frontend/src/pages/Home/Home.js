import { useContext, useState, useEffect } from "react";
import StaffHome from "./StaffHome";
import CustomerHome from "./CustomerHome";
import AuthContext from "../../context/auth-context";

const Home = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);

  return !isLoggedIn.isLoggedIn ? (
    <p>Home Page</p>
  ) : isLoggedIn.isCustomer ? (
    <CustomerHome />
  ) : (
    <StaffHome />
  );
};

export default Home;
