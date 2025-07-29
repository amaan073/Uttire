import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./ui/Navbar.jsx";
import NavBtn from "./ui/NavBtn.jsx";
import { NavLink } from "react-router-dom";

//ICONS
import mainLogo from "../assets/uttireLogo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Search } from "lucide-react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GridViewIcon from "@mui/icons-material/GridView";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailWithTooltip from "../components/ui/EmailWithTooltip.jsx";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false); //search bar open and close in small screens
  const [isResultVisible, setIsResultVisible] = useState(false); //search result hide and show
  const [isNavActive, setNavActive] = useState(false); //nav menu button for small screens
  const [isAccountPopupVisible, setisAccountPopupVisible] = useState(false); //login form show and hide

  const userLoggedIn = false; //temporary solution

  //click outside login form to close it /* snippet From [Tech Stacker] https://youtu.be/wX0pb6CBS-c?si=kZtN6kWFqY0yrG1y*/
  const documentRef = useRef(document);
  documentRef.current.addEventListener("click", (e) => {
    if (e.target.closest(".account-box")) return;
    setisAccountPopupVisible(false);
  });

  return (
    <>
      <header className="container-fluid position-fixed z-3 top-0 light-bg border-bottom">
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
              <Link to="/cart">
                <button
                  type="button"
                  className="cart btn p-0 ms-0 me-2 mx-lg-2 border-0 position-relative"
                >
                  <ShoppingCartIcon sx={{ height: "38px", width: "auto" }} />
                  <div className="cart-count bg-warning" data-count="0">
                    0
                  </div>
                </button>
              </Link>

              <div className="account-box position-relative d-inline-block">
                <button
                  type="button"
                  className="btn p-0 border-0"
                  onClick={() => {
                    setisAccountPopupVisible(!isAccountPopupVisible);
                  }}
                >
                  <AccountCircleIcon sx={{ height: "38px", width: "auto" }} />
                </button>
                <div
                  className={`account-popup position-absolute end-0 shadow-lg rounded-4 z-3 bg-body mt-3 text-center border p-3 ${
                    isAccountPopupVisible ? "d-block visible" : "d-none"
                  }`}
                >
                  {userLoggedIn ? (
                    <div className="text-start">
                      <div className="d-flex align-items-center mb-3 gap-2 pe-3">
                        <div style={{ width: "90px", height: "90px" }}>
                          <AccountCircleIcon
                            sx={{
                              height: "90px",
                              width: "auto",
                              color: "gray",
                            }}
                          />
                        </div>
                        <div className="user-profile-sum">
                          <h4 className="fw-semibold">John Doe</h4>
                          <EmailWithTooltip email="john-doe23456578@gmail.com" />
                        </div>
                      </div>
                      <hr className="hr" />
                      <div className="mt-2 fs-5">
                        <NavLink
                          to="/profile"
                          className={({ isActive }) =>
                            `a-link m-0 d-flex align-items-center gap-3 py-2 px-2 mb-1 rounded-3 ${
                              isActive ? "text-secondary bg-light" : "text-dark"
                            }`
                          }
                          onClick={() => setisAccountPopupVisible(false)}
                        >
                          <PersonOutlineIcon fontSize="large" />
                          Profile
                        </NavLink>
                        <NavLink
                          to="/dashboard"
                          className={({ isActive }) =>
                            `a-link m-0 d-flex align-items-center gap-3 py-2 px-2 mb-1 rounded-3 ${
                              isActive ? "text-secondary bg-light" : "text-dark"
                            }`
                          }
                          onClick={() => setisAccountPopupVisible(false)}
                        >
                          <GridViewIcon fontSize="large" />
                          Dashboard
                        </NavLink>
                        <p className="a-link m-0 d-flex align-items-center gap-3 py-2 px-2 rounded-3 text-danger">
                          <LogoutIcon fontSize="large" />
                          Logout
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="mb-2 d-inline-block">
                        You&apos;re not logged in!
                      </span>
                      <div className="d-flex gap-2 px-1">
                        <NavLink
                          to="/login"
                          className={({ isActive }) =>
                            "btn" +
                            (isActive
                              ? " disabled btn-secondary"
                              : " btn-primary")
                          }
                          onClick={() => setisAccountPopupVisible(false)}
                        >
                          Login
                        </NavLink>
                        <NavLink
                          to="/signup"
                          className={({ isActive }) =>
                            "btn" +
                            (isActive
                              ? " disabled btn-secondary"
                              : " btn-success")
                          }
                          onClick={() => setisAccountPopupVisible(false)}
                        >
                          Signup
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
