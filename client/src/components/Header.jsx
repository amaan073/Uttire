import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./ui/Navbar.jsx";
import NavBtn from "./ui/NavBtn.jsx";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import { useContext } from "react";
import UserAvatar from "../components/ui/UserAvatar.jsx";

//ICONS
import mainLogo from "../assets/uttireLogo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailWithTooltip from "../components/ui/EmailWithTooltip.jsx";
import { toast } from "react-toastify";
import CartContext from "../context/CartContext.jsx";
import ProductSearchBar from "./ProductSearchBar.jsx";
import { Search } from "lucide-react";

const Header = () => {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [isNavActive, setNavActive] = useState(false); //nav menu button for small screens
  const [isAccountPopupVisible, setisAccountPopupVisible] = useState(false); //login form show and hide

  //checking if user is logged in or not (has value or null)
  const { user, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser(); //clears token and user data
      navigate("/login");
      setisAccountPopupVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="container-fluid position-fixed top-0 light-bg border-bottom">
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

            <ProductSearchBar
              searchBarVisible={searchBarVisible}
              setSearchBarVisible={setSearchBarVisible}
            />
            {/* search button */}
            <button
              className={`search-btn btn border-0 p-0 d-lg-none me-2 me-lg-1 ms-auto ${searchBarVisible ? "search-close" : ""}`}
              onClick={() => setSearchBarVisible(!searchBarVisible)}
            >
              <Search style={{ width: "auto", height: "38px" }} />
            </button>

            <div className="text-end">
              <button
                type="button"
                className="cart btn p-0 ms-0 me-2 mx-lg-2 border-0 position-relative"
                onClick={() => {
                  if (!user) {
                    toast.info("Please log in to view your cart");
                    navigate("/login");
                    return;
                  }
                  navigate("/cart");
                }}
              >
                <ShoppingCartIcon sx={{ height: "38px", width: "auto" }} />
                {user && (
                  <div className="cart-count bg-warning">{cart.length}</div>
                )}
              </button>

              <div className="account-box position-relative d-inline-block">
                <button
                  type="button"
                  className="btn p-0 border-0"
                  onClick={() => {
                    setisAccountPopupVisible(!isAccountPopupVisible);
                  }}
                >
                  <div style={{ height: "38px", width: "38px" }}>
                    {user ? (
                      <div style={{ padding: "2.5px", height: "100%" }}>
                        <UserAvatar
                          user={user}
                          sx={{ backgroundColor: "#d32f2f" }}
                        />
                      </div>
                    ) : (
                      <AccountCircleIcon
                        sx={{ height: "100%", width: "100%" }}
                      />
                    )}
                  </div>
                </button>
                <div
                  className={`account-popup position-absolute end-0 shadow-lg rounded-4 z-3 bg-body mt-3 text-center border p-3 ${
                    isAccountPopupVisible ? "d-block visible" : "d-none"
                  }`}
                >
                  {user ? (
                    <div className="text-start" style={{ minWidth: "340px" }}>
                      <div className="d-flex align-items-center mb-3 gap-2 pe-3">
                        <div
                          style={{
                            width: "90px",
                            height: "90px",
                            padding: "10px",
                          }}
                        >
                          <UserAvatar
                            user={user}
                            sx={{
                              fontSize: "30px",
                              backgroundColor: "#d32f2f",
                            }}
                          />
                        </div>
                        <div className="user-profile-sum">
                          <h4 className="fw-semibold">{user.name}</h4>
                          <EmailWithTooltip email={user.email} />
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
                          to="/orders"
                          className={({ isActive }) =>
                            `a-link m-0 d-flex align-items-center gap-3 py-2 px-2 mb-1 rounded-3 ${
                              isActive ? "text-secondary bg-light" : "text-dark"
                            }`
                          }
                          onClick={() => setisAccountPopupVisible(false)}
                        >
                          <ShoppingBagOutlinedIcon fontSize="large" />
                          Orders
                        </NavLink>
                        <p
                          className="a-link m-0 d-flex align-items-center gap-3 py-2 pb-2 rounded-3 text-danger"
                          style={{ paddingLeft: "11px" }}
                          onClick={handleLogout}
                        >
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
