const OfflineBanner = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "#ff4d4db3",
        color: "#fff",
        padding: "1px",
        textAlign: "center",
        fontWeight: "bold",
        zIndex: 9999,
      }}
    >
      ⚠️ You are offline — Some features may not work
    </div>
  );
};

export default OfflineBanner;
