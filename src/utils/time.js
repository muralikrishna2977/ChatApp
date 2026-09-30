// The server stores timestamps as microsecond epochs serialized as strings.

export function microNow() {
  return (BigInt(Date.now()) * BigInt(1000)).toString();
}

function toDate(microEpoch) {
  return new Date(Number(microEpoch) / 1000);
}

export function microDiff(a, b) {
  return Number(a) - Number(b);
}

export function formatTime(microEpoch) {
  return toDate(microEpoch).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatDateTime(microEpoch) {
  return toDate(microEpoch).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export function isSameDay(a, b) {
  return toDate(a).toDateString() === toDate(b).toDateString();
}

export function formatDayLabel(microEpoch) {
  const date = toDate(microEpoch);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}
