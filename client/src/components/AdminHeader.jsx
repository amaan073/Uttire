/* AdminHeader.jsx */
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import {
  LogOut,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
} from "lucide-react";
import UserAvatar from "./ui/UserAvatar";
import useOnlineStatus from "../hooks/useOnlineStatus";

const AdminHeader = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const isOnline = useOnlineStatus();

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="shadow-sm px-3 py-2"
    >
      {/* LEFT: Brand Name / Logo */}
      <Navbar.Brand
        as={Link}
        to="/admin/dashboard"
        className="fw-bold text-uppercase d-flex align-items-center gap-2"
      >
        <img src="/uttireLogo.svg" alt="Uttire logo" height="38" />

        <span>Admin Panel</span>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="admin-navbar-nav" />
      <Navbar.Collapse id="admin-navbar-nav">
        {/* CENTER: Navigation Links */}
        <Nav className="me-auto">
          <Nav.Link
            as={NavLink}
            to="/admin/dashboard"
            className="d-flex align-items-center"
          >
            <LayoutDashboard size={18} className="me-1" /> Dashboard
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/products"
            className="d-flex align-items-center"
          >
            <PackageSearch size={18} className="me-1" /> Products
          </Nav.Link>

          <Nav.Link
            as={NavLink}
            to="/admin/orders"
            className="d-flex align-items-center"
          >
            <ShoppingCart size={18} className="me-1" /> Orders
          </Nav.Link>
        </Nav>

        {/* RIGHT: Profile + Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="link"
            className="d-flex align-items-center text-light text-decoration-none"
            id="admin-profile-dropdown"
          >
            <div
              style={{
                height: "38px",
                width: "38px",
              }}
              className="me-2"
            >
              <UserAvatar
                user={user}
                sx={{ fontSize: "20px", backgroundColor: "#d32f2f" }}
              />
            </div>

            <span className="fw-semibold">{user?.name || "Admin"}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="shadow-sm border-0 rounded">
            <Dropdown.Header>
              <div className="fw-bold">{user?.name}</div>
              <small className="text-muted">{user?.email}</small>
            </Dropdown.Header>
            <Dropdown.Item
              onClick={async () => await logoutUser()}
              disabled={!isOnline}
              className="text-danger d-flex align-items-center"
            >
              <LogOut size={16} className="me-2" /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminHeader;
