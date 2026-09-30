import { useState } from "react";
import { contactApi, getErrorMessage, userApi } from "../../api/index.js";
import Icon from "../ui/Icon.jsx";
import Spinner from "../ui/Spinner.jsx";

export default function AddContactSection({ selfId, selfEmail, contacts, onAdded }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { tone: "error" | "success", text }

  async function handleSubmit(event) {
    event.preventDefault();
    const target = email.trim();
    if (target.toLowerCase() === selfEmail?.toLowerCase()) {
      setStatus({ tone: "error", text: "You can't add yourself as a contact." });
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const { contacts: matches = [] } = await userApi.findByEmail(target);
      if (matches.length === 0) {
        setStatus({ tone: "error", text: "No user found with that email address." });
        return;
      }

      const friendId = String(matches[0]._id);
      const friendName = matches[0].name;
      if (contacts.some((c) => c.friend_id === friendId)) {
        setStatus({ tone: "error", text: `${friendName} is already in your contacts.` });
        return;
      }

      await contactApi.add(selfId, friendId, friendName);
      onAdded({ friend_id: friendId, friend_name: friendName });
      setStatus({ tone: "success", text: `${friendName} was added to your contacts.` });
      setEmail("");
    } catch (err) {
      setStatus({ tone: "error", text: getErrorMessage(err, "Could not add this contact.") });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <div className="panel__intro">
        <span className="panel__intro-icon">
          <Icon name="userPlus" />
        </span>
        Enter the email address your friend used to sign up.
      </div>

      <form className="panel__form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Email address</span>
          <input
            className="input"
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            disabled={submitting}
          />
        </label>

        {status && (
          <div className={`alert alert--${status.tone}`} role="status">
            <Icon name={status.tone === "error" ? "alertCircle" : "checkCircle"} size={16} />
            {status.text}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting && <Spinner size="sm" label="Adding contact" />}
          Add contact
        </button>
      </form>
    </div>
  );
}
