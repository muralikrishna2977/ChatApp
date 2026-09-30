import { avatarColor, cx, getInitials } from "../../utils/format.js";
import "./Avatar.scss";

// Initials avatar. `shape="square"` is used for groups to set them apart from people.
export default function Avatar({ name = "", size = "md", shape = "circle", online = false }) {
  return (
    <span
      className={cx("avatar", `avatar--${size}`, shape === "square" && "avatar--square")}
      style={{ "--avatar-bg": avatarColor(name) }}
      aria-hidden="true"
    >
      {getInitials(name) || "?"}
      {online && <span className="avatar__status" />}
    </span>
  );
}
