import { AlertTriangle, RotateCcw } from "lucide-react";
import PropTypes from "prop-types";

const ErrorState = ({ message = "Something went wrong", retry }) => {
  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{ marginTop: "-83px" }}
    >
      <AlertTriangle size={64} className="text-danger mb-3" />

      <p className="text-muted mb-4">{message}</p>
      {retry && (
        <button
          className="btn btn-outline-primary rounded-pill px-4 d-flex align-items-center gap-1"
          onClick={retry}
        >
          <RotateCcw size={20} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

ErrorState.propTypes = {
  message: PropTypes.string,
  retry: PropTypes.func,
};

export default ErrorState;
