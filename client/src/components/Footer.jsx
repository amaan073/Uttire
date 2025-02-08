import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="py-1">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <div className="d-flex align-items-center">
            <span className="mb-3 mb-md-0 text-dark">
              © {new Date().getFullYear()} UrbanEssence, Inc.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
