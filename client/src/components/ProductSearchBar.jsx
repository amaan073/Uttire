import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isValidSearch } from "../utils/validators";
import publicAxios from "../api/publicAxios";
import useOnlineStatus from "../hooks/useOnlineStatus";
import Image from "./ui/Image";
import { createPortal } from "react-dom";

const ProductSearchBar = ({ searchBarVisible }) => {
  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Fetch products (replace URL with your API)
  useEffect(() => {
    if (!searchQuery.trim() || !isValidSearch(searchQuery)) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      setError(""); // clear previous errors
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setHasSearched(true);
      setError(""); // clear errors before new search

      try {
        const { data } = await publicAxios.get(
          `/products/search?q=${encodeURIComponent(searchQuery.trim())}`
        );

        setSearchResults(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong."); // inline error
      } finally {
        setIsSearching(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsResultVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`search-wrapper position-relative d-lg-block col-12 col-sm-9 col-md-6 col-lg-auto me-lg-2 me-lg-1 ms-lg-auto mt-2 mt-lg-0 mx-auto order-last order-lg-0 ${searchBarVisible ? "d-block" : "d-none"}`}
    >
      <form
        className="search-bar d-flex position-relative"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim() !== "") navigate(`/search?q=${searchQuery}`);
          setIsResultVisible(false);
        }}
      >
        <input
          type="search"
          className="form-control form-control-white text-bg-white"
          placeholder="Search products..."
          aria-label="Search"
          value={searchQuery}
          maxLength="50"
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsResultVisible(true)}
          style={{ paddingRight: "35px" }}
          disabled={!isOnline}
        />

        {/* Loading spinner inside input */}
        {isSearching && (
          <span
            className="position-absolute"
            style={{ width: "18px", height: "18px", top: "7px", right: "10px" }}
          >
            <div
              className="spinner-border spinner-border-sm text-secondary"
              role="status"
            ></div>
          </span>
        )}
      </form>
      {isResultVisible &&
        createPortal(
          <div
            className="page-overlay"
            onClick={() => setIsResultVisible(false)}
          />,
          document.body
        )}
      {/* Dropdown */}
      {isResultVisible && searchQuery.trim() && (
        <div
          className="search-results shadow rounded position-absolute end-0 mt-3 w-100 z-2 bg-body"
          style={{ minWidth: "300px" }}
        >
          {/* Validation error */}
          {!isValidSearch(searchQuery) ? (
            <div className="p-3 text-danger">
              Please enter a valid search term (letters, numbers, spaces, - _ .
              &apos; only, max 50 characters)
            </div>
          ) : error ? (
            // Inline API/network error
            <div className="p-3 text-danger d-flex aling-items-center gap-3">
              <i
                className="bi bi-exclamation-triangle text-danger"
                style={{ fontSize: "2rem" }}
              ></i>
              <span style={{ lineHeight: "45px" }}>{error}</span>
            </div>
          ) : hasSearched && !isSearching && searchResults.length === 0 ? (
            //  only show "No results" AFTER a search has completed
            <div className="p-3">No results found</div>
          ) : (
            // Search results
            searchResults.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="d-flex gap-3 align-items-center p-3 text-decoration-none text-dark"
                onClick={() => setIsResultVisible(false)}
              >
                <Image
                  src={product.image}
                  style={{ width: "40px", aspectRatio: "1/1" }}
                  className="rounded-1"
                />
                <div style={{ maxWidth: "150px" }} className="small">
                  {product.name}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

ProductSearchBar.propTypes = {
  searchBarVisible: PropTypes.bool.isRequired,
};

export default ProductSearchBar;
