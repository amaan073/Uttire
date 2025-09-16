import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import { Spinner } from "react-bootstrap";
import { RouterProvider } from "react-router-dom";
import router from "../router";

// Wrapper to handle combined loading
const AppWrapper = () => {
  const { loading: authLoading } = useContext(AuthContext); //get the loading var value from auth context and use deconstruct to assing the value to authloadinng var
  const { loading: cartLoading } = useContext(CartContext); //same here

  const isLoading = authLoading || cartLoading;

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default AppWrapper;
