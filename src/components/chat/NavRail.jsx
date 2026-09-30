import { memo } from "react";
import { APP_NAME, ASSET_BASE } from "../../config.js";
import { cx } from "../../utils/format.js";
import Avatar from "../ui/Avatar.jsx";
import Icon from "../ui/Icon.jsx";
import { FILTERS } from "./filters.js";
import "./NavRail.scss";

function NavRail({ filter, onFilterChange, userName, onOpenProfile, onLogout }) {
  return (
    <nav className="rail" aria-label="Main">
      <img className="rail__logo" src={`${ASSET_BASE}assets/logo.png`} alt={APP_NAME} />

      <div className="rail__group">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cx("rail__btn", filter === item.id && "rail__btn--active")}
            onClick={() => onFilterChange(item.id)}
            aria-label={item.label}
            aria-current={filter === item.id ? "page" : undefined}
            data-tooltip={item.label}
          >
            <Icon name={item.icon} size={22} />
          </button>
        ))}
      </div>

      <div className="rail__group rail__group--bottom">
        <button
          type="button"
          className="rail__btn"
          onClick={onLogout}
          aria-label="Log out"
          data-tooltip="Log out"
        >
          <Icon name="logOut" size={20} />
        </button>
        <button
          type="button"
          className="rail__btn rail__btn--avatar"
          onClick={onOpenProfile}
          aria-label="Your profile"
          data-tooltip="Profile"
        >
          <Avatar name={userName} size="sm" />
        </button>
      </div>
    </nav>
  );
}

export default memo(NavRail);
