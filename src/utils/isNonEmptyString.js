export default function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}