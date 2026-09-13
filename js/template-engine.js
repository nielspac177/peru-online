/**
 * A small, dependency-free template engine, following the course's Topic 6 approach.
 * HTML stays in <template> elements; JSON provides plain values. This engine
 * deliberately supports escaped {{field}} interpolation only, never executable code.
 */
export function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
export function renderTemplate(template, record) {
  return template.replace(/{{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*}}/g, (_, key) => {
    if (!Object.hasOwn(record, key))
      throw new Error(`Missing template field: ${key}`);
    if (!["string", "number", "boolean"].includes(typeof record[key]))
      throw new Error(`Template field must be a primitive: ${key}`);
    return escapeHTML(record[key]);
  });
}
