/* =========================================================
   Escape the Carceri — game logic
   16 rooms, one per plate of Le Carceri d'Invenzione (1761).
   Pure client-side. No storage. No analytics. No network calls.
   ========================================================= */

(function () {
  "use strict";

  // ---------- PLATE DICTIONARY (single source of truth, used by game + gallery) ----------
  // Curatorial titles applied later by museums; Piranesi did not title the plates.
  const PLATES = {
    I:    { num: "I",    img: "assets/p01_title_page.jpg",          thumb: "assets/thumbs/p01_title_page.jpg",          title: "The Title Plate",                date: "1761", source: "LACMA 46.27.1",   sourceUrl: "https://commons.wikimedia.org/wiki/File:Title_Page_LACMA_46.27.1.jpg",          note: "Frontispiece for the second edition. Piranesi's etched cartouche names the series Carceri d'Invenzione." },
    II:   { num: "II",   img: "assets/p02_man_on_the_rack.jpg",     thumb: "assets/thumbs/p02_man_on_the_rack.jpg",     title: "The Man on the Rack",            date: "1761", source: "LACMA 46.27.2",   sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Man_on_the_Rack_LACMA_46.27.2.jpg", note: "One of the two new plates added in 1761. A figure is stretched on a wooden device of restraint." },
    III:  { num: "III",  img: "assets/p03_round_tower.jpg",         thumb: "assets/thumbs/p03_round_tower.jpg",         title: "The Round Tower",                date: "1761", source: "LACMA 46.27.3",   sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Round_Tower_LACMA_46.27.3.jpg",     note: "A vast cylindrical tower dominates the right of the chamber." },
    IV:   { num: "IV",   img: "assets/p04_grand_piazza.jpg",        thumb: "assets/thumbs/p04_grand_piazza.jpg",        title: "The Grand Piazza",               date: "1761", source: "LACMA 46.27.4",   sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Grand_Piazza_LACMA_46.27.4.jpg",    note: "An enormous open hall whose scale dwarfs the small figures on its galleries." },
    V:    { num: "V",    img: "assets/p05_lion_bas_reliefs.jpg",    thumb: "assets/thumbs/p05_lion_bas_reliefs.jpg",    title: "The Lion Bas-Reliefs",           date: "1761", source: "LACMA 46.27.5",   sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Lion_Bas-Reliefs_LACMA_46.27.5.jpg", note: "The other new plate of the 1761 edition. Carved lions appear in low relief on the masonry." },
    VI:   { num: "VI",   img: "assets/p06_smoking_fire.jpg",        thumb: "assets/thumbs/p06_smoking_fire.jpg",        title: "The Smoking Fire",               date: "1761", source: "LACMA 46.27.6",   sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Smoking_Fire_LACMA_46.27.6.jpg",    note: "Smoke curls from a low fire, drifting into the vault." },
    VII:  { num: "VII",  img: "assets/p07_drawbridge.jpg",          thumb: "assets/thumbs/p07_drawbridge.jpg",          title: "The Drawbridge",                 date: "1761", source: "Google Art Project / Wikimedia Commons", sourceUrl: "https://commons.wikimedia.org/wiki/File:Giovanni_Battista_Piranesi_-_The_Drawbridge_-_Google_Art_Project.jpg", note: "Wooden bridges and spiral staircases connect piers and arcades far into the distance." },
    VIII: { num: "VIII", img: "assets/p08_staircase_trophies.jpg",  thumb: "assets/thumbs/p08_staircase_trophies.jpg",  title: "The Staircase with Trophies",    date: "1761", source: "LACMA 46.27.8",   sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Staircase_with_Trophies_LACMA_46.27.8.jpg", note: "A grand staircase rises past wall-mounted trophies of arms and armor." },
    IX:   { num: "IX",   img: "assets/p09_giant_wheel.jpg",         thumb: "assets/thumbs/p09_giant_wheel.jpg",         title: "The Giant Wheel",                date: "1761", source: "LACMA 46.27.9",   sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Giant_Wheel_LACMA_46.27.9.jpg",     note: "An enormous wheel looms over the chamber — engineering at impossible scale." },
    X:    { num: "X",    img: "assets/p10_prisoners_platform.jpg",  thumb: "assets/thumbs/p10_prisoners_platform.jpg",  title: "Prisoners on a Projecting Platform", date: "1761", source: "LACMA 46.27.10", sourceUrl: "https://commons.wikimedia.org/wiki/File:Prisoners_on_a_Projecting_Platform_LACMA_46.27.10.jpg", note: "Bound figures stand on a stone platform that juts into the void." },
    XI:   { num: "XI",   img: "assets/p11_arch_with_shell.jpg",     thumb: "assets/thumbs/p11_arch_with_shell.jpg",     title: "The Arch with a Shell Ornament", date: "1761", source: "LACMA 46.27.11",  sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Arch_with_a_Shell_Ornament_LACMA_46.27.11.jpg", note: "A massive arch is decorated with a carved shell motif at its keystone." },
    XII:  { num: "XII",  img: "assets/p12_sawhorse.jpg",            thumb: "assets/thumbs/p12_sawhorse.jpg",            title: "The Sawhorse",                   date: "1761", source: "LACMA 46.27.12",  sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Sawhorse_LACMA_46.27.12.jpg",       note: "A heavy wooden sawhorse sits at the center of the prison floor." },
    XIII: { num: "XIII", img: "assets/p13_well.jpg",                thumb: "assets/thumbs/p13_well.jpg",                title: "The Well",                       date: "1761", source: "LACMA 46.27.13",  sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Well_LACMA_46.27.13.jpg",           note: "A deep masonry well opens at the foot of vast stairs." },
    XIV:  { num: "XIV",  img: "assets/p14_gothic_arch.jpg",         thumb: "assets/thumbs/p14_gothic_arch.jpg",         title: "The Gothic Arch",                date: "1761", source: "LACMA 46.27.14",  sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Gothic_Arch_LACMA_46.27.14.jpg",    note: "A pointed Gothic arch frames the deepest reaches of the chamber." },
    XV:   { num: "XV",   img: "assets/p15_pier_with_lamp.jpg",      thumb: "assets/thumbs/p15_pier_with_lamp.jpg",      title: "The Pier with a Lamp",           date: "1761", source: "LACMA 46.27.15",  sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Pier_with_a_Lamp_LACMA_46.27.15.jpg", note: "A hanging lamp illuminates a heavy stone pier." },
    XVI:  { num: "XVI",  img: "assets/p16_pier_with_chains.jpg",    thumb: "assets/thumbs/p16_pier_with_chains.jpg",    title: "The Pier with Chains",           date: "1761", source: "LACMA 46.27.16",  sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Pier_with_Chains_LACMA_46.27.16.jpg", note: "Heavy iron chains hang from a stone pier — the final image in the series." }
  };
  // expose for gallery rendering
  window.__PLATES = PLATES;

  // ---------- ROOM DEFINITIONS ----------
  // Each room references a plate via its Roman numeral.
  // Difficulty rises gently: 1–4 easy, 5–10 medium, 11–16 harder.

  const ROOMS = [
    // ROOM 1 — Plate I — read the inscription
    {
      plate: "I", type: "mc",
      eyebrow: "Room 1 · The Title Plate",
      title: "Read the inscription",
      prompt: "Look closely at the cartouche on the wall. Piranesi etched the series' title into the stone. <strong>Which Italian word, visible on the plate, names what these prisons are?</strong>",
      choices: [
        { text: "ROMA — 'Rome.'", correct: false },
        { text: "INVENZIONE — 'invention.'", correct: true },
        { text: "PALAZZO — 'palace.'", correct: false },
        { text: "ANTICHITÀ — 'antiquities.'", correct: false }
      ],
      hint: "The full title etched on the plate is Carceri d'Invenzione. Find the second word.",
      onCorrect: "Yes. Carceri d'Invenzione — prisons of invention. The architecture you're about to walk through was never built."
    },

    // ROOM 2 — Plate III — identify form
    {
      plate: "III", type: "mc",
      eyebrow: "Room 2 · A Familiar Shape",
      title: "Identify the structure",
      prompt: "Curators titled this plate after the dominant architectural form on the right. <strong>What is it?</strong>",
      choices: [
        { text: "A round tower.", correct: true },
        { text: "A drawbridge across a moat.", correct: false },
        { text: "A pointed Gothic arch.", correct: false },
        { text: "A rectangular courtyard.", correct: false }
      ],
      hint: "Look for the cylinder rising up the right side of the etching.",
      onCorrect: "Right. Curators call this one The Round Tower."
    },

    // ROOM 3 — Plate IV — Grand Piazza: read the bridge
    {
      plate: "IV", type: "mc",
      eyebrow: "Room 3 · Across the Hall",
      title: "What spans the middle of the chamber?",
      prompt: "A colossal stone arch frames the view. Halfway up, something stretches all the way across the open hall. <strong>What is it?</strong>",
      choices: [
        { text: "A long suspended bridge, its face decorated with carved bas-relief panels.", correct: true },
        { text: "A row of empty prison cells with iron bars.", correct: false },
        { text: "A spiral staircase coiling up to the ceiling.", correct: false },
        { text: "A wide curtain of falling water.", correct: false }
      ],
      hint: "Look at the horizontal band cutting across the middle of the arch. Notice the carved panels along its side.",
      onCorrect: "Right. A bridge crosses the entire piazza, its flank lined with sculpted reliefs. Curators call this one The Grand Piazza."
    },

    // ROOM 4 — Plate VIII — staircase with trophies (read the diagonal)
    {
      plate: "VIII", type: "mc",
      eyebrow: "Room 4 · Staircase",
      title: "How does the eye climb this scene?",
      prompt: "One element dominates the right side of the plate and pulls the eye upward. <strong>What is it?</strong>",
      choices: [
        { text: "A heavy spiral staircase coiling around a central pillar.", correct: false },
        { text: "A long straight staircase rising diagonally from lower left to upper right.", correct: true },
        { text: "A rope ladder dropped from the ceiling.", correct: false },
        { text: "A row of identical arched doorways at ground level.", correct: false }
      ],
      hint: "Trace the strongest diagonal line in the picture.",
      onCorrect: "Right. The Staircase with Trophies — a single great flight of steps cuts across the chamber, lined with martial ornament."
    },

    // ROOM 5 — Plate II — sequence: order means of restraint
    {
      plate: "II", type: "sequence",
      eyebrow: "Room 5 · Reading Confinement",
      title: "Order the means of restraint",
      prompt: "Piranesi's prisons stack devices of confinement. <strong>Click these in order</strong>, from the lightest restraint to the most severe, as the Carceri depict.",
      items: [
        { text: "An open arch you could walk under.", rank: 1 },
        { text: "A heavy chain hanging from a wall.", rank: 2 },
        { text: "A wooden rack that holds a body still.", rank: 3 }
      ],
      hint: "Think about how much each removes a person's ability to move.",
      onCorrect: "Right. The Carceri escalate restraint: passage, then bondage, then the body itself fixed by machinery. The Man on the Rack is the most severe."
    },

    // ROOM 6 — Plate VI — image-choice (clue→plate)
    {
      plate: "VI", type: "image-choice",
      eyebrow: "Room 6 · Match the Clue",
      title: "Choose the right plate",
      prompt: "Below are four plates from the Carceri. <strong>Pick the one that fits the clue.</strong><br/><br/>Clue: <em>“Smoke rises from a low fire near the front of the chamber.”</em>",
      choices: [
        { plate: "III", correct: false },
        { plate: "VI",  correct: true  },
        { plate: "XIV", correct: false },
        { plate: "XVI", correct: false }
      ],
      hint: "Trust the clue. Look for curling smoke, not architecture.",
      onCorrect: "Found it. Curators titled this plate The Smoking Fire after the curling smoke at the lower left."
    },

    // ROOM 7 — Plate V — hotspot: find the lions
    {
      plate: "V", type: "hotspot",
      eyebrow: "Room 7 · Look Closely",
      title: "Find what gives this plate its name",
      prompt: "This plate is titled after two carved beasts that guard the chamber. <strong>Click anywhere on either lion.</strong>",
      // hotspot grid: 4×3 cells (12), numbered left-to-right, top-to-bottom.
      // Bottom row = cells 9 (left), 10, 11, 12 (right). The two lions sit in cells 10 and 11.
      grid: { cols: 4, rows: 3, correct: [10, 11] },
      hint: "The lions are large free-standing sculptures along the bottom of the image, flanking the foreground.",
      onCorrect: "Yes. The Lion Bas-Reliefs — two carved beasts guarding the foreground of the chamber."
    },

    // ROOM 8 — Plate VII — title-cloze
    {
      plate: "VII", type: "cloze", concealCaption: true,
      eyebrow: "Room 8 · Name the Plate",
      title: "Fill in the title",
      promptTemplate: "Curators gave this plate the title: <strong>“The ____.”</strong> Pick the missing word.",
      cloze: [
        { text: "Drawbridge", correct: true },
        { text: "Cathedral", correct: false },
        { text: "Aqueduct",   correct: false },
        { text: "Courtyard",  correct: false }
      ],
      hint: "Look for the wooden span connecting two piers across open space.",
      onCorrect: "Right. The Drawbridge — wooden bridges and spiral stairs threading across the void."
    },

    // ROOM 9 — Plate IX — title→plate
    {
      plate: "IX", type: "mc", concealCaption: true,
      eyebrow: "Room 9 · Title to Plate",
      title: "Match the title",
      prompt: "This room's plate is built around a single immense object. <strong>Which curatorial title fits what dominates the picture?</strong>",
      choices: [
        { text: "The Lion Bas-Reliefs.", correct: false },
        { text: "The Gothic Arch.",      correct: false },
        { text: "The Giant Wheel.",      correct: true  },
        { text: "The Pier with Chains.", correct: false }
      ],
      hint: "It's a piece of machinery, far larger than any human body in the print.",
      onCorrect: "Yes. The Giant Wheel — engineering at impossible scale, looming over tiny figures."
    },

    // ROOM 10 — Plate X — read figures
    {
      plate: "X", type: "mc", concealCaption: true,
      eyebrow: "Room 10 · Reading the Figures",
      title: "Who stands on the platform?",
      prompt: "A stone platform juts into the chamber. <strong>What is happening to the figures on it?</strong>",
      choices: [
        { text: "They are dancing in a procession.", correct: false },
        { text: "They are bound prisoners on display.", correct: true },
        { text: "They are workers operating a machine.", correct: false },
        { text: "They are visitors on a tour.", correct: false }
      ],
      hint: "Look for ropes, chains, or restrained postures.",
      onCorrect: "Right. Prisoners on a Projecting Platform — the human cost of the Carceri shown in plain view."
    },

    // ROOM 11 — Plate XI — read the foreground structure
    {
      plate: "XI", type: "mc",
      eyebrow: "Room 11 · Crossing the Void",
      title: "What carries traffic across the chamber?",
      prompt: "A long wooden structure cuts across the foreground of this plate. <strong>What is it?</strong>",
      choices: [
        { text: "A long inclined staircase running diagonally across the scene.", correct: true },
        { text: "A row of stone benches.", correct: false },
        { text: "A circular fountain.", correct: false },
        { text: "A herd of chained animals.", correct: false }
      ],
      hint: "Trace the strongest diagonal line in the lower half of the picture.",
      onCorrect: "Right. A great wooden staircase carries figures across the void beneath the arch."
    },

    // ROOM 12 — Plate XII — read the platform
    {
      plate: "XII", type: "mc",
      eyebrow: "Room 12 · The Platform",
      title: "What runs along the front of the platform?",
      prompt: "A raised stone platform spans the lower middle of this plate. <strong>What hangs along its front edge?</strong>",
      choices: [
        { text: "A row of swagged iron chains looped between posts.", correct: true },
        { text: "A line of burning torches.", correct: false },
        { text: "A painted mural of saints.", correct: false },
        { text: "A row of potted plants.", correct: false }
      ],
      hint: "Look at the front of the central platform — chains droop in U-shaped loops between short posts.",
      onCorrect: "Right. Heavy chains swag along the platform — a Piranesian fence of iron."
    },

    // ROOM 13 — Plate XIII — title-cloze
    {
      plate: "XIII", type: "cloze", concealCaption: true,
      eyebrow: "Room 13 · Name the Plate",
      title: "Fill in the title",
      promptTemplate: "Curators gave this plate the title: <strong>“The ____.”</strong> Pick the missing word.",
      cloze: [
        { text: "Forge",  correct: false },
        { text: "Garden", correct: false },
        { text: "Well",   correct: true },
        { text: "Library", correct: false }
      ],
      hint: "Look for a circular masonry opening in the floor — water below.",
      onCorrect: "Yes. The Well — a vertical shaft cut into the prison floor."
    },

    // ROOM 14 — Plate XIV — identify arch type
    {
      plate: "XIV", type: "mc",
      eyebrow: "Room 14 · Architectural Vocabulary",
      title: "What kind of arch?",
      prompt: "The highest arch in this plate has a specific architectural style. <strong>Which one?</strong>",
      choices: [
        { text: "A round Roman arch.", correct: false },
        { text: "A pointed Gothic arch.", correct: true },
        { text: "A flat lintel.", correct: false },
        { text: "A horseshoe arch.", correct: false }
      ],
      hint: "Look at the top of the arch. Does it come to a point, or is it semicircular?",
      onCorrect: "Right. The Gothic Arch — pointed, medieval, out of place in a Roman prison."
    },

    // ROOM 15 — Plate XV — read the central pier
    {
      plate: "XV", type: "mc",
      eyebrow: "Room 15 · The Central Pier",
      title: "What crowns the central column?",
      prompt: "A heavy stone column rises at the center of this plate, capped by something that lights the chamber. <strong>What sits on top?</strong>",
      choices: [
        { text: "A statue of an emperor.", correct: false },
        { text: "A hanging lamp set against a circular halo.", correct: true },
        { text: "A clock face.", correct: false },
        { text: "A nest of birds.", correct: false }
      ],
      hint: "Look at the top of the central column. A round disc frames the silhouette.",
      onCorrect: "Yes. The Pier with a Lamp — a lamp framed by a great round halo crowns the column."
    },

    // ROOM 16 — Plate XVI — final combo
    {
      plate: "XVI", type: "combo",
      eyebrow: "Room 16 · The Final Lock",
      title: "Set the three dials and escape",
      prompt: "A locked pier stands between you and the open air. Use what you've learned. <strong>Set each dial</strong> to the right answer, then escape.",
      dials: [
        { label: "The series", options: ["Real prisons", "Invented prisons", "Roman ruins"], correctIdx: 1 },
        { label: "The mood",   options: ["Cheerful", "Domestic", "Vast and disorienting"], correctIdx: 2 },
        { label: "The way out", options: ["Through a key", "Through understanding", "Through brute force"], correctIdx: 1 }
      ],
      hint: "These prisons are imaginary. The way out isn't a key. It's that you can read them now.",
      onCorrect: "The pier opens. You step through. You escaped Piranesi's Carceri."
    }
  ];

  // ---------- ROOM HELPER: resolve plate refs ----------
  function plateOf(room) { return PLATES[room.plate]; }
  function captionOf(p) { return `Plate ${p.num}, ${p.title} (${p.date}). ${p.source}, public domain.`; }

  // ---------- DOM ----------
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const screenIntro = $("#screen-intro");
  const screenGame  = $("#screen-game");
  const screenDone  = $("#screen-done");
  const screenGallery = $("#screen-gallery");
  const hudLabel    = $("#hudLabel");
  const progressBar = $("#progressBar");
  const progressFill= $("#progressFill");
  const hintBtn     = $("#hintBtn");
  const restartBtn  = $("#restartBtn");
  const startBtn    = $("#startBtn");
  const themeBtn    = $("#themeBtn");
  const themeLabel  = themeBtn.querySelector(".theme-label");
  const instructionsBtn = $("#instructionsBtn");
  const instructionsDialog = $("#instructionsDialog");
  const certForm = $("#certForm");
  const certName = $("#certName");
  const certNameOut = $("#certNameOut");
  const certDateOut = $("#certDateOut");
  const printBtn = $("#printBtn");
  const playAgainBtn = $("#playAgainBtn");
  const toast = $("#toast");
  const galleryGrid = $("#galleryGrid");
  const lightbox = $("#lightbox");

  // ---------- STATE (in-memory only) ----------
  const state = {
    roomIdx: 0,
    solved: new Set(),
    theme: prefersDark() ? "dark" : "light"
  };
  function prefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // ---------- THEME ----------
  function applyTheme(t) {
    if (t === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeLabel.textContent = "Light";
      themeBtn.setAttribute("aria-pressed", "true");
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeLabel.textContent = "Dark";
      themeBtn.setAttribute("aria-pressed", "false");
    }
  }
  applyTheme(state.theme);
  themeBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
  });

  // ---------- DIALOG ----------
  instructionsBtn.addEventListener("click", () => {
    if (typeof instructionsDialog.showModal === "function") instructionsDialog.showModal();
    else instructionsDialog.setAttribute("open", "");
  });
  instructionsDialog.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-dialog]")) {
      instructionsDialog.close ? instructionsDialog.close() : instructionsDialog.removeAttribute("open");
    }
  });

  // ---------- TOAST ----------
  let toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 1800);
  }

  // ---------- SCREEN ROUTING ----------
  function showScreen(name) {
    screenIntro.hidden = name !== "intro";
    screenGame.hidden  = name !== "game";
    screenDone.hidden  = name !== "done";
    screenGallery.hidden = name !== "gallery";
    [screenIntro, screenGame, screenDone, screenGallery].forEach(el => {
      if (!el) return;
      el.classList.toggle("is-active", el.hidden ? false : true);
    });
    if (name === "game" || name === "done" || name === "gallery") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (name === "gallery") renderGallery();
  }

  // hash routing for /gallery
  function syncFromHash() {
    if (location.hash === "#gallery") showScreen("gallery");
    else if (location.hash === "" || location.hash === "#") showScreen("intro");
  }
  window.addEventListener("hashchange", syncFromHash);

  function startGame() {
    state.roomIdx = 0;
    state.solved.clear();
    showScreen("game");
    renderRoom();
  }

  startBtn.addEventListener("click", () => {
    if (location.hash === "#gallery") history.replaceState(null, "", location.pathname);
    startGame();
  });

  const galleryStartBtn = $("#galleryStartBtn");
  const galleryHomeBtn  = $("#galleryHomeBtn");
  if (galleryStartBtn) galleryStartBtn.addEventListener("click", () => {
    history.replaceState(null, "", location.pathname);
    startGame();
  });
  if (galleryHomeBtn) galleryHomeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    history.replaceState(null, "", location.pathname);
    showScreen("intro");
  });
  const homeLink = $("#homeLink");
  if (homeLink) homeLink.addEventListener("click", (e) => {
    // Intercept so we don't reload the page (preserves theme + in-memory state)
    e.preventDefault();
    if (location.hash) history.replaceState(null, "", location.pathname);
    showScreen("intro");
  });
  restartBtn.addEventListener("click", () => {
    if (window.confirm("Restart from Room 1?")) startGame();
  });
  playAgainBtn.addEventListener("click", () => {
    if (window.confirm("Play again from Room 1?")) startGame();
  });

  // ---------- PROGRESS ----------
  function updateHud() {
    const total = ROOMS.length;
    const done = state.solved.size;
    const current = state.roomIdx + 1;
    hudLabel.textContent = `Room ${Math.min(current, total)} of ${total}`;
    progressFill.style.width = (done / total) * 100 + "%";
    progressBar.setAttribute("aria-valuemax", String(total));
    progressBar.setAttribute("aria-valuenow", String(done));
  }

  // ---------- RENDER ROOM ----------
  function renderRoom() {
    const r = ROOMS[state.roomIdx];
    if (!r) return finishGame();
    const p = plateOf(r);

    updateHud();
    toast.classList.remove("is-show");

    const roomEl = document.getElementById("room");
    roomEl.innerHTML = "";
    roomEl.className = "room";

    const concealHero = (r.type === "image-choice" || r.type === "compare" || r.type === "odd-one-out");

    // image
    const fig = document.createElement("figure");
    fig.className = "room-image";
    if (concealHero) {
      fig.innerHTML = `
        <div class="plate-stamp"><span class="roman">PL. ?</span> Carceri</div>
        <div class="plate-veil" aria-hidden="true">
          <span class="plate-veil-num">${escapeHtml(p.num)}</span>
          <span class="plate-veil-label">Plate concealed</span>
          <span class="plate-veil-sub">Use the clue and the options on the right.</span>
        </div>
        <figcaption class="room-image-cap">The plate is revealed when you choose correctly.</figcaption>
      `;
    } else {
      // Some rooms hide the caption (which contains the plate title) until the
      // user answers correctly, so the title doesn't give the answer away.
      const capText = r.concealCaption
        ? `Plate ${p.num}, Carceri d'Invenzione (${p.date}). Title revealed when you answer.`
        : captionOf(p);
      fig.innerHTML = `
        <div class="plate-stamp"><span class="roman">PL. ${p.num}</span> Carceri</div>
        <img src="${p.img}" alt="${escapeHtml(capText)}" loading="${state.roomIdx === 0 ? "eager" : "lazy"}" />
        <figcaption class="room-image-cap">${escapeHtml(capText)}</figcaption>
      `;
    }

    // body
    const body = document.createElement("div");
    body.className = "room-body";
    const promptHtml = r.prompt || (r.promptTemplate || "");
    body.innerHTML = `
      <p class="room-eyebrow">${escapeHtml(r.eyebrow)}</p>
      <h2 class="room-title">${escapeHtml(r.title)}</h2>
      <p class="room-prompt">${promptHtml}</p>
      <div class="puzzle"></div>
      <div class="hint-chip" id="hintChip"><strong>Hint</strong>${escapeHtml(r.hint)}</div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="next-row" id="nextRow"></div>
    `;

    roomEl.appendChild(fig);
    roomEl.appendChild(body);

    // restart room-in animation
    roomEl.style.animation = "none"; void roomEl.offsetHeight; roomEl.style.animation = "";

    const puzzleEl = roomEl.querySelector(".puzzle");
    if      (r.type === "mc")            buildMC(r, puzzleEl);
    else if (r.type === "image-choice")  buildImageChoice(r, puzzleEl);
    else if (r.type === "sequence")      buildSequence(r, puzzleEl);
    else if (r.type === "combo")         buildCombo(r, puzzleEl);
    else if (r.type === "hotspot")       buildHotspot(r, puzzleEl);
    else if (r.type === "cloze")         buildCloze(r, puzzleEl);
    else if (r.type === "compare")       buildCompare(r, puzzleEl);
    else if (r.type === "odd-one-out")   buildOddOneOut(r, puzzleEl);
  }

  // ---------- PUZZLE: MULTIPLE CHOICE ----------
  function buildMC(r, host) {
    const choices = shuffle(r.choices.slice());
    const grid = document.createElement("div");
    grid.className = "choices";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", "Multiple choice answers");
    choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.innerHTML = `<span class="dot" aria-hidden="true"></span><span>${escapeHtml(c.text)}</span>`;
      btn.addEventListener("click", () => {
        if (c.correct) { markCorrect(grid, btn); solveRoom(r); }
        else { markWrong(btn); softFail(); }
      });
      grid.appendChild(btn);
    });
    host.appendChild(grid);
  }

  // ---------- PUZZLE: TITLE-CLOZE ----------
  function buildCloze(r, host) {
    const choices = shuffle(r.cloze.slice());
    const grid = document.createElement("div");
    grid.className = "choices choices-inline";
    choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice choice-pill";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        if (c.correct) {
          $$(".choice", grid).forEach(el => { el.disabled = true; if (el !== btn) el.classList.add("is-wrong"); });
          btn.classList.add("is-correct");
          solveRoom(r);
        } else {
          btn.classList.add("is-wrong");
          btn.disabled = true;
          softFail();
        }
      });
      grid.appendChild(btn);
    });
    host.appendChild(grid);
  }

  // ---------- PUZZLE: IMAGE CHOICE (clue → plate, 4 options) ----------
  function buildImageChoice(r, host) {
    const grid = document.createElement("div");
    grid.className = "choices choices-grid";
    const choices = shuffle(r.choices.map(c => ({ ...c, _p: PLATES[c.plate] })));
    choices.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-img";
      btn.setAttribute("aria-label", `Plate option ${idx + 1}`);
      btn.innerHTML = `<img src="${c._p.thumb}" alt="Carceri plate option ${idx + 1}" loading="lazy" /><span class="label">Plate ${idx + 1}</span>`;
      btn.addEventListener("click", () => {
        if (c.correct) {
          $$(".choice-img", grid).forEach(el => { if (el !== btn) el.classList.add("is-wrong"); el.disabled = true; });
          btn.classList.add("is-correct");
          btn.querySelector(".label").textContent = c._p.title;
          solveRoom(r);
        } else {
          btn.classList.add("is-wrong");
          btn.disabled = true;
          softFail();
        }
      });
      grid.appendChild(btn);
    });
    host.appendChild(grid);
  }

  // ---------- PUZZLE: COMPARE (2 plates) ----------
  function buildCompare(r, host) {
    const grid = document.createElement("div");
    grid.className = "choices choices-compare";
    const opts = shuffle(r.options.map(o => ({ ...o, _p: PLATES[o.plate] })));
    opts.forEach((o, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-img choice-img--lg";
      btn.setAttribute("aria-label", `Plate ${String.fromCharCode(65 + idx)}`);
      btn.innerHTML = `<img src="${o._p.img}" alt="Carceri plate ${String.fromCharCode(65 + idx)}" loading="lazy" /><span class="label">Plate ${String.fromCharCode(65 + idx)}</span>`;
      btn.addEventListener("click", () => {
        if (o.correct) {
          $$(".choice-img", grid).forEach(el => { if (el !== btn) el.classList.add("is-wrong"); el.disabled = true; });
          btn.classList.add("is-correct");
          btn.querySelector(".label").textContent = o._p.title;
          solveRoom(r);
        } else {
          btn.classList.add("is-wrong");
          btn.disabled = true;
          softFail();
        }
      });
      grid.appendChild(btn);
    });
    host.appendChild(grid);
  }

  // ---------- PUZZLE: ODD-ONE-OUT (4 plates) ----------
  function buildOddOneOut(r, host) {
    const grid = document.createElement("div");
    grid.className = "choices choices-grid";
    const choices = shuffle(r.choices.map(c => ({ ...c, _p: PLATES[c.plate] })));
    choices.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-img";
      btn.setAttribute("aria-label", `Plate option ${idx + 1}`);
      btn.innerHTML = `<img src="${c._p.thumb}" alt="Carceri plate option ${idx + 1}" loading="lazy" /><span class="label">Plate ${idx + 1}</span>`;
      btn.addEventListener("click", () => {
        if (c.correct) {
          $$(".choice-img", grid).forEach(el => { if (el !== btn) el.classList.add("is-wrong"); el.disabled = true; });
          btn.classList.add("is-correct");
          btn.querySelector(".label").textContent = c._p.title;
          solveRoom(r);
        } else {
          btn.classList.add("is-wrong");
          btn.disabled = true;
          softFail();
        }
      });
      grid.appendChild(btn);
    });
    host.appendChild(grid);
  }

  // ---------- PUZZLE: HOTSPOT ----------
  function buildHotspot(r, host) {
    const p = plateOf(r);
    // Show a dedicated hotspot image with an overlay grid.
    const wrap = document.createElement("div");
    wrap.className = "hotspot-wrap";
    const total = r.grid.cols * r.grid.rows;
    let cells = "";
    for (let i = 1; i <= total; i++) {
      cells += `<button type="button" class="hotspot-cell" data-cell="${i}" aria-label="Region ${i}"></button>`;
    }
    wrap.innerHTML = `
      <div class="hotspot-stage" style="--cols:${r.grid.cols}; --rows:${r.grid.rows};">
        <img src="${p.img}" alt="${escapeHtml(captionOf(p))}" loading="lazy" />
        <div class="hotspot-grid">${cells}</div>
      </div>
      <p class="micro hotspot-help">Click anywhere on the image. Wrong regions will dim.</p>
    `;
    host.appendChild(wrap);

    const correct = new Set(r.grid.correct);
    let foundOne = false;
    $$(".hotspot-cell", wrap).forEach(cell => {
      cell.addEventListener("click", () => {
        if (cell.classList.contains("is-found") || cell.classList.contains("is-miss")) return;
        const n = Number(cell.dataset.cell);
        if (correct.has(n)) {
          cell.classList.add("is-found");
          if (!foundOne) {
            foundOne = true;
            // dim all unfound cells
            $$(".hotspot-cell", wrap).forEach(other => {
              if (!other.classList.contains("is-found")) other.classList.add("is-dim");
            });
            solveRoom(r);
          }
        } else {
          cell.classList.add("is-miss");
          softFail();
        }
      });
    });
  }

  // ---------- PUZZLE: SEQUENCE ----------
  function buildSequence(r, host) {
    const items = shuffle(r.items.slice());
    const list = document.createElement("div");
    list.className = "sequence";
    let pickIndex = 0;
    const expected = r.items.length;
    items.forEach((it) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "seq-item";
      row.dataset.rank = it.rank;
      row.innerHTML = `<span class="seq-num"></span><span>${escapeHtml(it.text)}</span>`;
      row.addEventListener("click", () => {
        if (row.classList.contains("is-picked")) return;
        pickIndex += 1;
        if (Number(row.dataset.rank) === pickIndex) {
          row.classList.add("is-picked");
          row.querySelector(".seq-num").textContent = String(pickIndex);
          if (pickIndex === expected) {
            $$(".seq-item", list).forEach(el => el.disabled = true);
            solveRoom(r);
          }
        } else {
          pickIndex = 0;
          $$(".seq-item", list).forEach(el => {
            el.classList.remove("is-picked");
            el.querySelector(".seq-num").textContent = "";
          });
          softFail("Not quite. Start over and try again.");
        }
      });
      list.appendChild(row);
    });
    host.appendChild(list);
  }

  // ---------- PUZZLE: COMBO ----------
  function buildCombo(r, host) {
    const wrap = document.createElement("div");
    wrap.className = "combo-wrap";
    const dialState = r.dials.map(() => 0);
    r.dials.forEach((dial, di) => {
      const col = document.createElement("div");
      col.className = "combo-col";
      col.innerHTML = `
        <div class="combo-label">${escapeHtml(dial.label)}</div>
        <div class="combo-display">${escapeHtml(dial.options[0])}</div>
        <div class="combo-btns">
          <button type="button" class="combo-btn" data-dir="-1" aria-label="Previous option">‹</button>
          <button type="button" class="combo-btn" data-dir="1" aria-label="Next option">›</button>
        </div>
      `;
      const display = col.querySelector(".combo-display");
      $$(".combo-btn", col).forEach(b => {
        b.addEventListener("click", () => {
          const dir = Number(b.dataset.dir);
          dialState[di] = (dialState[di] + dir + dial.options.length) % dial.options.length;
          display.textContent = dial.options[dialState[di]];
          col.classList.toggle("is-locked", dialState[di] === dial.correctIdx);
          checkCombo();
        });
      });
      wrap.appendChild(col);
    });
    host.appendChild(wrap);

    const tryBtn = document.createElement("button");
    tryBtn.type = "button";
    tryBtn.className = "btn btn-primary";
    tryBtn.textContent = "Try the lock";
    tryBtn.addEventListener("click", () => {
      const allRight = dialState.every((v, i) => v === r.dials[i].correctIdx);
      if (allRight) solveRoom(r);
      else softFail("The lock holds. Adjust the dials.");
    });
    host.appendChild(tryBtn);

    function checkCombo() {
      const allRight = dialState.every((v, i) => v === r.dials[i].correctIdx);
      tryBtn.textContent = allRight ? "Open the pier" : "Try the lock";
    }
  }

  // ---------- COMMON FEEDBACK ----------
  function markCorrect(grid, chosenBtn) {
    $$(".choice", grid).forEach(el => {
      el.disabled = true;
      if (el === chosenBtn) el.classList.add("is-correct");
      else el.classList.add("is-wrong");
    });
  }
  function markWrong(btn) { btn.classList.add("is-wrong"); btn.disabled = true; }

  function softFail(msg) {
    const fb = $("#feedback");
    if (!fb) return;
    fb.textContent = msg || "Not that one. Try another.";
    fb.classList.remove("is-correct");
    showToast(msg || "Not quite — try again.");
  }

  function solveRoom(r) {
    const p = plateOf(r);
    state.solved.add(r.plate);
    const fb = $("#feedback");
    if (fb) {
      fb.textContent = r.onCorrect;
      fb.classList.add("is-correct");
    }
    updateHud();

    // Reveal concealed plate (image-choice / compare / odd-one-out)
    const veil = document.querySelector(".plate-veil");
    if (veil) {
      const fig = veil.closest(".room-image");
      if (fig) {
        fig.innerHTML = `
          <div class="plate-stamp"><span class="roman">PL. ${p.num}</span> Carceri</div>
          <img src="${p.img}" alt="${escapeHtml(captionOf(p))}" />
          <figcaption class="room-image-cap">${escapeHtml(captionOf(p))}</figcaption>
        `;
      }
    }

    // Reveal a previously hidden caption (rooms where the title is the answer)
    if (r.concealCaption) {
      const cap = document.querySelector(".room-image .room-image-cap");
      if (cap) cap.textContent = captionOf(p);
    }

    const next = $("#nextRow");
    if (!next) return;
    next.innerHTML = "";
    const isLast = state.roomIdx === ROOMS.length - 1;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary btn-lg";
    btn.textContent = isLast ? "Step into the open" : `Continue to Room ${state.roomIdx + 2}`;
    btn.addEventListener("click", () => {
      state.roomIdx += 1;
      if (state.roomIdx >= ROOMS.length) finishGame();
      else renderRoom();
    });
    next.appendChild(btn);
    showToast(isLast ? "Final room solved." : "Room solved.");
    setTimeout(() => btn.focus(), 50);
  }

  // ---------- HINT ----------
  hintBtn.addEventListener("click", () => {
    const chip = $("#hintChip");
    if (chip) chip.classList.add("is-shown");
  });

  // ---------- FINISH ----------
  function finishGame() {
    showScreen("done");
    certNameOut.textContent = "—";
    certDateOut.textContent = formatDate(new Date());
  }

  certForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (certName.value || "").trim();
    certNameOut.textContent = v || "—";
    certDateOut.textContent = formatDate(new Date());
    showToast("Certificate ready.");
  });
  certName.addEventListener("input", () => {
    const v = (certName.value || "").trim();
    certNameOut.textContent = v || "—";
    certDateOut.textContent = formatDate(new Date());
  });
  printBtn.addEventListener("click", () => {
    if ((certName.value || "").trim() && certNameOut.textContent === "—") certNameOut.textContent = certName.value.trim();
    if (certDateOut.textContent === "—") certDateOut.textContent = formatDate(new Date());
    window.print();
  });

  // ---------- GALLERY ----------
  function renderGallery() {
    if (!galleryGrid) return;
    if (galleryGrid.dataset.rendered === "1") return;
    galleryGrid.dataset.rendered = "1";
    const order = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI"];
    const html = order.map(num => {
      const p = PLATES[num];
      return `
        <figure class="gallery-card" data-plate="${p.num}">
          <button type="button" class="gallery-card-btn" data-plate="${p.num}" aria-label="View Plate ${p.num}: ${escapeHtml(p.title)}">
            <img src="${p.thumb}" alt="${escapeHtml(captionOf(p))}" loading="lazy" />
          </button>
          <figcaption class="gallery-cap">
            <span class="gallery-num">Plate ${p.num}</span>
            <span class="gallery-title">${escapeHtml(p.title)}</span>
            <span class="gallery-note">${escapeHtml(p.note)}</span>
            <a class="gallery-source" href="${p.sourceUrl}" target="_blank" rel="noopener">${escapeHtml(p.source)}</a>
          </figcaption>
        </figure>
      `;
    }).join("");
    galleryGrid.innerHTML = html;
    $$(".gallery-card-btn", galleryGrid).forEach(btn => {
      btn.addEventListener("click", () => openLightbox(btn.dataset.plate));
    });
  }

  // ---------- LIGHTBOX ----------
  function openLightbox(plateNum) {
    const p = PLATES[plateNum];
    if (!p) return;
    lightbox.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close">×</button>
      <div class="lightbox-inner">
        <figure class="lightbox-fig">
          <img src="${p.img}" alt="${escapeHtml(captionOf(p))}" />
          <figcaption>
            <span class="lightbox-num">Plate ${p.num}</span>
            <span class="lightbox-title">${escapeHtml(p.title)}</span>
            <span class="lightbox-note">${escapeHtml(p.note)}</span>
            <a class="lightbox-source" href="${p.sourceUrl}" target="_blank" rel="noopener">View source: ${escapeHtml(p.source)}</a>
          </figcaption>
        </figure>
      </div>
    `;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lightbox.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.innerHTML = "";
    document.body.style.overflow = "";
  }
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close") || e.target.closest(".lightbox-close")) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });

  // ---------- HELPERS ----------
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function formatDate(d) {
    const opts = { year: "numeric", month: "long", day: "numeric" };
    try { return d.toLocaleDateString(undefined, opts); }
    catch { return d.toDateString(); }
  }

  // ---------- INITIAL ----------
  if (location.hash === "#gallery") showScreen("gallery");
  else showScreen("intro");
})();
