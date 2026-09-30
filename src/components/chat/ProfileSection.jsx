import { useState } from "react";
import { getErrorMessage, userApi } from "../../api/index.js";
import Avatar from "../ui/Avatar.jsx";
import Icon from "../ui/Icon.jsx";
import Spinner from "../ui/Spinner.jsx";

export default function ProfileSection({ email, displayName, onRenamed }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEditing() {
    setDraft(displayName);
    setError("");
    setEditing(true);
  }

  async function handleSave(event) {
    event.preventDefault();
    const name = draft.trim();
    if (!name) {
      setError("Name cannot be empty.");
      return;
    }
    if (name === displayName) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await userApi.rename(name);
      onRenamed(name);
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err, "Could not update your name."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="panel">
      <div className="panel__hero">
        <Avatar name={displayName} size="xl" />

        {editing ? (
          <form className="panel__inline-form" onSubmit={handleSave}>
            <label className="field">
              <span className="field__label">Display name</span>
              <input
                className="input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={60}
                autoFocus
                disabled={saving}
              />
            </label>
            {error && (
              <div className="alert alert--error" role="alert">
                <Icon name="alertCircle" size={16} />
                {error}
              </div>
            )}
            <div className="panel__actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                {saving && <Spinner size="sm" label="Saving" />}
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="panel__name-row">
            <span className="panel__name">{displayName}</span>
            <button
              type="button"
              className="icon-btn icon-btn--sm"
              onClick={startEditing}
              aria-label="Edit name"
              title="Edit name"
            >
              <Icon name="pencil" size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="panel__card">
        <span className="panel__card-label">Email</span>
        <span>{email}</span>
      </div>
    </div>
  );
}
