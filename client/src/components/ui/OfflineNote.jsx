import PropTypes from "prop-types";

const OfflineNote = ({ isOnline, className = "" }) => {
  if (isOnline) return null;

  return (
    <p className={`text-muted small fst-italic m-0 ${className}`}>
      🚫 Offline — connect to continue.
    </p>
  );
};

OfflineNote.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default OfflineNote;
