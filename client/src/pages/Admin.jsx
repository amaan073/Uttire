import Image from "../assets/image.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import DemoTooltip from "../components/ui/DemoTooltip";
import ChartCard from "../components/ui/ChartCard";
import { useState } from "react";
import "../components/ui/admin.css";

const Admin = () => {
  const [arrowActive, setArrowActive] = useState(false);
  const statusArr = ["Pending", "Delivered", "In Transit", "Cancelled"];

  return (
    <>
      <div className="container-xxl py-5 px-sm-5">
        {/* Header*/}
        <div className="p-3 px-0 rounded-4 justify-content-between align-items-center d-md-flex">
          <h1
            className="m-0 display-5 mb-4 mb-md-0"
            style={{ fontWeight: "500" }}
          >
            Admin Dashboard
          </h1>
          <div className="d-flex align-items-center">
            <AccountCircleIcon sx={{ fontSize: "50px" }} />
            <h4 className="m-0 ms-3">John Doe</h4>
            <div
              className="position-relative"
              onClick={() => setArrowActive(!arrowActive)}
              onBlur={() => setArrowActive(false)}
            >
              <button
                className={`admin-profile-btn btn p-0${
                  arrowActive ? " active" : ""
                }`}
              >
                <KeyboardArrowDownIcon sx={{ fontSize: "35px" }} />
              </button>
              <div className="admin-profile-popup position-absolute border rounded-3 bg-white px-4 shadow">
                <button className="btn text-nowrap py-3 w-100 text-start">
                  Edit Profile
                </button>
                <DemoTooltip>
                  <button className="btn border-top text-nowrap py-3 w-100 text-start">
                    Settings
                  </button>
                </DemoTooltip>
                <button className="btn border-top text-nowrap py-3 text-danger w-100 text-start">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* details summary */}
        <div className="d-flex justify-content-center gap-3 flex-wrap my-3">
          {/* Total orders */}
          <DemoTooltip>
            <div className="border bg-white p-3 rounded-4 flex-grow-1 px-4">
              <h5 className="p-0 m-0 text-muted">Total Orders</h5>
              <h2 className="m-0 mt-2">1,234</h2>
            </div>
          </DemoTooltip>
          {/* total products */}
          <div className="border bg-white p-3 rounded-4 flex-grow-1 px-4">
            <h5 className="p-0 m-0 text-muted">Total Products</h5>
            <h2 className="m-0 mt-2">567</h2>
          </div>
          {/* Total revenue */}
          <DemoTooltip>
            <div className="border bg-white p-3 rounded-4 flex-grow-1 px-4">
              <h5 className="p-0 m-0 text-muted">Total Revenue</h5>
              <h2 className="m-0 mt-2">$28,341</h2>
            </div>
          </DemoTooltip>
        </div>
        {/* Revenue Charts */}
        <DemoTooltip>
          <div className="mb-4">
            <h2 className="border border-bottom-0 m-0 pt-4 px-4 pb-2 bg-white rounded-top-4">
              Revenue
            </h2>
            <ChartCard />
          </div>
        </DemoTooltip>
        {/* Products section */}
        <div className="mb-4 bg-white-rounded-top-4">
          <div className="d-flex bg-white justify-content-between align-items-center border border-bottom-0 p-4 pb-3 rounded-top-4">
            <h2 className="m-0">Products</h2>
            <button className="btn btn-primary text-nowrap px-3 fs-5">
              <span className="d-block d-sm-none">+</span>
              <span className="d-none d-sm-block">+ Add new Products</span>
            </button>
          </div>
          <div className="table-responsive border border-top-0 rounded-bottom-4">
            <table className="table align-middle" style={{ minWidth: "850px" }}>
              <thead className="border-top bg-light">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th style={{ maxWidth: "320px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(4)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={Image}
                        width="48"
                        style={{ aspectRatio: "1/1" }}
                        className="rounded-3"
                      />
                    </td>
                    <td className="break-word">
                      DenimjacketDenimjacketDenimjacketDenimjacket Denimjacket
                      Denimjacket
                    </td>
                    <td>$200.0</td>
                    <td>9999</td>
                    <td style={{ maxWidth: "320px" }}>
                      <div className="d-flex">
                        <button className="btn btn-primary w-100 fs-5 d-flex align-items-center gap-2 px-3 pe-4">
                          <ModeIcon sx={{ fontSize: "29px" }} />
                          <span>Edit</span>
                        </button>
                        <button className="btn btn-danger w-100 ms-3 fs-5 d-flex align-items-center gap-2 px-3 pe-4">
                          <DeleteIcon sx={{ fontSize: "29px" }} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Orders */}
        <DemoTooltip>
          <div className="mb-4 bg-white-rounded-top-4">
            <h2 className="border border-bottom-0 m-0 p-4 pb-3 bg-white rounded-top-4 overflow-auto">
              Orders
            </h2>
            <div className="table-responsive border border-top-0 rounded-bottom-4">
              <table
                className="table align-middle"
                style={{ minWidth: "850px" }}
              >
                <thead className="border-top">
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, index) => (
                    <tr key={index}>
                      <td>#100{index + 1}</td>
                      <td className="break-word">User {index + 1}</td>
                      <td className="text-white">
                        <span
                          className="p-2 rounded-3 bg-opacity-50"
                          data-value={statusArr[index]}
                        >
                          {statusArr[index]}
                        </span>
                      </td>
                      <td>{index + 11}/1/2025</td>
                      <td>
                        <DemoTooltip>
                          <button className="btn btn-outline-light border-light border-4 text-dark px-2">
                            &#x2022;&#x2022;&#x2022;
                          </button>
                        </DemoTooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DemoTooltip>
        {/* Users */}
        <DemoTooltip>
          <div className="mb-4 bg-white-rounded-top-4">
            <h2 className="border border-bottom-0 m-0 p-4 pb-3 bg-white rounded-top-4 overflow-auto">
              Users
            </h2>
            <div className="table-responsive border border-top-0 rounded-bottom-4">
              <table
                className="table align-middle"
                style={{ minWidth: "850px" }}
              >
                <thead className="border-top">
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, index) => (
                    <tr key={index}>
                      <td>#100{index + 1}</td>
                      <td className="break-word">User {index + 1}</td>
                      <td>User{index + 1}@gmail.com</td>
                      <td>{index + 11}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DemoTooltip>
        {/* Footer */}
        <footer className="mt-5 py-3 px-4 small text-muted border-top bg-light rounded-bottom-4">
          Note: This is a demo for admin dashboard. Only the some sections are
          functional; other features are static or visual mockups.
        </footer>
      </div>
    </>
  );
};

export default Admin;
