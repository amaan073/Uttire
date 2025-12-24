/* eslint-disable react/prop-types */

const OfflineNote = ({ isOnline }) => {
  if (isOnline) return null;
  // 🔧 ADDED: do not render anything when user is online

  return (
    <p className="text-muted mt-2 small text-center mb-0">
      <i>🚫🌐Offline — connect to continue.</i>
    </p>
  );
};

export default OfflineNote;
