import { MenuItem, Select, FormControl } from "@mui/material";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { useState } from "react";
import { toast } from "react-toastify";
import privateAxios from "../api/privateAxios";
import useOnlineStatus from "../hooks/useOnlineStatus";

/* eslint-disable react/prop-types */
export default function TwoFactorDemo({ toggleValue }) {
  const isOnline = useOnlineStatus();
  const [twoFactorAuth, setTwoFactorAuth] = useState(toggleValue ?? "off");

  const handleChange = async (e) => {
    const newValue = e.target.value;
    const oldValue = twoFactorAuth;

    // Optimistic UI update
    setTwoFactorAuth(newValue);

    try {
      await privateAxios.patch("/users/twofactor", {
        twoFactorAuth: newValue,
      });
      toast.success("Two-factor authentication updated! (DEMO feature)");
    } catch (error) {
      setTwoFactorAuth(oldValue); // rollback if failed
      console.error(error);
      toast.error("Failed to update two-factor authentication");
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

      <FormControl
        size="small"
        sx={{ minWidth: 117, maxWidth: 117 }}
        className="ms-auto"
      >
        <Select
          value={twoFactorAuth}
          disabled={!isOnline}
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
