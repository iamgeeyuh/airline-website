import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logInHandler = (value) => {
    setIsLoggedIn(value);
  };

  const [modal, setModal] = useState(false);

  const modalHandler = (value) => {
    setModal(value);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        logInHandler: logInHandler,
        modal: modal,
        modalHandler: modalHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
