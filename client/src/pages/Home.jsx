import { Link } from "react-router-dom";

import image from "../assets/image.png";

const Home = () => {
  return (
    <>
      <div className="container-xxl text-center my-2">
        <h1
          style={{
            fontFamily: "'Darumadrop One', serif",
            fontSize: "clamp(4.2rem,15vw,5.5rem)",
          }}
        >
          Uttire
        </h1>
        <p
          className="my-2 mx-auto px-3"
          style={{ fontSize: "min(1.1rem,4vw)" }}
        >
          Welcome to Uttire! Explore our collection of stylish and comfortable
          clothing.
        </p>
        <div className="btn btn-primary mt-2 mb-4 mb-md-4">
          <Link to="/shop" style={{ all: "unset" }}>
            Shop Now
          </Link>
        </div>

        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded-4">
            <div className="carousel-item active">
              <img src={image} className="d-block w-100" alt="" />
            </div>
            <div className="carousel-item">
              <img src={image} className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src={image} className="d-block w-100" alt="..." />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
