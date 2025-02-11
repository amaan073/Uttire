import PropTypes from "prop-types";
import "./navBtn.css";

const NavBtn = ({ isNavActive, setNavActive }) => {
  //Nav button inspired by [Caler Edwards YT]

  return (
    <>
      <button
        className={`nav-view-btn btn p-0 d-md-none me-2 border-0 ${
          isNavActive ? "active" : ""
        }`}
        onClick={() => setNavActive(!isNavActive)}
      >
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </button>
    </>
  );
};

NavBtn.propTypes = {
  isNavActive: PropTypes.bool,
  setNavActive: PropTypes.func,
};

export default NavBtn;
