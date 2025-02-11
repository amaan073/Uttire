import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const Navbar = ({ isNavActive }) => {
  return (
    <nav className="order-5 order-md-0 col-12 col-md-auto">
      <ul
        className={`nav col-lg-auto align-items-center justify-content-center fw-medium d-md-flex mt-2 mt-md-0 ${
          isNavActive ? "d-flex" : "d-none"
        }`}
      >
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link px-2 text-secondary fs-5"
                : "nav-link px-2 text-dark fs-5"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? "nav-link px-2 text-secondary fs-5"
                : "nav-link px-2 text-dark fs-5"
            }
          >
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "nav-link px-2 text-secondary fs-5"
                : "nav-link px-2 text-dark fs-5"
            }
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "nav-link px-2 text-secondary fs-5"
                : "nav-link px-2 text-dark fs-5"
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  isNavActive: PropTypes.bool,
};

export default Navbar;
