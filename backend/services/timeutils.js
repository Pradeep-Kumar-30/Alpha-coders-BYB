export function diffInMinutes(now, timestamp) {
  return Math.floor((now - new Date(timestamp)) / 60000);
}

export function getTimeBucket(timestamp) {
  const hour = new Date(timestamp).getHours();

  if (hour >= 6 && hour < 18) return "day";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}
