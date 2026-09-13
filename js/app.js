import { renderTemplate } from "./template-engine.js";
import { validateData } from "./validate-data.js";
import { startGlobe } from "./globe.js";

const targets = [
  ...document.querySelectorAll(
    "#home-stats, #timeline-list, #access-bars, #source-list",
  ),
];
const eraFor = (year) =>
  year < 2010 ? "early" : year < 2020 ? "mobile" : "today";
const eraNames = {
  early: "SHARED SCREENS",
  mobile: "A MOBILE COUNTRY",
  today: "THE LAST MILE",
};

function renderInto(target, templateId, records) {
  const template = document.getElementById(templateId).innerHTML;
  // Only validated, escaped records are inserted; HTML structure is authored locally.
  target.innerHTML = records
    .map((record) => renderTemplate(template, record))
    .join("");
}

async function loadArchive() {
  if (!targets.length) return;
  try {
    const response = await fetch("./data/content.json");
    if (!response.ok)
      throw new Error(`Archive request failed (${response.status})`);
    const data = validateData(await response.json());
    const sourceMap = new Map(data.sources.map((s) => [s.id, s]));
    const stats = data.statistics.map((s) => ({
      ...s,
      display: s.value.toFixed(1),
    }));
    const homeStats = document.getElementById("home-stats");
    if (homeStats)
      renderInto(
        homeStats,
        "stat-template",
        stats.filter((s) => ["national", "lima", "rural"].includes(s.id)),
      );
    const bars = document.getElementById("access-bars");
    if (bars) renderInto(bars, "bar-template", stats);
    const sources = document.getElementById("source-list");
    if (sources) {
      renderInto(sources, "source-template", data.sources);
      // The anchor may not exist until asynchronous source rendering finishes.
      if (location.hash) {
        let target;
        try {
          target = document.getElementById(
            decodeURIComponent(location.hash.slice(1)),
          );
        } catch {
          target = null;
        } // An invalid URL fragment must not hide valid archive data.
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.scrollIntoView({ behavior: "instant" });
        }
      }
    }
    const timeline = document.getElementById("timeline-list");
    if (timeline) {
      const milestones = [...data.milestones]
        .sort((a, b) => a.year - b.year)
        .map((m) => ({
          ...m,
          age: m.year - 1997,
          era: eraFor(m.year),
          eraLabel: eraNames[eraFor(m.year)],
          sourceUrl: `about.html#${m.sourceId}`,
          sourceLabel: `Source: ${sourceMap.get(m.sourceId).publisher}`,
        }));
      const parameters = new URLSearchParams(location.search);
      let era = ["early", "mobile", "today"].includes(parameters.get("era"))
        ? parameters.get("era")
        : "all";
      const search = document.getElementById("search");
      const buttons = [...document.querySelectorAll("[data-era]")];
      const normalise = (s) =>
        s
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      function update() {
        const query = normalise(search.value.trim());
        const visible = milestones.filter(
          (m) =>
            (era === "all" || m.era === era) &&
            normalise(`${m.year} ${m.title} ${m.body} ${m.category}`).includes(
              query,
            ),
        );
        buttons.forEach((b) =>
          b.setAttribute("aria-pressed", String(b.dataset.era === era)),
        );
        if (visible.length) renderInto(timeline, "milestone-template", visible);
        else {
          timeline.innerHTML =
            '<p class="empty-state">No milestones match your search. Try another word or select “All years”.</p>';
        }
        document.getElementById("result-count").textContent =
          `${visible.length} OF ${milestones.length} MILESTONES · AGE = YEARS SINCE 1997 (APPROXIMATE)`;
      }
      buttons.forEach((button) =>
        button.addEventListener("click", () => {
          era = button.dataset.era;
          const url = new URL(location.href);
          if (era === "all") url.searchParams.delete("era");
          else url.searchParams.set("era", era);
          history.replaceState(null, "", url);
          update();
        }),
      );
      search.addEventListener("input", update);
      update();
    }
  } catch (error) {
    console.error("Could not load archive:", error);
    targets.forEach((target) => {
      target.replaceChildren();
      const message = document.createElement("p");
      message.className = "error-state";
      message.setAttribute("role", "alert");
      message.textContent =
        "The archive could not be loaded. Please refresh and try again. If you opened a downloaded copy, run it with VS Code Live Server or npm start.";
      target.append(message);
    });
  }
}
loadArchive();
const canvas = document.getElementById("globe");
if (canvas) startGlobe(canvas, document.getElementById("motion-toggle"));
