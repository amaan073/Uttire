import { MenuItem, Select, FormControl } from "@mui/material";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { useState } from "react";
import { toast } from "react-toastify";
import privateAxios from "../api/privateAxios";
import useOnlineStatus from "../hooks/useOnlineStatus";
import { Spinner } from "react-bootstrap";

/* eslint-disable react/prop-types */
export default function TwoFactorDemo({ toggleValue }) {
  const isOnline = useOnlineStatus();
  const [twoFactorAuth, setTwoFactorAuth] = useState(toggleValue ?? "off");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    if (loading) return;

    const newValue = e.target.value;
    const oldValue = twoFactorAuth;

    // Optimistic UI update
    setTwoFactorAuth(newValue);
    setLoading(true);

    try {
      await privateAxios.patch("/users/twofactor", {
        twoFactorAuth: newValue,
      });
      toast.success("Two-factor authentication updated! (DEMO feature)");
    } catch (error) {
      setTwoFactorAuth(oldValue); // rollback if failed
      console.error(error);
      if (error?.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (error?.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("Failed to update two-factor authentication");
      }
    } finally {
      setLoading(false);
    }
  };

  const getLabel = (value) =>
    value === "off"
      ? "Off"
      : value === "sms"
        ? "SMS"
        : value === "email"
          ? "Email"
          : "Auth App";

  return (
    <div className="d-flex align-items-center gap-2 w-100">
      <GppGoodIcon />
      <span>2-factor authentication</span>

      <div className="ms-auto">
        {loading && <Spinner animation="border" size="sm" />}
      </div>
      <FormControl size="small" sx={{ minWidth: 117, maxWidth: 117 }}>
        <Select
          value={twoFactorAuth}
          disabled={!isOnline || loading}
          onChange={handleChange}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          MenuProps={{
            disablePortal: false, // dropdown renders in body
            disableScrollLock: true, // IMPORTANT: prevents body overflow hidden
            PaperProps: { style: { maxHeight: 200 } },
          }}
        >
          {["off", "sms", "email", "app"].map((val) => (
            <MenuItem
              key={val}
              value={val}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getLabel(val)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
