/* ============================================================
   app.js — the code that draws the page

   It reads the lists in data.js and turns them into HTML, then
   fetches live weather. Nothing here needs editing to add content;
   edit data.js for that.
   ============================================================ */

/* Orem, Utah. Four decimal places is about 30 feet — plenty. */
const LAT = 40.2969;
const LON = -111.6946;


/* ------------------------------------------------------------
   1. PROJECTS
   ------------------------------------------------------------ */

function drawProjects() {
  const list = document.getElementById("project-list");
  if (!list) return;

  // Build one <li> of HTML per project, then join them into one string.
  list.innerHTML = PROJECTS.map(function (p) {
    const cls = (p.status === "shipped" || p.status === "planned") ? p.status : "";
    return (
      '<li>' +
        '<span class="status ' + cls + '">' + escapeHtml(p.status) + '</span>' +
        '<span class="p-name">' + escapeHtml(p.name) + '</span>' +
        '<span class="p-note">' + escapeHtml(p.note) + '</span>' +
      '</li>'
    );
  }).join("");
}


/* ------------------------------------------------------------
   2. WHAT'S COMING UP
   Sorted by date, soonest first. Anything already past is dropped.
   ------------------------------------------------------------ */

function drawAgenda() {
  const list = document.getElementById("agenda-list");
  if (!list) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = AGENDA
    .filter(function (item) { return parseDate(item.date) >= today; })
    .sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); })
    .slice(0, 5); // the next five things, not a whole month grid

  if (upcoming.length === 0) {
    list.innerHTML = '<li><span class="a-date">—</span><span class="a-label">Nothing scheduled. Add something to AGENDA in data.js.</span></li>';
    return;
  }

  list.innerHTML = upcoming.map(function (item) {
    const d = parseDate(item.date);
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    return (
      '<li>' +
        '<span class="a-date">' + month + ' ' + day + '</span>' +
        '<span class="a-label">' + escapeHtml(item.label) +
          '<span class="a-src">' + escapeHtml(item.source) + '</span>' +
        '</span>' +
      '</li>'
    );
  }).join("");
}

/* "2026-09-22" -> a Date in local time.
   Built from the pieces on purpose: passing the raw string to new Date()
   makes some browsers treat it as UTC and show the wrong day. */
function parseDate(str) {
  const parts = str.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}


/* ------------------------------------------------------------
   3. WEATHER + SUNSET  (live, from someone else's computer)

   Open-Meteo needs no key and no signup. Sunset is the useful half:
   daylight is the work window for anything done outdoors, and it
   shrinks every week through the fall.
   ------------------------------------------------------------ */

function drawWeather() {
  const box = document.getElementById("weather");
  if (!box) return;

  const url = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + LAT +
    "&longitude=" + LON +
    "&current=temperature_2m,weather_code" +
    "&daily=sunset,temperature_2m_max,temperature_2m_min" +
    "&timezone=America%2FDenver" +
    "&temperature_unit=fahrenheit";

  fetch(url)
    .then(function (response) {
      if (!response.ok) throw new Error("Weather request failed: " + response.status);
      return response.json();
    })
    .then(function (data) {
      const temp = Math.round(data.current.temperature_2m);
      const sky = describeSky(data.current.weather_code);
      const hi = Math.round(data.daily.temperature_2m_max[0]);
      const lo = Math.round(data.daily.temperature_2m_min[0]);

      // Comes back as "2026-09-10T19:42" — just take the clock part.
      const sunsetRaw = data.daily.sunset[0];
      const sunsetClock = formatClock(sunsetRaw.split("T")[1]);
      const daylight = daylightLeft(sunsetRaw);

      box.innerHTML =
        '<p class="temp">' + temp + '&deg;</p>' +
        '<p class="sky">' + sky + '</p>' +
        '<div class="wrow"><span>High / Low</span><span>' + hi + '&deg; / ' + lo + '&deg;</span></div>' +
        '<div class="wrow"><span>Sunset</span><span>' + sunsetClock + '</span></div>' +
        '<div class="wrow"><span>Daylight left</span><span>' + daylight + '</span></div>';
    })
    .catch(function (err) {
      // Always show something. A silently empty panel looks broken.
      box.innerHTML = '<p class="muted small">Couldn\'t reach the weather service. It happens.</p>';
      console.error(err);
    });
}

/* WMO weather codes, grouped. The full table is longer; these cover Utah. */
function describeSky(code) {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code >= 95) return "Thunderstorms";
  return "—";
}

/* "19:42" -> "7:42 PM".
   Only the first two numbers are used, so "19:42:00" works too. */
function formatClock(hhmm) {
  const parts = hhmm.split(":");
  let h = Number(parts[0]);
  const m = String(parts[1]).replace(/\D/g, "").slice(0, 2).padStart(2, "0");
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return h + ":" + m + " " + suffix;
}

/* How much working light is left today. */
function daylightLeft(sunsetRaw) {
  const datePart = sunsetRaw.split("T")[0].split("-");
  const timePart = sunsetRaw.split("T")[1].split(":");
  const sunset = new Date(
    Number(datePart[0]), Number(datePart[1]) - 1, Number(datePart[2]),
    Number(timePart[0]), Number(timePart[1])
  );

  const minutes = Math.round((sunset - new Date()) / 60000);
  if (minutes <= 0) return "Dark";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return m + " min";
  return h + " hr " + m + " min";
}


/* ------------------------------------------------------------
   4. IDEA LOG

   Your seeds come from data.js. Anything a visitor types is kept in
   localStorage — their own browser, nobody else's. That's the honest
   limit of a site with no server: it can remember, but only for you.
   ------------------------------------------------------------ */

const STORE_KEY = "mk-ideas";

function readStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return []; // private windows and blocked storage both land here
  }
}

function writeStored(list) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch (err) {
    /* nothing to do — the page still works, it just won't remember */
  }
}

function drawIdeas() {
  const list = document.getElementById("idea-list");
  if (!list) return;

  const stored = readStored();

  const mine = IDEAS.map(function (text) {
    return '<li>' + escapeHtml(text) + '</li>';
  });

  const theirs = stored.map(function (text) {
    return '<li>' + escapeHtml(text) + '<span class="mine">yours</span></li>';
  });

  list.innerHTML = mine.concat(theirs).join("");
}

function wireIdeaForm() {
  const form = document.getElementById("idea-form");
  const input = document.getElementById("idea-input");
  if (!form || !input) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the browser reloading the page

    const text = input.value.trim();
    if (text === "") return;

    const stored = readStored();
    stored.push(text);
    writeStored(stored);

    input.value = "";
    drawIdeas();
  });
}


/* ------------------------------------------------------------
   Turn text into safe text. Anything a visitor types goes through
   this before it touches the page, so typed-in HTML renders as
   characters instead of running as code.
   ------------------------------------------------------------ */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


/* ------------------------------------------------------------
   Start everything once the HTML exists.
   ------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", function () {
  drawProjects();
  drawAgenda();
  drawWeather();
  drawIdeas();
  wireIdeaForm();
});
