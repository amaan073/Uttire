import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./ui/Navbar.jsx";
import NavBtn from "./ui/NavBtn.jsx";

//ICONS
import mainLogo from "../assets/urbanEssenceLogo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Search } from "lucide-react";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false); //search bar open and close in small screens
  const [isVisibile, setVisibility] = useState(false); //search result hide and show
  const [isNavActive, setNavActive] = useState(false); //nav menu button for small screens

  //toggle search view button
  const handleSearchView = () => {
    setSearchOpen(!searchOpen);
  };

  //search result show and hide
  const handleFocus = () => {
    setVisibility(true);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setVisibility(false); //setting a delay to click the result items before hiding results on blur
    }, 100);
  };

  return (
    <>
      <header className="py-3 px-1">
        <div className="container-lg">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start ">
            <NavBtn isNavActive={isNavActive} setNavActive={setNavActive} />

            <Link
              to="/"
              className="d-flex align-items-center text-white text-decoration-none me-2"
            >
              <div className="mainLogo">
                <img src={mainLogo} alt="urbanEssence logo" height="50" />
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
                  onFocus={(e) => handleFocus(e)}
                  onBlur={(e) => handleBlur(e)}
                />
              </form>

              <div
                className={`search-results shadow rounded border position-absolute end-0 mt-3 w-100 z-2 bg-body ${
                  isVisibile ? "d-block" : "d-none"
                }`}
                style={{ minWidth: "330px" }}
              >
                <a href="#1" className="d-block p-3">
                  #
                </a>
                <a href="#3" className="d-block p-3">
                  #
                </a>
                <a href="#2" className="d-block p-3">
                  #
                </a>
              </div>
            </div>

            {/* searchBtn */}
            <button
              className="search-btn btn border-0 p-0 d-lg-none me-2 me-lg-1 ms-auto"
              onClick={(e) => handleSearchView(e)}
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

              <div className="login position-relative d-inline-block">
                <button type="button" className="btn p-0 border-0">
                  <AccountCircleIcon sx={{ height: "38px", width: "auto" }} />
                </button>
                <form
                  className="login-form position-absolute end-0 shadow rounded-4 z-3 bg-body p-4 mt-3 text-start"
                  style={{ minWidth: "300px" }}
                >
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      id="exampleInputPassword1"
                    />
                  </div>
                  <button type="submit" class="btn btn-primary">
                    Login
                  </button>
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
