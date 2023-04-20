import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/auth-context";

const Home = () => {
  const ctx = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(ctx.isLoggedIn);
  useEffect(() => {
    setIsLoggedIn(ctx.isLoggedIn);
  }, [ctx.isLoggedIn]);
  return isLoggedIn && <p>Welcome! Log in works :D</p>;
};

export default Home;
