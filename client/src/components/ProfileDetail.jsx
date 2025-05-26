import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";

// eslint-disable-next-line react/prop-types
const ProfileDetail = ({ mode, setMode }) => {
  return (
    <div
      className="text-center bg-white p-3 ps-4 rounded-3 border mx-auto mx-md-0 mb-3 mb-md-0"
      style={{ width: "330px", minHeight: "350px" }}
    >
      <h5 className="fw-semibold text-start mb-3">Profile information</h5>

      {(mode == "view" || mode == "changePassword") && (
        <>
          <div className="mb-1">
            <AccountCircleIcon sx={{ height: "135px", width: "auto" }} />
          </div>
          <div>
            <h5 className="m-0">John Doe</h5>

            <p className="m-0 my-1" style={{ wordBreak: "break-all" }}>
              john.doe@gmail.com
            </p>

            <p className="m-0">+951234567890</p>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-3 px-5 py-2"
            onClick={() => setMode("edit")}
          >
            Edit Profile
          </button>
        </>
      )}

      {/* Edit profile mode */}
      {mode == "edit" && (
        <>
          <div className="mb-3 position-relative">
            <AccountCircleIcon sx={{ height: "135px", width: "auto" }} />
            <button
              type="button"
              className="edit-btn btn rounded-circle bg-light p-0 border"
              title="Change profile picture"
            >
              <EditIcon />
            </button>
          </div>
          <form className="text-start">
            <div className="form-group mb-3">
              <label
                htmlFor="name-input"
                className="fw-semibold mb-1 text-secondary"
              >
                Full name
              </label>
              <input
                type="text"
                className="form-control"
                id="name-input"
                name="name"
                value="John doe"
              />
            </div>
            <div className="form-group mb-3">
              <label
                htmlFor="email-input"
                className="fw-semibold mb-1 text-secondary"
              >
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email-input"
                name="email"
                value="john.doe@gmail.com"
              />
            </div>
            <div className="form-group mb-3">
              <label
                htmlFor="phone-no-input"
                className="fw-semibold mb-1 text-secondary"
              >
                Phone number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone-no-input"
                name="Phone-no"
                value="+951234567890"
              />
            </div>
            <div className="form-group d-flex gap-2 w-100 mt-4">
              <button
                type="button"
                className="btn btn-outline-danger w-100"
                onClick={() => setMode("view")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary w-100">
                Save changes
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfileDetail;
