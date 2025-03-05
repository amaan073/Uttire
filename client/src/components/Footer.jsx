import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="py-3 pt-4 mt-2 bg-dark text-white text-center">
        <div className="d-flex w-100 justify-content-center gap-3">
          <Link to="#">Privacy Policy</Link>
          <p className="text-primary">|</p>
          <Link to="#">Terms and Conditions</Link>
        </div>

        <p>© {new Date().getFullYear()} Uttire, Inc. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Footer;
