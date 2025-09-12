import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("admLogged");
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
