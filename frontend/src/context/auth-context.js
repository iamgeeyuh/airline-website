import { createContext, useState, useReducer } from "react";

const AuthContext = createContext();

const loginReducer = (state, action) => {
  switch (action.type) {
    case "customer":
      console.log({
        isCustomer: true,
        isLoggedIn: true,
        name: action.name,
        airline: "",
      })
      return {
        isCustomer: true,
        isLoggedIn: true,
        name: action.name,
        airline: "",
      };
    case "staff":
      console.log({
        isCustomer: false,
        isLoggedIn: true,
        name: action.name,
        airline: action.airline,
      })
      return {
        isCustomer: false,
        isLoggedIn: true,
        name: action.name,
        airline: action.airline,
      };
    case "logout":
      return { isCustomer: null, isLoggedIn: false, name: "", airline: "" };
    default:
      return state;
  }
};

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useReducer(loginReducer, {
    isCustomer: null,
    isLoggedIn: false,
    name: "",
    airline: "",
  });

  const [loginModal, setLoginModal] = useState(false);
  const [regModal, setRegModal] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        loginModal: loginModal,
        setLoginModal: setLoginModal,
        regModal: regModal,
        setRegModal: setRegModal,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
