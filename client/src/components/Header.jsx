import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./ui/Navbar.jsx";
import NavBtn from "./ui/NavBtn.jsx";

//ICONS
import mainLogo from "../assets/uttireLogo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Search } from "lucide-react";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false); //search bar open and close in small screens
  const [isResultVisible, setIsResultVisible] = useState(false); //search result hide and show
  const [isNavActive, setNavActive] = useState(false); //nav menu button for small screens
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false); //login form show and hide

  //click outside login form to close it /* snippet From [Tech Stacker] https://youtu.be/wX0pb6CBS-c?si=kZtN6kWFqY0yrG1y*/
  const documentRef = useRef(document);
  documentRef.current.addEventListener("click", (e) => {
    if (e.target.closest(".login")) return;
    setIsLoginFormVisible(false);
  });

  return (
    <>
      <header className="container-fluid position-fixed z-3 top-0 light-bg">
        <div className="px-1 py-3 px-md-3">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start ">
            <NavBtn isNavActive={isNavActive} setNavActive={setNavActive} />

            <Link
              to="/"
              className="d-flex align-items-center text-white text-decoration-none me-2"
            >
              <div className="mainLogo">
                <img src={mainLogo} alt="Uttire logo" height="50" />
              </div>
            </Link>

            <Navbar isNavActive={isNavActive} />

            {/* Search */}
            <div
              className={`search-wrapper position-relative col-12 col-sm-9 col-md-8 col-lg-auto d-lg-block me-lg-2 me-lg-1 ms-lg-auto mt-2 mt-lg-0 mx-auto order-last order-lg-0 ${
                searchOpen ? "d-block" : "d-none"
              }`}
            >
              <form className="search-bar" role="search">
                <input
                  type="search"
                  className="form-control form-control-white text-bg-white"
                  placeholder="Search..."
                  aria-label="Search"
                  onFocus={() => {
                    setIsResultVisible(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsResultVisible(false);
                    }, 200);
                  }}
                />
              </form>

              <div
                className={`search-results shadow rounded border position-absolute end-0 mt-3 w-100 z-2 bg-body ${
                  isResultVisible ? "d-block" : "d-none"
                }`}
                style={{ minWidth: "330px" }}
              >
                <a href="#1" className="d-block p-3">
                  #1
                </a>
                <a href="#2" className="d-block p-3">
                  #2
                </a>
                <a href="#3" className="d-block p-3">
                  #3
                </a>
                <p>hd</p>
              </div>
            </div>

            {/* searchBtn */}
            <button
              className="search-btn btn border-0 p-0 d-lg-none me-2 me-lg-1 ms-auto"
              onClick={() => {
                setSearchOpen(!searchOpen);
              }}
            >
              <Search style={{ width: "auto", height: "38px" }} />
            </button>

            <div className="text-end">
              <button
                type="button"
                className="cart btn p-0 ms-0 me-2 mx-lg-2 border-0 position-relative"
              >
                <ShoppingCartIcon sx={{ height: "38px", width: "auto" }} />
                <div className="cart-count bg-warning" data-count="0">
                  0
                </div>
              </button>

              <div className="account login position-relative d-inline-block">
                <button
                  type="button"
                  className="btn p-0 border-0"
                  onClick={() => {
                    setIsLoginFormVisible(!isLoginFormVisible);
                  }}
                >
                  <AccountCircleIcon sx={{ height: "38px", width: "auto" }} />
                </button>
                <form
                  className={`login-form position-absolute end-0 shadow-lg rounded-4 z-3 bg-body p-4 mt-3 text-start ${
                    isLoginFormVisible ? "d-block visible" : "d-none"
                  }`}
                  style={{ maxWidth: "330px", width: "90vw" }}
                >
                  <div className="mb-3">
                    <label htmlFor="email_input" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email_input"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password_input" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_input"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                  <div className="mt-3" style={{ fontSize: "0.9em" }}>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Don't have an account?
                    <Link to="/signup">
                      <i> Signup </i>
                    </Link>
                    here!
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
