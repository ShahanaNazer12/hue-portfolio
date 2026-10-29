export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}
export function cleanText(value, max = 2000) {
  return String(value || '').trim().slice(0, max);
}
