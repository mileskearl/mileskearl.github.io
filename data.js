/* ============================================================
   data.js — THIS IS THE FILE YOU EDIT MOST

   Everything on the site that changes lives here, separated from
   the HTML (structure) and the CSS (looks). This split is the whole
   point: to add a project you edit a list, not a page.

   Rules for this file:
   - Keep the commas between items.
   - Keep the quotes around text.
   - Never put an address, a phone number, or where you'll be at a
     given time in here. This file is public, forever, in git history.
   ============================================================ */


/* ---- Projects -------------------------------------------------
   status can be:  "building"  |  "shipped"  |  "planned"
   Anything else falls back to the copper "building" style.       */

const PROJECTS = [
  {
    name: "This website",
    status: "building",
    note: "Sketched it on paper first. Live at a real domain."
  },
  {
    name: "The idea log",
    status: "building",
    note: "A running list of things that seem broken. Scroll down."
  },
  {
    name: "Pick a business to start",
    status: "planned",
    note: "Something new rather than a service that already exists."
  }
];


/* ---- What's coming up -----------------------------------------
   date:   write it as "YYYY-MM-DD" so it sorts correctly
   label:  what it is
   source: which part of your life it belongs to

   Do NOT list anything that says where you personally will be at a
   specific time. Milestones and deadlines only.                   */

const AGENDA = [
  {
    date: "2026-09-22",
    label: "Choose which business to actually start",
    source: "Internship"
  },
   {
    date: "2026-09-19",
    label: "Homecoming",
    source: "Timpview"
  },
  {
    date: "2026-10-13",
    label: "End of Term",
    source: "Timpview"
  },
    date: "2026-12-18",
    label: "Present the whole thing to the After team",
    source: "Internship"
  }
];


/* ---- Idea log seeds -------------------------------------------
   Your own entries. Anything a visitor adds is saved only in their
   own browser — this site has no server yet.                      */

const IDEAS = [
  "Nobody under 18 can open a business bank account without dragging a parent in."
];
