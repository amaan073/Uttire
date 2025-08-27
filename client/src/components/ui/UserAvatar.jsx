import { Avatar } from "@mui/material";

/* eslint-disable react/prop-types */
export default function UserAvatar({ user, sx }) {
  return (
    <Avatar
      src={user?.profileImage || undefined}
      style={{ width: "100%", height: "100%" }}
      sx={sx} // MUI's system props (optional, theme-aware)
    >
      {user?.name ? user.name[0].toUpperCase() : ""}
    </Avatar>
  );
}
