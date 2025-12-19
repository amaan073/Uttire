import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";

/* eslint-disable react/prop-types */
export default function UserAvatar({ user, sx }) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when profileImage changes
  useEffect(() => {
    setImgError(false);
  }, [user?.profileImage]);

  return (
    <Avatar
      src={!imgError ? user?.profileImage : undefined}
      style={{ width: "100%", height: "100%" }}
      sx={sx}
      onError={() => setImgError(true)}
    >
      {user?.name ? user.name[0].toUpperCase() : ""}
    </Avatar>
  );
}
