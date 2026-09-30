export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

// Deterministic hue so a given name always gets the same avatar color.
function nameToHue(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

export function avatarColor(name) {
  return `hsl(${nameToHue(name)} 55% 48%)`;
}

export function fileKind(fileType) {
  if (!fileType) return "file";
  if (fileType.startsWith("image/")) return "image";
  if (fileType.startsWith("video/")) return "video";
  if (fileType === "application/pdf") return "pdf";
  return "file";
}

const ATTACHMENT_LABELS = { image: "Photo", video: "Video", pdf: "PDF", file: "Document" };

export function attachmentLabel(fileType) {
  return ATTACHMENT_LABELS[fileKind(fileType)];
}

export function replyPreviewText(reply) {
  if (!reply) return "";
  if (reply.fileType) {
    const label = attachmentLabel(reply.fileType);
    return reply.text ? `${label} · ${reply.text}` : label;
  }
  return reply.text || "";
}

// Older replies stored "You" literally; newer ones carry the author's id.
export function replyAuthor(reply, selfId) {
  if (!reply) return "";
  if (reply.senderId && reply.senderId === selfId) return "You";
  return reply.senderName || "Unknown";
}
