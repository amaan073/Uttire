import { useEffect, useState } from "react";
import publicAxios from "../api/publicAxios";
import useOnlineStatus from "../hooks/useOnlineStatus";
import Card from "../components/ui/Card";
import { Filter } from "lucide-react";
import { Spinner } from "react-bootstrap";

const Shop = () => {
  const isOnline = useOnlineStatus();
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState(5);
  const [maxPrice, setMaxPrice] = useState(100);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // to disable filter action buttons when not

  const isDefaultFilters =
    selectedGenders.length === 0 &&
    selectedSizes.length === 0 &&
    selectedColors.length === 0 &&
    minPrice === 5 &&
    maxPrice === 100;
  const [appliedFilters, setAppliedFilters] = useState({
    genders: [],
    sizes: [],
    colors: [],
    minPrice: 5,
    maxPrice: 100,
  });
  const filtersChanged =
    JSON.stringify({
      genders: selectedGenders,
      sizes: selectedSizes,
      colors: selectedColors,
      minPrice,
      maxPrice,
    }) !== JSON.stringify(appliedFilters);

  const fetchProducts = async (page = 1) => {
    const query = new URLSearchParams();

    if (selectedGenders.length)
      query.append("genders", selectedGenders.join(","));
    if (selectedSizes.length) query.append("sizes", selectedSizes.join(","));
    if (selectedColors.length) query.append("colors", selectedColors.join(","));
    if (minPrice || maxPrice) {
      query.append("minPrice", minPrice);
      query.append("maxPrice", maxPrice);
    }

    query.append("page", page);
    query.append("limit", 9);

    try {
      setLoading(true);
      const { data } = await publicAxios.get(`/products?${query.toString()}`);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      setError("Error fetching products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setIsFilterOpen(false);
    }
  };

  //initial products fetching
  useEffect(() => {
    const init = async () => {
      await fetchProducts(1); // fetch first page
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // to update state of checkbox inputs setFilter here is a paramter for particular state update function from the 3 above will be used as argument so this function accept which state variable to update with what value
  const toggleFilter = (filter, value, setFilter) => {
    setFilter(
      (prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value) // remove if already selected (remove if the user want to deselect the chekcboxl like if user selected blue color and wanted to uncheck that clicking it will unselect and remove the filter vlaue from the filter array)
          : [...prev, value] // add if not selected
    );
  };

  // fetching of filtered item
  const applyFilters = async (e) => {
    e.preventDefault();
    setAppliedFilters({
      genders: selectedGenders,
      sizes: selectedSizes,
      colors: selectedColors,
      minPrice,
      maxPrice,
    });
    fetchProducts(1); // reset to page 1 when filters change
    setIsFilterOpen(false); // small screen
    window.scrollTo({
      top: 0,
      behavior: "smooth", // makes it smooth
    });
  };
  const clearFilters = () => {
    setSelectedGenders([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice(5); // reset to default
    setMaxPrice(100); // reset to default
    setCurrentPage(1);
    setIsFilterOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // makes it smooth
    });

    // Reset applied filters too
    setAppliedFilters({
      genders: [],
      sizes: [],
      colors: [],
      minPrice: 5,
      maxPrice: 100,
    });

    // Call backend ignoring current states
    setLoading(true);
    publicAxios
      .get("/products?page=1&limit=9")
      .then(({ data }) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      })
      .catch((error) => {
        setError("Error fetching products");
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const handleMinRangeChange = (e) => {
    const minValue = e.target.value;
    setMinPrice(Math.min(minValue, maxPrice - 5)); //prevents overlapping and set a gap of 5 points
  };
  const handleMaxRangeChange = (e) => {
    const maxValue = e.target.value;
    setMaxPrice(Math.max(maxValue, minPrice + 5)); //prevents overlapping with a gap of 5 points
  };
  const handleFilterBtn = () => {
    setIsFilterOpen(true);
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // makes it smooth
    });
  };

  if (loading)
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  if (error) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
        style={{ marginTop: "-83px" }}
      >
        <i className="bi bi-exclamation-triangle-fill text-danger display-1 mb-3"></i>
        <h2 className="fw-bold text-dark">Oops! Something went wrong</h2>
        <p className="text-muted mb-4">
          We couldn’t load the products right now. Please try again later.
        </p>
        <button
          className="btn btn-outline-primary rounded-pill px-4"
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className="container-xxl py-md-5 py-2 d-md-grid gap-4 align-items-start"
        style={{ gridTemplateColumns: "290px minmax(0,1fr)" }}
      >
        <button
          className="mobile-filter-btn btn btn-primary d-flex align-items-center gap-1  d-md-none my-3 ms-auto"
          onClick={handleFilterBtn}
        >
          <Filter /> <span className="fs-5">Filters</span>
        </button>

        <section
          className={`filter-sidebar shadow-sm position-sticky bg-white p-4 border rounded-3 ${
            isFilterOpen ? "d-block open" : "d-none d-md-block"
          }`}
          aria-label="filter"
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold m-0">Filters</h3>
            <button
              className="close-btn d-block d-md-none btn fw-bold fs-3 border-0"
              onClick={() => setIsFilterOpen(false)}
            >
              &times;
            </button>
          </div>

          <form onSubmit={applyFilters} className="filter-form">
            {/* Gender */}
            <div className="mb-3">
              <h5 className="fw-semibold mb-2">Gender</h5>
              <div className="d-flex flex-wrap gap-2">
                {["Men", "Women", "Unisex"].map((gender) => (
                  <label
                    key={gender}
                    className={`btn btn-sm rounded-pill ${
                      selectedGenders.includes(gender.toLowerCase())
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() =>
                      toggleFilter(
                        "gender",
                        gender.toLowerCase(),
                        setSelectedGenders
                      )
                    }
                  >
                    {gender}
                  </label>
                ))}
              </div>
            </div>

            <hr className="hr" />

            {/* Size */}
            <div className="my-3">
              <h5 className="fw-semibold mb-2">Size</h5>
              <div className="d-flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <label
                    key={size}
                    className={`btn btn-sm rounded-pill ${
                      selectedSizes.includes(size.toLowerCase())
                        ? "btn-dark"
                        : "btn-outline-dark"
                    }`}
                    onClick={() =>
                      toggleFilter("size", size.toLowerCase(), setSelectedSizes)
                    }
                  >
                    {size}
                  </label>
                ))}
              </div>
            </div>

            <hr className="hr" />

            {/* Colors */}
            <div className="my-3">
              <h5 className="fw-semibold mb-2">Color</h5>
              <div className="d-flex flex-wrap gap-2">
                {[
                  "Red",
                  "Blue",
                  "Green",
                  "Black",
                  "White",
                  "Yellow",
                  "Grey",
                ].map((color) => (
                  <label
                    key={color}
                    className={`btn d-flex align-items-center gap-2 px-2 py-1 rounded-pill ${
                      selectedColors.includes(color.toLowerCase())
                        ? "btn-primary text-white"
                        : "btn-light border"
                    }`}
                    style={{ fontSize: "0.85rem" }}
                    onClick={() =>
                      toggleFilter(
                        "color",
                        color.toLowerCase(),
                        setSelectedColors
                      )
                    }
                  >
                    <span
                      className="d-inline-block rounded-circle border"
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: color.toLowerCase(),
                      }}
                    ></span>
                    {color}
                  </label>
                ))}
              </div>
            </div>

            <hr className="hr" />

            {/* <!-- 
              Price Range Slider code snippet adapted from GeeksforGeeks 
              URL: https://www.geeksforgeeks.org/price-range-slider-with-min-max-input-using-html-css-and-javascript/ 
              --> */}
            <div className="price-range-filter my-3">
              <div className="form-group">
                <h5>
                  Price range{" "}
                  <span className="fs-6 ms-2">
                    ({"$" + minPrice} - {"$" + maxPrice})
                  </span>
                </h5>
                <div className="mb-3 fw-bold fs-4"></div>
                <div className="slider-container w-100">
                  <div
                    className="price-slider bg-primary"
                    style={{
                      left: `${((minPrice - 5) / (100 - 5)) * 100}%`,
                      right: `${100 - ((maxPrice - 5) / (100 - 5)) * 100}%`,
                    }}
                  ></div>
                </div>
                {/* <-- Slider --> */}
                <div className="range-input">
                  <input
                    type="range"
                    className="min-range"
                    min="5"
                    max="100"
                    value={minPrice}
                    onChange={handleMinRangeChange}
                  />
                  <input
                    type="range"
                    className="max-range"
                    min="5"
                    max="100"
                    value={maxPrice}
                    onChange={handleMaxRangeChange}
                  />
                </div>
                <div className="d-flex justify-content-between mt-2 fs-6 text-secondary unselectable">
                  <div>5$</div>
                  <div>100$</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-4 gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-4 rounded-pill"
                onClick={clearFilters} //  reset handler
                disabled={isDefaultFilters || !isOnline}
              >
                Clear
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4 rounded-pill text-nowrap"
                disabled={!filtersChanged || !isOnline}
              >
                Apply Filters
              </button>
            </div>
          </form>
        </section>

        <section className="products">
          {products.length === 0 ? (
            <div className="w-100 d-flex flex-column align-items-center justify-content-center py-5 text-muted">
              <i className="bi bi-search display-4 mb-3"></i>
              <h5 className="fw-semibold">No Products Found</h5>
              <p className="mb-0">
                Try adjusting your filters or search again.
              </p>
            </div>
          ) : (
            <div
              className="d-sm-grid gap-4 text-center"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(244px, 1fr))",
              }}
            >
              {products.map((product) => (
                <Card key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* pagination */}
          {totalPages > 1 && (
            <div className="pagination d-flex justify-content-center align-items-center mt-4">
              <nav>
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!isOnline}
                    >
                      &laquo;
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                        disabled={!isOnline}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!isOnline}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Shop;
