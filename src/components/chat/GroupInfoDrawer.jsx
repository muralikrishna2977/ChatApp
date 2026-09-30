import { useEffect, useMemo, useState } from "react";
import { getErrorMessage, groupApi } from "../../api/index.js";
import { formatDateTime, microNow } from "../../utils/time.js";
import Avatar from "../ui/Avatar.jsx";
import Drawer from "../ui/Drawer.jsx";
import Icon from "../ui/Icon.jsx";
import Spinner from "../ui/Spinner.jsx";
import MemberPicker from "./MemberPicker.jsx";
import "./Panels.scss";

function RenameForm({ group, onRenamed, onDone }) {
  const [draft, setDraft] = useState(group.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const name = draft.trim();
    if (!name) {
      setError("Name cannot be empty.");
      return;
    }
    if (name === group.name) {
      onDone();
      return;
    }
    setSaving(true);
    try {
      await groupApi.rename(group.id, name);
      onRenamed(group.id, name);
      onDone();
    } catch (err) {
      setError(getErrorMessage(err, "Could not rename the group."));
      setSaving(false);
    }
  }

  return (
    <form className="panel__inline-form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">Group name</span>
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
        <button type="button" className="btn btn--ghost btn--sm" onClick={onDone} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
          {saving && <Spinner size="sm" label="Saving" />}
          Save
        </button>
      </div>
    </form>
  );
}

// Right drawer with group details, members, rename and add-members.
export default function GroupInfoDrawer({ group, contacts, onClose, onRenamed, onNotify }) {
  const [createdAt, setCreatedAt] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [savingMembers, setSavingMembers] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const memberIds = useMemo(() => new Set(members.map((m) => m.friend_id)), [members]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([groupApi.info(group.id), groupApi.members(group.id)])
      .then(([info, list]) => {
        if (cancelled) return;
        setCreatedAt(info.groupinfo?.created_at ?? null);
        setMembers(list.groupMembers ?? []);
        setLoadError("");
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getErrorMessage(err, "Could not load group details."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [group.id, reloadToken]);

  function toggleMember(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleAddMembers() {
    if (selected.size === 0) return;
    setSavingMembers(true);
    try {
      await groupApi.addMembers(group.id, [...selected], microNow());
      onNotify(`${selected.size} member${selected.size > 1 ? "s" : ""} added`, "success");
      setSelected(new Set());
      setAdding(false);
      setReloadToken((t) => t + 1);
    } catch (err) {
      onNotify(getErrorMessage(err, "Could not add members."));
    } finally {
      setSavingMembers(false);
    }
  }

  return (
    <Drawer side="right" title="Group info" onClose={onClose}>
      <div className="panel">
        <div className="panel__hero">
          <Avatar name={group.name} size="xl" shape="square" />
          {renaming ? (
            <RenameForm group={group} onRenamed={onRenamed} onDone={() => setRenaming(false)} />
          ) : (
            <>
              <div className="panel__name-row">
                <span className="panel__name">{group.name}</span>
                <button
                  type="button"
                  className="icon-btn icon-btn--sm"
                  onClick={() => setRenaming(true)}
                  aria-label="Rename group"
                  title="Rename group"
                >
                  <Icon name="pencil" size={16} />
                </button>
              </div>
              {createdAt && (
                <span className="panel__muted">Created {formatDateTime(createdAt)}</span>
              )}
            </>
          )}
        </div>

        {loading && members.length === 0 ? (
          <div className="panel__loading">
            <Spinner size="lg" label="Loading group" />
          </div>
        ) : loadError ? (
          <div className="alert alert--error" role="alert">
            <Icon name="alertCircle" size={16} />
            {loadError}
          </div>
        ) : adding ? (
          <div className="panel__section">
            <div className="panel__section-header">
              <span className="panel__section-title">Add members</span>
              <span className="panel__muted">{selected.size} selected</span>
            </div>
            <MemberPicker
              contacts={contacts}
              selected={selected}
              onToggle={toggleMember}
              lockedIds={memberIds}
            />
            <div className="panel__actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  setAdding(false);
                  setSelected(new Set());
                }}
                disabled={savingMembers}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={handleAddMembers}
                disabled={savingMembers || selected.size === 0}
              >
                {savingMembers && <Spinner size="sm" label="Adding members" />}
                Add to group
              </button>
            </div>
          </div>
        ) : (
          <div className="panel__section">
            <div className="panel__section-header">
              <span className="panel__section-title">{members.length} members</span>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => setAdding(true)}
              >
                <Icon name="userPlus" size={16} />
                Add
              </button>
            </div>
            <ul className="member-list">
              {members.map((member) => (
                <li key={member.friend_id} className="member">
                  <Avatar name={member.friend_name} size="sm" />
                  <span className="member__body">
                    <span className="member__name">{member.friend_name}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Drawer>
  );
}
