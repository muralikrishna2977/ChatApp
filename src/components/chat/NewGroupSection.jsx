import { useState } from "react";
import { getErrorMessage, groupApi } from "../../api/index.js";
import { microNow } from "../../utils/time.js";
import Icon from "../ui/Icon.jsx";
import Spinner from "../ui/Spinner.jsx";
import MemberPicker from "./MemberPicker.jsx";

export default function NewGroupSection({ selfId, contacts, onCreated }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleMember(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const groupName = name.trim();
    if (!groupName) {
      setError("Please enter a group name.");
      return;
    }
    if (selected.size === 0) {
      setError("Select at least one member.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const { groupid } = await groupApi.create(groupName, selfId, microNow());
      await groupApi.addMembers(groupid, [selfId, ...selected], microNow());
      onCreated({ groupid: String(groupid), name: groupName });
    } catch (err) {
      setError(getErrorMessage(err, "Could not create the group."));
      setSubmitting(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">Group name</span>
        <input
          className="input"
          placeholder="e.g. Weekend plans"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          autoFocus
          disabled={submitting}
        />
      </label>

      <div className="panel__section">
        <div className="panel__section-header">
          <span className="panel__section-title">Members</span>
          <span className="panel__muted">{selected.size} selected</span>
        </div>
        <MemberPicker
          contacts={contacts}
          selected={selected}
          onToggle={toggleMember}
          emptyText="Add some contacts first — then you can create a group with them."
        />
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          <Icon name="alertCircle" size={16} />
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn--primary btn--block"
        disabled={submitting || contacts.length === 0}
      >
        {submitting && <Spinner size="sm" label="Creating group" />}
        Create group
      </button>
    </form>
  );
}
