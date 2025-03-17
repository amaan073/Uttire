import { useState } from "react";
import { Link } from "react-router-dom";

import Card from "../components/ui/Card";
import { Filter } from "lucide-react";

const Shop = () => {
  const [minPrice, setMinPrice] = useState(5);
  const [maxPrice, setMaxPrice] = useState(100);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  return (
    <>
      <div
        className="container-xxl py-md-5 py-2 d-md-grid gap-4 align-items-start"
        style={{ gridTemplateColumns: "280px minmax(0,1fr)" }}
      >
        <button
          className="mobile-filter-btn btn btn-primary d-flex align-items-center gap-1  d-md-none my-3 ms-auto"
          onClick={handleFilterBtn}
        >
          <Filter /> <span className="fs-5">Filters</span>
        </button>

        <section
          className={`filter-sidebar bg-white p-3 px-4 border rounded rounded-3 ${
            isFilterOpen ? "d-block open" : "d-none d-md-block"
          }`}
          aria-label="filter"
        >
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="fw-bold m-0 mb-sm-1">Filters</h1>
            <button
              className="close-btn d-block d-md-none btn fw-bold pb-2 fs-3 border-0"
              onClick={() => setIsFilterOpen(false)}
            >
              X
            </button>
          </div>

          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="gender-filter my-3">
                <h4>Gender</h4>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="men"
                  />
                  <label className="form-check-label" htmlFor="men">
                    Men
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="women"
                  />
                  <label className="form-check-label" htmlFor="women">
                    women
                  </label>
                </div>
              </div>

              <hr className="hr" />

              <div className="size-filter my-3">
                <h4>Size</h4>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="size-s"
                  />
                  <label className="form-check-label" htmlFor="size-s">
                    Small
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="size-m"
                  />
                  <label className="form-check-label" htmlFor="size-m">
                    Medium
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="size-L"
                  />
                  <label className="form-check-label" htmlFor="size-L">
                    Large
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="size-xl"
                  />
                  <label className="form-check-label" htmlFor="size-xl">
                    X-Large
                  </label>
                </div>
              </div>

              <hr className="hr" />

              <div className="color-filter my-3">
                <h4>Color</h4>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-red"
                  />
                  <label className="form-check-label" htmlFor="color-red">
                    Red
                    <span
                      className="color-indicator"
                      style={{ color: "red" }}
                    ></span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-blue"
                  />
                  <label className="form-check-label" htmlFor="color-blue">
                    Blue
                    <span
                      className="color-indicator"
                      style={{ color: "blue" }}
                    ></span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-green"
                  />
                  <label className="form-check-label" htmlFor="color-green">
                    Green
                    <span
                      className="color-indicator"
                      style={{ color: "green" }}
                    ></span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-black"
                  />
                  <label className="form-check-label" htmlFor="color-black">
                    Black
                    <span
                      className="color-indicator"
                      style={{ color: "Black" }}
                    ></span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-white"
                  />
                  <label className="form-check-label" htmlFor="color-white">
                    White
                    <span
                      className="color-indicator"
                      style={{ color: "white", border: "thin solid black" }}
                    ></span>
                  </label>
                </div>
              </div>

              <hr className="hr" />

              {/* <!-- 
              Price Range Slider code snippet adapted from GeeksforGeeks 
              URL: https://www.geeksforgeeks.org/price-range-slider-with-min-max-input-using-html-css-and-javascript/ 
              --> */}
              <div className="price-range-filter my-3">
                <div className="form-group">
                  <h4>Price range</h4>
                  <div className="mb-3 fw-bold fs-4">
                    {"$" + minPrice} - {"$" + maxPrice}
                  </div>
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
                  <div className="d-flex justify-content-between mt-2 fw-bold fs-5 text-secondary unselectable">
                    <div>5$</div>
                    <div>100$</div>
                  </div>
                </div>
              </div>

              <hr className="hr" />

              <div className="my-3">
                <div className="form-group">
                  <input
                    type="submit"
                    value="Apply Filter"
                    className="btn btn-primary"
                  />
                </div>
              </div>
            </form>
          </div>
          <form></form>
        </section>

        <section className="products">
          <div
            className="d-sm-grid gap-4 text-center"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(244px, 1fr))",
            }}
          >
            <Link to="/product">
              <Card />
            </Link>
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
          <div className="pagination d-flex gap-5 justify-content-center mt-4 ">
            <Link to="#prev">{"<<"}Prev</Link>
            <div className="d-flex gap-3">
              <Link to="#1">[1]</Link>
              <Link to="#2">[2]</Link>
              <Link to="#3">[3]</Link>
            </div>
            <Link to="#next">Next{">>"}</Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Shop;
