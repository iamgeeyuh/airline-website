import { NavLink } from "react-router-dom";

const Error = () => {
  return (
    <div>
      <p>Oops! Are you lost?</p>
      <NavLink to="/">Home!</NavLink>
    </div>
  );
};

export default Error;
