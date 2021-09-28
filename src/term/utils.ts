export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/ /g, "&nbsp;")
    .replace(/'/g, "&#039;");
}

export function replaceLineBreak(str: string): string {
  return str.replace(/\n/g, "<br>");
}
