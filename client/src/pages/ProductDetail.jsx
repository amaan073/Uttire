import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import image from "../assets/image.png";
import Dropdown from "react-bootstrap/Dropdown";
import Card from "../components/ui/Card";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ShoppingBagIcon } from "lucide-react";

const ProductDetail = () => {
  const [filterChange, handleFilterChange] = useState("Most Recent");
  const [formVisible, handleFormVisible] = useState(false);

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -220, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return; //prevents function from running when el gets null value.

    setCanScrollLeft(el.scrollLeft > 0); //boolean values to see if it left end or right end
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth); //also boolean combines scroll from left value and clientwidth and then compares them to scroll width to see if we have reached right end
  };

  useEffect(() => {
    const el = scrollRef.current;
    updateScrollState();
    if (!el) return; //checking just in case no need but good practice for unpredictable behaviour
    el.addEventListener("scroll", updateScrollState); //updating scroll state everytime someone scrolls the slider
    window.addEventListener("resize", updateScrollState); //updating scroll state when window is resized because resizing changes the client width changing the whole scroll width etc
    return () => {
      el.removeEventListener("scroll", updateScrollState); //cleaning listeners before the page unmounts to prevent memory leak
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return (
    <div className="container-xxl px-3 px-md-4 px-xxl-0 py-md-5 py-4">
      <div className="d-md-flex gap-5">
        <div
          className="product-image col-md-6 col-xl-7 col-xxl-12"
          style={{ maxWidth: "770px" }}
        >
          <img src={image} alt="image" className="w-100 h-100 mb-3 mb-md-0" />
        </div>
        <div className="product-info">
          <h3>Soft Cotton Relaxed Fit Hoodie</h3>
          <h5 className="text-secondary">By Brand</h5>
          <h4 className="star-rating">★★★★☆ 4</h4>
          <h5 className="fw-bold">50.99$</h5>
          <h5 className="discount">20% Off</h5>
          <h5 className="stock-indicator mb-3">[In Stock]</h5>
          <h5 className="size">Size : [S][M][L][XL]</h5>
          <h5 className="color">
            <span className="color-indicator" style={{ color: "red" }}></span>
            <span className="color-indicator" style={{ color: "blue" }}></span>
            <span className="color-indicator" style={{ color: "green" }}></span>
            <span className="color-indicator" style={{ color: "Black" }}></span>
            <span
              className="color-indicator"
              style={{ color: "white", border: "thin solid black" }}
            ></span>
          </h5>
          <h5 className="my-3">Quantity : [-] 1 [+]</h5>
          <div className="d-flex my-2 mb-4 gap-2">
            <button className="btn btn-primary d-flex align-items-center gap-1">
              <ShoppingCartIcon /> Add to cart
            </button>
            <Link
              to="/checkout"
              className="btn btn-success d-flex align-items-center gap-1"
            >
              <ShoppingBagIcon /> <span>Buy Now</span>
            </Link>
          </div>
          <div className="d-flex d-xxl-block gap-3">
            <h6 className="m-0 m-xxl-2">&#9989;Free shipping</h6>
            <h6 className="m-0 m-xxl-2"> &#9989;Easy Returns</h6>
          </div>
        </div>
      </div>

      <div className="prod-description">
        <div className="my-5 mb-4">
          <h1 className="pb-3">Description</h1>
          <p>
            This casual cotton t-shirt is perfect for daily wear. Featuring a
            soft and breathable fabric, it offers all-day comfort with a relaxed
            fit. Pair it with jeans or joggers for an effortless look.{" "}
          </p>
        </div>
        <hr className="hr" />
        <div className="my-4">
          <h4 className="pb-3">Fabric & Care Instructions</h4>
          <p>- Fabric: 100% Cotton </p>
          <p>- Soft-touch material</p>
          <div>
            <p>- Wash Care:</p>
            <ul>
              <li>Machine wash cold</li>
              <li>Do not bleach</li>
              <li>Iron on low heat</li>
              <li>Do not dry clean</li>
            </ul>
          </div>
        </div>
        <hr className="hr" />
        <div className="my-4">
          <h4 className="pb-3">Size & Fit</h4>
          <p>- Fit: Regular </p>
          <p>- Model is 6&apos;1&quot; and wearing size L</p>
          <p>
            - Refer to the size chart for exact measurements{" "}
            <i>[View Size Chart]</i> →
          </p>
        </div>
        <hr className="hr" />
        <div className="my-4">
          <h4>Specifications</h4>
          <div
            className="d-grid pt-3"
            style={{ gridTemplateColumns: "1fr 1fr", maxWidth: "350px" }}
          >
            <p>Sleeve Length</p>
            <p>Short Sleeves</p>
            <p>Neck Type</p>
            <p>Crew Neck</p>
            <p>Pattern</p>
            <p>Solid</p>
            <p>Occasion</p>
            <p>Casual</p>
            <p>Country of Origin</p>
            <p>India</p>
          </div>
        </div>
      </div>

      <hr className="hr" />

      <div className="reviews my-4">
        <h1 className="pb-3">Customer reviews</h1>
        <div className="rating-overall">
          <div className="fs-4 mb-2">★★★★☆ 4.2 out of 5</div>
          <p>Based on 123 reviews</p>
          <div
            className="rating-category rounded border  p-3 w-100"
            style={{ maxWidth: "410px" }}
          >
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div
                className="position-relative w-100"
                style={{ maxWidth: "300px", height: "12px" }}
              >
                <div className="w-100 rounded bg-white border border-3 h-100"></div>
                <div
                  className="bg-warning rounded position-absolute top-0 left-0 h-100"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="m-0 p-0" style={{ width: "100px" }}>
                5<span className="text-warning">★</span> (80)
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div
                className="position-relative w-100"
                style={{ maxWidth: "300px", height: "12px" }}
              >
                <div className="w-100 rounded bg-white border border-3 h-100"></div>
                <div
                  className="bg-warning rounded position-absolute top-0 left-0 h-100"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <p className="m-0 p-0" style={{ width: "100px" }}>
                4<span className="text-warning">★</span> (67)
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div
                className="position-relative w-100"
                style={{ maxWidth: "300px", height: "12px" }}
              >
                <div className="w-100 rounded bg-white border border-3 h-100"></div>
                <div
                  className="bg-warning rounded position-absolute top-0 left-0 h-100"
                  style={{ width: "90%" }}
                ></div>
              </div>
              <p className="m-0 p-0" style={{ width: "100px" }}>
                3<span className="text-warning">★</span> (76)
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div
                className="position-relative w-100"
                style={{ maxWidth: "300px", height: "12px" }}
              >
                <div className="w-100 rounded bg-white border border-3 h-100"></div>
                <div
                  className="bg-warning rounded position-absolute top-0 left-0 h-100"
                  style={{ width: "10%" }}
                ></div>
              </div>
              <p className="m-0 p-0" style={{ width: "100px" }}>
                2<span className="text-warning">★</span> (10)
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div
                className="position-relative w-100"
                style={{ maxWidth: "300px", height: "12px" }}
              >
                <div className="w-100 rounded bg-white border border-3 h-100"></div>
                <div
                  className="bg-warning rounded position-absolute top-0 left-0 h-100"
                  style={{ width: "5%" }}
                ></div>
              </div>
              <p className="m-0 p-0" style={{ width: "100px" }}>
                1<span className="text-warning">★</span> (5)
              </p>
            </div>
          </div>
        </div>
        <button
          className={`btn btn-primary my-3 ${
            formVisible ? "d-none" : "d-block"
          }`}
          onClick={() => handleFormVisible(true)}
        >
          Write a review
        </button>

        <form
          className={`review-form border p-4 mt-4 rounded-4 shadow position-relative ${
            formVisible ? "d-block" : "d-none"
          }`}
          style={{ maxWidth: "400px" }}
        >
          <button
            className="btn btn-light rounded-circle p-0 position-absolute"
            style={{ width: "30px", height: "30px", right: "24px" }}
            onClick={(e) => {
              handleFormVisible(false);
              e.preventDefault();
            }}
          >
            &times;
          </button>

          <div
            className="star-rating d-flex flex-row-reverse justify-content-end fs-4"
            style={{ cursor: "pointer" }}
          >
            <input type="radio" id="star5" name="rating" value="5" />
            <label htmlFor="star5">&#9733;</label>
            <input type="radio" id="star4" name="rating" value="4" />
            <label htmlFor="star4">&#9733;</label>
            <input type="radio" id="star3" name="rating" value="3" />
            <label htmlFor="star3">&#9733;</label>
            <input type="radio" id="star2" name="rating" value="2" />
            <label htmlFor="star2">&#9733;</label>
            <input type="radio" id="star1" name="rating" value="1" />
            <label htmlFor="star1">&#9733;</label>
            <b className="me-2 mb-2">Rate:</b>
            {/* everything here is in reverse becaues of row-reverse and row-reverse is needed to achieve star rating feature */}
          </div>
          <div className="form-group my-2">
            <label htmlFor="name-input">Name</label>
            <input type="text" className="form-control" id="name-input" />
          </div>
          <div className="form-group my-2">
            <label htmlFor="email-input">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email-input"
              placeholder="name@example.com"
            />
          </div>
          <div className="form-group my-2">
            <label htmlFor="review-title">Title</label>
            <input type="text" className="form-control" id="name-input" />
          </div>
          <div className="form-group my-2">
            <label htmlFor="review-content">Review</label>
            <textarea
              className="form-control"
              id="review-content"
              rows="3"
            ></textarea>
          </div>
          <div className="form-group mt-3">
            <button type="submit" className="btn btn-primary">
              Submit review
            </button>
          </div>
        </form>

        <div className="my-3 mt-5 fs-5 d-flex gap-2 align-items-center">
          <b className="p-0 m-0">
            Filter By{" "}
            <span className="d-none d-sm-inline-block">★★★★★ | ★★★★☆ | </span>
          </b>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {filterChange}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                href="#"
                onClick={() => handleFilterChange("Most Recent")}
              >
                Most Recent
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={() => handleFilterChange("Highest rating")}
              >
                Highest rating
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={() => handleFilterChange("Lowest rating")}
              >
                Lowest rating
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="user-ratings mt-4" style={{ maxWidth: "700px" }}>
          <div className="rating-card py-2">
            <div className="d-sm-flex gap-2 align-items-center">
              <div className="fs-5 text-warning">★★★★★</div>
              <div>
                by <b>Aman S.</b>
              </div>
              <div className="d-none d-sm-block">•</div>
              <div className="d-flex d-sm-bloxk gap-2 mb-2 m-sm-0">
                <div className="fst-italic">Verified Buyer</div>
                <div>•</div>
                <div className="text-secondary">2d ago</div>
              </div>
            </div>
            <p className="p-3 border-start border-bottom">
              &quot;Absolutely love the fit and material. Color is exactly as
              shown. Will definitely repurchase!&quot;&quot;Absolutely love the
              fit and material. Color is exactly as shown. Will definitely
              repurchase!&quot;&quot;Absolutely love the fit and material. Color
              is exactly as shown. Will definitely repurchase!&quot;
            </p>
          </div>
          <div className="rating-card py-2">
            <div className="d-sm-flex gap-2 align-items-center">
              <div className="fs-5 text-warning">★★★★★</div>
              <div>
                by <b>Aman S.</b>
              </div>
              <div className="d-none d-sm-block">•</div>
              <div className="d-flex d-sm-bloxk gap-2 mb-2 m-sm-0">
                <div className="fst-italic">Verified Buyer</div>
                <div>•</div>
                <div className="text-secondary">2d ago</div>
              </div>
            </div>
            <p className="p-3 border-start border-bottom">
              &quot;Absolutely love the fit and material. Color is exactly as
              shown. Will definitely repurchase!&quot;&quot;Absolutely love the
              fit and material. Color is exactly as shown. Will definitely
              repurchase!&quot;&quot;Absolutely love the fit and material. Color
              is exactly as shown. Will definitely repurchase!&quot;
            </p>
          </div>
        </div>

        <a href="#" className="fs-5 text-decoration-underline fw-semibold">
          Load more reviews {">"}
        </a>
      </div>

      <hr className="hr" />

      <div className="related-products ">
        <h1 className="my-3 mb-4">Related Products</h1>
        <div className="d-flex position-relative">
          {canScrollLeft && (
            <div
              className="arrow-indicator d-none d-sm-flex"
              onClick={scrollLeft}
              style={{ left: "-10px" }}
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </div>
          )}
          <div
            className="d-flex overflow-scroll overflow-y-hidden card-scroll-container pb-2"
            style={{
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
            }}
            ref={scrollRef}
          >
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
            <Card
              style={{
                scrollSnapAlign: "start",

                minWidth: "200px",
                marginRight: "10px",
              }}
            />
          </div>
          {canScrollRight && (
            <div
              className="arrow-indicator d-none d-sm-flex"
              onClick={scrollRight}
              style={{ right: "-10px" }}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
