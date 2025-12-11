import { Spinner } from "react-bootstrap";

/* eslint-disable react/prop-types */
const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ marginTop: "-83px" }}
    >
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">{message}</span>
      </Spinner>
    </div>
  );
};
export default LoadingScreen;
