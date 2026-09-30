import { APP_NAME, ASSET_BASE } from "../../config.js";
import Icon from "../ui/Icon.jsx";
import "./Auth.scss";

const FEATURES = [
  { icon: "messageCircle", text: "Instant one-to-one messaging" },
  { icon: "users", text: "Group conversations for your whole team" },
  { icon: "paperclip", text: "Share photos, videos and documents" },
  { icon: "checkCircle", text: "See who's online and typing" },
];

function Logo() {
  return (
    <div className="auth__logo">
      <img src={`${ASSET_BASE}assets/logo.png`} alt="" width="36" height="36" />
      <span>{APP_NAME}</span>
    </div>
  );
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <section className="auth__brand" aria-hidden="true">
        <Logo />
        <div className="auth__pitch">
          <h2 className="auth__headline">Stay close to the people who matter.</h2>
          <p className="auth__lead">
            Real-time messaging, group chats and file sharing — all in one simple place.
          </p>
          <ul className="auth__features">
            {FEATURES.map((feature) => (
              <li key={feature.text}>
                <span className="auth__feature-icon">
                  <Icon name={feature.icon} size={18} />
                </span>
                {feature.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth__copyright">© {new Date().getFullYear()} {APP_NAME}</p>
      </section>

      <main className="auth__panel">
        <div className="auth__card">
          <div className="auth__mobile-logo">
            <Logo />
          </div>
          <h1 className="auth__title">{title}</h1>
          {subtitle && <p className="auth__subtitle">{subtitle}</p>}
          {children}
          {footer && <div className="auth__footer">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
