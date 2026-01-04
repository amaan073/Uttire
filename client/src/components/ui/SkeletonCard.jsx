const SkeletonCard = () => {
  return (
    <div
      className="bg-white border rounded-3 shadow-sm d-flex flex-column mb-4"
      style={{ height: "100%", cursor: "pointer" }}
    >
      {/* Image skeleton */}
      <div
        className="w-100 rounded-top-3 bg-light"
        style={{ aspectRatio: "1/1" }}
      ></div>

      {/* Text skeleton */}
      <div className="p-3 d-flex flex-column flex-grow-1 w-100">
        <div
          className="bg-light rounded mb-2"
          style={{ height: "18px", width: "40%" }}
        ></div>
        <div
          className="bg-light rounded mb-2"
          style={{ height: "22px", width: "70%" }}
        ></div>
        <div
          className="bg-light rounded mb-3"
          style={{ height: "14px", width: "90%" }}
        ></div>

        {/* Price + Button row */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div
            className="bg-light rounded"
            style={{ height: "30px", width: "100%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
