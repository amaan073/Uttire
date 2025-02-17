import { Link } from "react-router-dom";

import image from "../assets/image.png";
import Card from "../components/ui/Card";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const Home = () => {
  return (
    <>
      <div
        className="container-fluid text-center py-3 px-0"
        style={{ maxWidth: "1600px" }}
      >
        <h1
          style={{
            fontFamily: '"Agbalumo", serif',
            fontSize: "clamp(4.2rem,7vw,5.5rem)",
          }}
          className="main-logo-txt"
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
          <Link
            to="/shop"
            style={{ all: "unset" }}
            className="d-flex align-items-center"
          >
            <ShoppingBagIcon /> Shop Now
          </Link>
        </div>

        {/*Home page Cover  */}
        <div className="home-cover d-flex w-100 mt-3">
          <img
            src={image}
            style={{ width: "33.3333%" }}
            className="h-auto d-none d-md-block"
          />
          <img
            src={image}
            style={{ width: "33.3333%" }}
            className="img_middle h-auto"
          />
          <img
            src={image}
            style={{ width: "33.3333%" }}
            className="h-auto d-none d-md-block"
          />
        </div>

        {/* Featured Producst */}
        <div className="my-5 mx-3">
          <h2 className="text-md-start mb-5">Featured Products</h2>
          <div
            className="d-grid w-100 gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
        <hr />
        {/* Newsletter subsciption */}
        <div className="my-5 mx-3">
          <h2 className="mb-5">Newsletter Subscription</h2>
          <div className="border p-3 px-md-5  rounded bg-dark d-inline-block text-white">
            <p className="mt-2 mb-3">
              Stay updated with our latest news and offers!
            </p>
            <form
              className="mb-2"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="email"
                class="form-control mb-3"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
              <input
                type="submit"
                value="Subscribe"
                className="btn btn-warning"
              />
            </form>
            <p>
              We respect your privacy.
              <i className="text-danger"> Unsubscribe</i> at any time.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
