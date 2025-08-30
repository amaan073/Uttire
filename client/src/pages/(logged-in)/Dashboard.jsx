import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SettingsIcon from "@mui/icons-material/Settings";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { ExpandMore } from "@mui/icons-material";

const Dashboard = () => {
  return (
    <>
      <div
        className="container-fluid py-5 px-sm-5"
        style={{
          maxWidth: "1600px",
          minHeight: "calc(var(--safe-height) - 83px)",
        }}
      >
        <div style={{ maxWidth: "950px" }} className="mx-auto">
          <div className="pb-3 text-center text-sm-start">
            <h1 className="fw-light">Welcome,</h1>
            <h1 className="display-4 fw-medium">John Doe</h1>
          </div>
          <div
            className="d-lg-flex gap-3"
            title="This dashboard is a UI demo - not functional"
          >
            <div className="w-100 mb-3 mb-lg-0">
              {/* Order section */}
              <div className="border rounded-2 p-3 bg-white mb-3 justify-content-around justify-content-lg-around">
                <h4 className="d-flex gap-2">
                  <ShoppingBagIcon sx={{ fontSize: "25px" }} />
                  <span>Latest Orders</span>
                </h4>
                {/* Order list */}
                <div className="border rounded-2">
                  <div className="d-flex bg-light p-2 px-3">
                    <div className="fw-semibold w-100">Order ID</div>
                    <div className="fw-semibold w-100 pe-3 pe-md-0">Date</div>
                    <div className="fw-semibold w-100">Status</div>
                  </div>
                  <div className="d-flex border-top p-2 px-3">
                    <div className="w-100">#1001</div>
                    <div className="w-100 pe-3 pe-md-0">Jun 10,2025</div>
                    <div className="w-100">Shipped</div>
                  </div>
                  <div className="d-flex border-top p-2 px-3">
                    <div className="w-100">#1002</div>
                    <div className="w-100 pe-3 pe-md-0">Jun 25,2025</div>
                    <div className="w-100">In Transit</div>
                  </div>
                  <div className="d-flex border-top p-2 px-3">
                    <div className="w-100">#1003</div>
                    <div className="w-100 pe-3 pe-md-0">Jun 11,2025</div>
                    <div className="w-100">Dispatched</div>
                  </div>
                </div>
              </div>
              <div className="d-md-flex gap-3">
                {/* Addresses section*/}
                <div className="border p-3 w-100 rounded-2 bg-white mb-3 mb-md-0">
                  <h4 className="d-flex gap-2">
                    <HomeIcon sx={{ fontSize: "26px" }} />
                    <span>Your Address</span>
                  </h4>
                  <p>
                    Plot No. 24, Shanti Nagar, Sikar Road, Jaipur, Rajasthan -
                    302013
                  </p>
                  <button className="btn-primary btn">Manage addresses</button>
                </div>
                {/* Settings */}
                <div className="border p-3 rounded-2 bg-white w-auto">
                  <h4 className="d-flex gap-2">
                    <SettingsIcon sx={{ fontSize: "26px" }} />
                    <span>Settings</span>
                  </h4>
                  <div className="pt-3">
                    <div className="d-flex justify-content-between gap-4">
                      <p className="text-nowrap fw-semibold">
                        Account Privacy:{" "}
                      </p>
                      <div className="text-nowrap">
                        Enabled <ExpandMore />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between gap-4">
                      <p className="text-nowrap fw-semibold">Email alets: </p>
                      <div className="text-nowrap">
                        Disabled <ExpandMore />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-grid d-md-grid d-lg-block gap-3">
              {/* recently viewed */}
              <div
                className="border p-3 rounded-2 bg-white mb-3 mb-md-0 mb-lg-3 pe-4 "
                style={{ gridArea: "a" }}
              >
                <h4 className="d-flex gap-2 text-nowrap">
                  <RemoveRedEyeIcon sx={{ fontSize: "26px" }} />
                  <span>Recently viewed</span>
                </h4>
                <ol className="m-0 p-0 ps-4">
                  <li>Classic Slim Fit Denim Jacket</li>
                  <li className="m-0">Lightweight Cotton Crew Neck</li>
                </ol>
              </div>
              {/* statistics */}
              <div
                className="border p-3 rounded-2 bg-white mb-3 pe-4"
                style={{ gridArea: "b" }}
              >
                <h4 className="d-flex gap-2">
                  <EqualizerIcon sx={{ fontSize: "26px" }} />
                  <span>Statistics</span>
                </h4>
                <div className="d-md-flex d-lg-block flex-column justify-content-around h-75">
                  <div className="d-flex justify-content-between gap-3">
                    <p className="fw-semibold">Total spent:</p>
                    <p>$597</p>
                  </div>
                  <div className="d-flex justify-content-between gap-3">
                    <p className="fw-semibold">Total orders placed:</p>
                    <p>5</p>
                  </div>
                  <div
                    className="d-flex justify-content-between gap-3"
                    style={{ paddingBottom: "7px" }}
                  >
                    <span className="fw-semibold">Last login:</span>
                    <span>2 July, 2025</span>
                  </div>
                </div>
              </div>
              {/* wishlist */}
              <div
                className="border p-3 rounded-2 bg-white mb-3 pe-4"
                style={{ gridArea: "c" }}
              >
                <h4 className="d-flex gap-2">
                  <FavoriteIcon sx={{ fontSize: "26px" }} />
                  <span>Wishlist</span>
                </h4>
                <span className="text-nowrap">
                  You have 2 items in wishlist. &nbsp;
                </span>
                <span className="text-primary text-decoration-underline text-nowrap">
                  See all
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
