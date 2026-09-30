import { cx } from "../../utils/format.js";

export default function Spinner({ size, label = "Loading" }) {
  return <span className={cx("spinner", size && `spinner--${size}`)} role="status" aria-label={label} />;
}
