/** Validate parsed JSON BEFORE it reaches the template engine.
 * Syntax parsing alone does not check our application's required fields or citations.
 * Error paths help the maintainer locate the invalid record without rendering it.
 */
export function validateData(data) {
  function require(condition, message) {
    if (!condition) throw new Error(`Invalid archive data: ${message}`);
  }
  function text(value, path, optional = false) {
    require(typeof value === "string" &&
      (optional || value.trim().length > 0) &&
      value.length <= 2500, `${path} must be text`);
  }
  function records(items, name) {
    require(Array.isArray(items) &&
      items.length > 0 &&
      items.length <= 100, `${name} must be a non-empty array (max 100)`);
    const ids = new Set();
    items.forEach((item, i) => {
      require(item &&
        typeof item === "object" &&
        !Array.isArray(item), `${name}[${i}] must be an object`);
      text(item.id, `${name}[${i}].id`);
      require(/^[a-z][a-z0-9-]*$/.test(
        item.id,
      ), `${name}[${i}].id must be a safe anchor`);
      require(!ids.has(item.id), `${name} has duplicate id ${item.id}`);
      ids.add(item.id);
    });
    return ids;
  }
  require(data &&
    typeof data === "object" &&
    !Array.isArray(data), "root must be an object");
  const sourceIds = records(data.sources, "sources");
  records(data.milestones, "milestones");
  records(data.statistics, "statistics");
  data.sources.forEach((s, i) => {
    [
      "publisher",
      "date",
      "title",
      "url",
      "supports",
      "kind",
      "accessed",
    ].forEach((k) => text(s[k], `sources[${i}].${k}`));
    let url;
    try {
      url = new URL(s.url);
    } catch {
      throw new Error(`Invalid archive data: sources[${i}].url is malformed`);
    }
    require(url.protocol === "https:" &&
      !url.username &&
      !url.password, `sources[${i}].url must be HTTPS without credentials`);
    const accessedTime = Date.parse(s.accessed);
    // Parsing can normalise 31 April to 1 May; round-tripping rejects that.
    require(/^\d{4}-\d{2}-\d{2}$/.test(s.accessed) &&
      Number.isFinite(accessedTime) &&
      new Date(accessedTime).toISOString().slice(0, 10) === s.accessed,
      `sources[${i}].accessed must be a real ISO calendar date`);
  });
  data.milestones.forEach((m, i) => {
    require(Number.isInteger(m.year) &&
      m.year >= 1997 &&
      m.year <= 2025, `milestones[${i}].year must be 1997–2025`);
    ["title", "body", "category", "sourceId"].forEach((k) =>
      text(m[k], `milestones[${i}].${k}`),
    );
    text(m.note, `milestones[${i}].note`, true);
    require(sourceIds.has(
      m.sourceId,
    ), `milestones[${i}].sourceId has no matching source`);
  });
  data.statistics.forEach((s, i) => {
    text(s.label, `statistics[${i}].label`);
    text(s.sourceId, `statistics[${i}].sourceId`);
    require(typeof s.value === "number" &&
      Number.isFinite(s.value) &&
      s.value >= 0 &&
      s.value <=
        100, `statistics[${i}].value must be a percentage from 0 to 100`);
    require(sourceIds.has(
      s.sourceId,
    ), `statistics[${i}].sourceId has no matching source`);
  });
  return data;
}
