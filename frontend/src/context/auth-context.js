import { createContext, useState, useReducer } from "react";

const AuthContext = createContext();

const loginReducer = (state, action) => {
  switch (action) {
    case "customer":
      return { isCustomer: true, isLoggedIn: true };
    case "staff":
      return { isCustomer: false, isLoggedIn: true };
    case "logout":
      return { isCustomer: null, isLoggedIn: false };
    default:
      return state;
  }
};

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useReducer(loginReducer, {
    isCustomer: null,
    isLoggedIn: false,
  });

  const [modal, setModal] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        modal: modal,
        setModal: setModal,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
