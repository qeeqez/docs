export function normalizeInlineText(value: string | undefined) {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}
