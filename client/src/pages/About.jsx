import { Link } from "react-router-dom";

import image from "../assets/image.png";
import { ShoppingBagIcon } from "lucide-react";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import { Heart } from "lucide-react";

const About = () => {
  return (
    <>
      <div className="container-xxl text-center py-5">
        <div className="mb-5">
          <h1>Our story</h1>
          <p style={{ maxWidth: "50ch" }} className="mx-auto mb-5">
            Founded in 2025, Uttire was born out of a desire to create clothing
            that embodies both style and comfort. Our journey began in India,
            where we realized that fashion should not only be about looking good
            but also about feeling good. Each piece is designed with the modern
            individual in mind, bleding contemporary aesthetics with timeless
            elegance.
          </p>
          {/* Collage of 6 images */}
          <img src={image} alt="collage" className="w-100" />
        </div>
        <hr />
        <div className="my-5 mx-auto" style={{ maxWidth: "800px" }}>
          <h1>Core Values</h1>
          <div className="d-flex gap-2 gap-md-0 mt-5">
            <div className="col">
              <TrackChangesIcon
                style={{ maxWidth: "100px", width: "60%", height: "auto" }}
              />
              <h3 className="mt-2">Our Mission</h3>
              <p>Empowering individuality</p>
            </div>
            <div className="col">
              <WbIncandescentIcon
                style={{ maxWidth: "100px", width: "60%", height: "auto" }}
              />
              <h3 className="mt-2">Our Vision</h3>
              <p>to inspire creativity</p>
            </div>
            <div className="col">
              <Heart
                style={{ maxWidth: "100px", width: "60%", height: "auto" }}
              />
              <h3 className="mt-2">Our Values</h3>
              <p>Sustainability, Quality and Community</p>
            </div>
          </div>
        </div>
        <hr />
        <div className="my-5 mx-auto" style={{ maxWidth: "800px" }}>
          <h1 className="mb-5">Meet Our Team</h1>
          <div className="d-flex gap-5">
            <div className="col">
              <div className="avatar">AK</div>
              <h4 className="mt-3">Amaan Khan</h4>
            </div>
            <div className="col">
              <div className="avatar">LF</div>
              <h4 className="mt-3">Liam Foster</h4>
            </div>
            <div className="col">
              <div className="avatar">NB</div>
              <h4 className="mt-3">Noah Bennett</h4>
            </div>
          </div>
        </div>
        <hr />
        <div className="mt-5">
          <h2>Join The Uttire Family!</h2>
          <button className="btn btn-primary mt-2">
            <Link
              to="/shop"
              style={{ all: "unset" }}
              className="d-flex align-items-center gap-1"
            >
              <ShoppingBagIcon /> Shop Now
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default About;
