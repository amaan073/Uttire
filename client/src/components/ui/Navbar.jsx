import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Navbar = ({ isNavActive, setNavActive }) => {
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="order-5 order-md-0 col-12 col-md-auto">
      <ul
        className={`nav col-lg-auto align-items-center justify-content-center fw-medium d-md-flex mt-2 mt-md-0 ${
          isNavActive ? "d-flex" : "d-none"
        }`}
      >
        {navItems.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive
                  ? "nav-link p-0 px-2 text-secondary fs-5"
                  : "nav-link p-0 px-2 text-dark fs-5"
              }
              onClick={() => setNavActive(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  isNavActive: PropTypes.bool,
};

export default Navbar;
