import { useState } from "react";

import image from "../assets/image.png";
import Dropdown from "react-bootstrap/Dropdown";

const ProductDetail = () => {
  const [filterChange, handleFilterChange] = useState("Most Recent");
  const [formVisible, handleFormVisible] = useState(false);

  return (
    <div className="container py-md-5 py-2">
      <div className="d-flex gap-5">
        <div className="product-image">
          <img src={image} alt="image" />
        </div>
        <div className="product-info">
          <h3>Product Title</h3>
          <h5 className="text-secondary">By Brand</h5>
          <h4 className="star-rating">★★★★☆ 4</h4>
          <h5 className="fw-bold">50.99$</h5>
          <h5 className="discount">20% Off</h5>
          <h5 className="stock-indicator mb-5">[In Stock]</h5>
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
          <h5 className="my-4 mb-5">Quantity : [-] 1 [+]</h5>
          <button className="btn btn-primary d-block my-2">Add to cart</button>
          <button className="btn btn-success d-block my-2 mb-4">Buy Now</button>
          <h6>&#9989;Free shipping</h6>
          <h6> &#9989;Easy Returns</h6>
        </div>
      </div>

      <div className="prod-description">
        <div className="my-5 mb-4">
          <h4 className="pb-3">Description</h4>
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

      <hr className="bold" />

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
              <p className="m-0 p-0">5&#11088; (80)</p>
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
              <p className="m-0 p-0">4&#11088; (67)</p>
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
              <p className="m-0 p-0">3&#11088; (76)</p>
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
              <p className="m-0 p-0">2&#11088; (10)</p>
            </div>
            <div className="d-flex align-items-center gap-3">
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
              <p className="m-0 p-0">1&#11088; (5)</p>
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
            {/* everything here is in reverse becaues row-reverse and row-reverse is needed to achieve star rating feature */}
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
          <b className="p-0 m-0">Filter By ★★★★★ | ★★★★☆ | </b>
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
            <div className="d-flex gap-2 align-items-center">
              <div className="fs-5">★★★★★</div>
              <div>
                by <b>Aman S.</b>
              </div>
              <div>•</div>
              <div>Verified Buyer</div>
              <div>•</div>
              <div>2 days ago</div>
            </div>
            <p className="p-2 px-3 border-start">
              &quot;Absolutely love the fit and material. Color is exactly as
              shown. Will definitely repurchase!&quot;&quot;Absolutely love the
              fit and material. Color is exactly as shown. Will definitely
              repurchase!&quot;&quot;Absolutely love the fit and material. Color
              is exactly as shown. Will definitely repurchase!&quot;
            </p>
          </div>
          <div className="rating-card py-2">
            <div className="d-flex gap-2 align-items-center">
              <div className="fs-5">★★★★★</div>
              <div>
                by <b>Aman S.</b>
              </div>
              <div>•</div>
              <div>Verified Buyer</div>
              <div>•</div>
              <div>2 days ago</div>
            </div>
            <p className="p-2 px-3 border-start">
              &quot;Absolutely love the fit and material. Color is exactly as
              shown. Will definitely repurchase!&quot;&quot;Absolutely love the
              fit and material. Color is exactly as shown. Will definitely
              repurchase!&quot;&quot;Absolutely love the fit and material. Color
              is exactly as shown. Will definitely repurchase!&quot;
            </p>
          </div>
          <div className="rating-card py-2">
            <div className="d-flex gap-2 align-items-center">
              <div className="fs-5">★★★★★</div>
              <div>
                by <b>Aman S.</b>
              </div>
              <div>•</div>
              <div>Verified Buyer</div>
              <div>•</div>
              <div>2 days ago</div>
            </div>
            <p className="p-2 px-3 border-start">
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

        <hr className="hr" />
      </div>
    </div>
  );
};

export default ProductDetail;
