import { Link } from "react-router-dom";
import { ShoppingBag, Target, Lightbulb, Heart } from "lucide-react";
import about_img from "../assets/images/about_page.webp";
import Image from "../components/ui/Image";

const About = () => {
  return (
    <div
      className="container-fluid px-4 py-5"
      style={{ backgroundColor: "#f8f9fa", maxWidth: "1600px" }}
    >
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <div className="p-4  p-sm-5 rounded-4 shadow-lg bg-white">
            <h1 className="display-4 fw-bold mb-3">About Uttire</h1>
            <p className="lead text-muted mb-4">
              Fashion meets art. Style meets comfort. Creativity meets
              innovation. Explore the world of Uttire, where every piece is
              designed to inspire.
            </p>
            <Link
              to="/shop"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
            >
              <ShoppingBag size={18} />
              Explore Collection
            </Link>
          </div>
        </div>
        <div className="col-md-6 text-center mt-4 mt-md-0">
          <Image
            src={about_img}
            alt="Fashion showcase"
            className="rounded shadow-lg w-100"
            style={{ height: "400px" }}
          />
        </div>
      </div>

      {/* ---------------------------
          Core Values Section
      ---------------------------- */}
      <div className="text-center mb-5">
        <h2 className="mb-5 fw-bold">Our Core Values</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
          {[
            { icon: Target, title: "Mission", color: "bg-primary text-white" },
            { icon: Lightbulb, title: "Vision", color: "bg-warning text-dark" },
            { icon: Heart, title: "Passion", color: "bg-danger text-white" },
          ].map(({ icon: Icon, title, color }) => (
            <div className="col" key={title}>
              <div
                className={`card h-100 shadow-sm rounded-4 p-4 d-flex align-items-center justify-content-center ${color}`}
              >
                <Icon size={50} className="mb-3" />
                <h5 className="fw-bold">{title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------
          Team Section
      ---------------------------- */}
      <div className="text-center mb-5">
        <h2 className="mb-4 fw-bold">Meet Our Creative Minds</h2>
        <div className="row justify-content-center g-4">
          {[
            { initials: "AK", name: "Amaan Khan" },
            { initials: "LF", name: "Liam Foster" },
            { initials: "NB", name: "Noah Bennett" },
          ].map(({ initials, name }, idx) => (
            <div
              className="col-auto text-center position-relative"
              key={name}
              style={{
                transform: `translateY(${idx % 2 === 0 ? "-5px" : "5px"})`,
              }}
            >
              <div
                className="rounded-circle bg-white text-dark d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                style={{ width: "100px", height: "100px", fontSize: "28px" }}
              >
                {initials}
              </div>
              <h5 className="fw-bold">{name}</h5>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------
          CTA Section
      ---------------------------- */}
      <div className="text-center py-5">
        <div className="p-5 bg-white rounded-4 shadow-lg">
          <h2 className="mb-3 fw-bold">Join The Uttire Experience</h2>
          <p className="mb-4 text-muted">
            Discover our latest collections and redefine your style.
          </p>
          <Link
            to="/shop"
            className="btn btn-primary d-inline-flex align-items-center gap-2"
          >
            <ShoppingBag size={18} />
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
