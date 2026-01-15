import { useLayoutEffect, useState } from "react";
import publicAxios from "../api/publicAxios";
import useOnlineStatus from "../hooks/useOnlineStatus";
import Card from "../components/ui/Card";
import { Filter } from "lucide-react";
import ErrorState from "../components/ui/ErrorState";
import SkeletonCard from "../components/ui/SkeletonCard";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import OfflineNote from "../components/ui/OfflineNote";

const Shop = () => {
  const isOnline = useOnlineStatus();
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState(5);
  const [maxPrice, setMaxPrice] = useState(100);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({
    // single loading state object for all loading states
    initial: false,
    filter: false,
    clear: false,
    pagination: false,
  });
  // helper function to set loading state for a specific type
  const setLoadingState = (type) => {
    setLoading({
      initial: false,
      filter: false,
      clear: false,
      pagination: false,
      [type]: true,
    });
  };
  const [error, setError] = useState(null);

  // to check if the grid is loading
  const isLoadingGrid =
    loading.initial || loading.filter || loading.clear || loading.pagination;

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

  //normalize product
  const normalizeProduct = (product) => {
    if (!product) return null;

    return {
      _id: product?._id ?? "",
      image: product?.image ?? "",
      name: product?.name ?? "Unnamed Product",
      discount: product?.discount ?? 0,
      price: product?.price ?? 0,
      brand: product?.brand ?? "",
      sizes: Array.isArray(product?.sizes) ? product.sizes : [],
      stock: product?.stock ?? 0,
      reviews: Array.isArray(product?.reviews) ? product.reviews : [],
    };
  };

  const fetchProducts = async (page = 1, type = "initial") => {
    setLoadingState(type);

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
      const { data } = await publicAxios.get(`/products?${query.toString()}`);
      setProducts(data?.products ?? []);
      setTotalPages(data?.totalPages ?? 1);
      setCurrentPage(data?.currentPage ?? 1);
      if (type === "initial") setError(null); // for initial fetching
    } catch (error) {
      console.error(error);

      const message =
        error?.code === "OFFLINE_ERROR"
          ? "You are offline. Check your connection."
          : error?.code === "NETWORK_ERROR"
            ? "Network error. Please try again."
            : "Something went wrong.";

      // show error on page for initial fetch errors
      if (type === "initial") {
        if (
          error?.code === "OFFLINE_ERROR" ||
          error?.code === "NETWORK_ERROR"
        ) {
          setError(
            "Couldn't reach server. Check your connection and try again."
          );
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } else {
        // show toast for all other fetch from api buttons
        toast.error(message);
      }
    } finally {
      setLoading({
        initial: false,
        filter: false,
        clear: false,
        pagination: false,
      });

      if (type === "filter" || type === "clear") {
        setIsFilterOpen(false);
      }
    }
  };

  // Avoid flicker on first render
  useLayoutEffect(() => {
    fetchProducts(1, "initial"); // initial load
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
    fetchProducts(1, "filter"); // reset to page 1 when filters change
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

    // Call backend ignoring current states ( its not duplicated logic but required because state updates problems)
    setLoadingState("clear");
    publicAxios
      .get("/products?page=1&limit=9")
      .then(({ data }) => {
        setProducts(data?.products);
        setTotalPages(data?.totalPages);
        setCurrentPage(data?.currentPage);
      })
      .catch((error) => {
        console.error(error);
        const message =
          error?.code === "OFFLINE_ERROR"
            ? "You are offline. Check your connection."
            : error?.code === "NETWORK_ERROR"
              ? "Network error. Please try again."
              : "Something went wrong.";
        toast.error(message);
      })
      .finally(() => {
        setLoading({
          initial: false,
          filter: false,
          clear: false,
          pagination: false,
        });
      });
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
    window.scrollTo({
      top: 0,
    });
    fetchProducts(page, "pagination");
  };

  // ======= Full Page Error Handling ========
  if (error)
    return <ErrorState message={error} retry={() => fetchProducts(1)} />;

  return (
    <>
      <div className="container-xxl shop-page-container py-5 align-items-start">
        <button
          className="mobile-filter-btn btn btn-primary align-items-center gap-1 d-none my-3 ms-auto"
          onClick={handleFilterBtn}
        >
          <Filter /> <span className="fs-5">Filters</span>
        </button>

        <section
          className={`filter-sidebar shadow-sm position-sticky bg-white p-4 border rounded-3 ${
            isFilterOpen ? "open" : ""
          }`}
          aria-label="filter"
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold m-0">Filters</h3>
            <button
              className="filter-close-btn d-none btn fw-bold fs-3 border-0"
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

            {/* 
              Price Range Slider
            */}
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
                className="btn btn-outline-secondary px-4 rounded-pill w-100"
                onClick={clearFilters} //  reset handler
                disabled={isDefaultFilters || !isOnline || loading.clear}
              >
                {loading.clear ? (
                  <>
                    <Spinner animation="border" size="sm" />
                  </>
                ) : (
                  "Clear"
                )}
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4 rounded-pill text-nowrap w-100"
                disabled={!filtersChanged || !isOnline || loading.filter}
              >
                {loading.filter ? (
                  <>
                    <Spinner animation="border" size="sm" />
                  </>
                ) : (
                  "Apply Filters"
                )}
              </button>
            </div>
            <OfflineNote isOnline={isOnline} />
          </form>
        </section>

        <section className="products">
          {isLoadingGrid ? (
            // show 9 skeleton cards
            <div className="shop-products-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="w-100 d-flex flex-column align-items-center justify-content-center py-5 text-muted">
              <i className="bi bi-search display-4 mb-3"></i>
              <h5 className="fw-semibold">No Products Found</h5>
              <p className="mb-0">
                Try adjusting your filters or search again.
              </p>
            </div>
          ) : (
            <div className="shop-products-grid">
              {products.map((product) => {
                const normalizedProduct = normalizeProduct(product);
                return <Card key={product?._id} product={normalizedProduct} />;
              })}
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
                      disabled={!isOnline || isLoadingGrid}
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
                        disabled={!isOnline || isLoadingGrid}
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
                      disabled={!isOnline || isLoadingGrid}
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
