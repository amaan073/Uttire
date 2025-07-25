import { Link } from "react-router-dom";

import Card from "../components/ui/Card";
import { ShoppingBagIcon } from "lucide-react";
import home1 from "../assets/images/home1.webp";
import home2 from "../assets/images/home2.webp";
import home3 from "../assets/images/home3.webp";

import DemoToolTip from "../components/ui/DemoTooltip";

const Home = () => {
  return (
    <>
      <div
        className="container-fluid text-center pb-3 px-0"
        style={{ maxWidth: "1600px" }}
      >
        <div className="home-header py-3">
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
              className="d-flex align-items-center gap-1"
            >
              <ShoppingBagIcon />
              Shop Now
            </Link>
          </div>
        </div>

        {/*Home page Cover  */}
        <div className="home-cover d-flex w-100">
          <div className="w-100 d-none d-md-block">
            <img src={home1} alt="Home Cover" className="h-100 w-100" />
          </div>
          <div className="w-100">
            <img src={home2} alt="Home Cover" className="h-100 w-100" />
          </div>
          <div className="w-100 d-none d-md-block">
            <img src={home3} alt="Home Cover" className="h-100 w-100" />
          </div>
        </div>

        {/* Featured Producst */}
        <div className="my-5 mx-3">
          <h2 className="text-md-start mb-5 fw-bold">Featured Products</h2>
          <div
            className="d-sm-grid w-100 gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            <Card className="text-start d-flex text-sm-center d-sm-block mb-2 mb-sm-0" />
            <Card className="text-start d-flex text-sm-center d-sm-block mb-2 mb-sm-0" />
            <Card className="text-start d-flex text-sm-center d-sm-block mb-2 mb-sm-0" />
            <Card className="text-start d-flex text-sm-center d-sm-block mb-2 mb-sm-0" />
            <Card className="text-start d-flex text-sm-center d-sm-block mb-2 mb-sm-0" />
            <Card className="text-start d-flex text-sm-center d-sm-block mb-2 mb-sm-0" />
            <Card className="text-start d-flex text-sm-center d-sm-block mb-2 mb-sm-0" />
            <Card className="text-start d-flex text-sm-center d-sm-block mb-2 mb-sm-0" />
          </div>
        </div>
        <hr />
        {/* Newsletter subsciption */}
        <div className="my-5 mx-3">
          <h2 className="mb-5 fw-bold">Newsletter Subscription</h2>
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
                className="form-control mb-3"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
              <DemoToolTip>
                <input
                  type="submit"
                  value="Subscribe"
                  className="btn btn-warning"
                />
              </DemoToolTip>
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
