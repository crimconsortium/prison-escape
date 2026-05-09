/* =========================================================
   Escape the Carceri — game logic
   Pure client-side. No storage. No analytics. No network calls.
   ========================================================= */

(function () {
  "use strict";

  // ---------- ROOM DEFINITIONS ----------
  // Each room is grounded in plate titles and well-known
  // Carceri imagery (stairs, towers, chains, machinery, scale,
  // confinement). Puzzles are click-only.

  const ROOMS = [
    // ---------- ROOM 1 ----------
    {
      id: 1,
      plate: "I",
      img: "assets/01_title_page.jpg",
      caption: "Plate I, the Title Page (1761). LACMA, public domain.",
      eyebrow: "Room 1 · The Title Plate",
      title: "Read the inscription",
      prompt: "Look closely at the cartouche on the wall. Piranesi etched the series' title into the stone. <strong>Which Italian word, visible on the plate, names what these prisons are?</strong>",
      type: "mc",
      choices: [
        { text: "ROMA — ‘Rome.’", correct: false },
        { text: "INVENZIONE — ‘invention.’", correct: true },
        { text: "PALAZZO — ‘palace.’", correct: false },
        { text: "ANTICHITÀ — ‘antiquities.’", correct: false }
      ],
      hint: "The full title etched on the plate is Carceri d'Invenzione. Find the second word.",
      onCorrect: "Yes. Carceri d'Invenzione — prisons of invention. The architecture you're about to walk through was never built."
    },

    // ---------- ROOM 2 ----------
    {
      id: 2,
      plate: "III",
      img: "assets/03_round_tower.jpg",
      caption: "Plate III, The Round Tower (1761). LACMA, public domain.",
      eyebrow: "Room 2 · A Familiar Shape",
      title: "Identify the structure",
      prompt: "The plate has a popular title given by curators long after Piranesi. <strong>Look at the dominant architectural form</strong> in the image. What is it?",
      type: "mc",
      choices: [
        { text: "A Gothic arch.", correct: false },
        { text: "A drawbridge across a moat.", correct: false },
        { text: "A round tower.", correct: true },
        { text: "A rectangular courtyard.", correct: false }
      ],
      hint: "The plate is traditionally titled after the cylinder rising up the right side of the etching.",
      onCorrect: "Right. Curators call this one The Round Tower. You're learning to read the plates."
    },

    // ---------- ROOM 3 ----------
    {
      id: 3,
      plate: "VI",
      img: "assets/04_smoking_fire.jpg",
      caption: "Plate VI, The Smoking Fire (1761). LACMA, public domain.",
      eyebrow: "Room 3 · Match the Clue",
      title: "Choose the right plate",
      prompt: "Below are four plates from the Carceri. <strong>Pick the one that fits the clue.</strong><br/><br/>Clue: <em>“Smoke rises from a low fire near the front of the chamber.”</em>",
      type: "image-choice",
      choices: [
        { src: "assets/thumbs/03_round_tower.jpg",    label: "Round Tower",    correct: false },
        { src: "assets/thumbs/04_smoking_fire.jpg",   label: "Smoking Fire",   correct: true },
        { src: "assets/thumbs/06_gothic_arch.jpg",    label: "Gothic Arch",    correct: false },
        { src: "assets/thumbs/07_pier_with_chains.jpg", label: "Pier with Chains", correct: false }
      ],
      hint: "Trust the title. One of these plates is literally called The Smoking Fire.",
      onCorrect: "Found it. Curators titled this plate The Smoking Fire after the curling smoke at the lower left."
    },

    // ---------- ROOM 4 ----------
    {
      id: 4,
      plate: "IX",
      img: "assets/05_giant_wheel.jpg",
      caption: "Plate IX, The Giant Wheel (1761). LACMA, public domain.",
      eyebrow: "Room 4 · Title to Plate",
      title: "Match the title",
      prompt: "This room's plate is built around a single immense object. <strong>Choose the title</strong> that best matches what dominates the picture.",
      type: "mc",
      choices: [
        { text: "The Lion Bas-Reliefs.", correct: false },
        { text: "The Gothic Arch.", correct: false },
        { text: "The Giant Wheel.", correct: true },
        { text: "The Pier with Chains.", correct: false }
      ],
      hint: "It's a piece of machinery, far larger than any human body in the print.",
      onCorrect: "Yes. The Giant Wheel — engineering at impossible scale, looming over tiny figures."
    },

    // ---------- ROOM 5 ----------
    {
      id: 5,
      plate: "II",
      img: "assets/02_man_on_the_rack.jpg",
      caption: "Plate II, The Man on the Rack (1761). LACMA, public domain.",
      eyebrow: "Room 5 · Reading Confinement",
      title: "Order the means of restraint",
      prompt: "Piranesi's prisons stack devices of confinement. <strong>Click these in order</strong>, from the lightest restraint to the most severe, as Piranesi himself depicts across the Carceri.",
      type: "sequence",
      items: [
        { text: "An open arch you could walk under.",  rank: 1 },
        { text: "A heavy chain hanging from a wall.",  rank: 2 },
        { text: "A wooden rack that holds a body still.", rank: 3 }
      ],
      hint: "Think about how much each removes a person's ability to move. An arch lets you pass; a rack pins a body in place.",
      onCorrect: "Right. The Carceri escalate restraint: passage, then bondage, then the body itself fixed by machinery."
    },

    // ---------- ROOM 6 ----------
    {
      id: 6,
      plate: "XVI",
      img: "assets/07_pier_with_chains.jpg",
      caption: "Plate XVI, The Pier with Chains (1761). LACMA, public domain.",
      eyebrow: "Room 6 · The Final Lock",
      title: "Set the three dials and escape",
      prompt: "A locked pier stands between you and the open air. Use what you've learned. <strong>Set each dial</strong> to the right answer, then escape.",
      type: "combo",
      dials: [
        {
          label: "The series",
          options: ["Real prisons", "Invented prisons", "Roman ruins"],
          correctIdx: 1
        },
        {
          label: "The mood",
          options: ["Cheerful", "Domestic", "Vast and disorienting"],
          correctIdx: 2
        },
        {
          label: "The way out",
          options: ["Through a key", "Through understanding", "Through brute force"],
          correctIdx: 1
        }
      ],
      hint: "These prisons are imaginary. The way out isn't a key. It's that you can read them now.",
      onCorrect: "The pier opens. You step through. You escaped Piranesi's Carceri."
    }
  ];

  // ---------- DOM ----------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const screenIntro = $("#screen-intro");
  const screenGame  = $("#screen-game");
  const screenDone  = $("#screen-done");
  // roomEl is fetched fresh each render, since we replace the node.
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

  // ---------- STATE (in-memory only) ----------
  let state = {
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
    if (typeof instructionsDialog.showModal === "function") {
      instructionsDialog.showModal();
    } else {
      instructionsDialog.setAttribute("open", "");
    }
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

  // ---------- FLOW ----------
  function showScreen(name) {
    screenIntro.hidden = name !== "intro";
    screenGame.hidden  = name !== "game";
    screenDone.hidden  = name !== "done";
    screenIntro.classList.toggle("is-active", name === "intro");
    screenGame.classList.toggle("is-active",  name === "game");
    screenDone.classList.toggle("is-active",  name === "done");
    if (name === "game") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      hintBtn.disabled = false;
    }
    if (name === "done") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function startGame() {
    state.roomIdx = 0;
    state.solved.clear();
    showScreen("game");
    renderRoom();
  }

  function restart() {
    if (!confirmNoStorage("Restart from Room 1?")) return;
    startGame();
  }

  function confirmNoStorage(msg) {
    return window.confirm(msg);
  }

  // ---------- PROGRESS ----------
  function updateHud() {
    const total = ROOMS.length;
    const done = state.solved.size;
    const current = state.roomIdx + 1;
    hudLabel.textContent = `Room ${Math.min(current, total)} of ${total}`;
    const pct = (done / total) * 100;
    progressFill.style.width = pct + "%";
    progressBar.setAttribute("aria-valuenow", String(done));
  }

  // ---------- RENDER ROOM ----------
  function renderRoom() {
    const r = ROOMS[state.roomIdx];
    if (!r) return finishGame();

    updateHud();

    // Clear any lingering toast from the previous room
    toast.classList.remove("is-show");

    const roomEl = document.getElementById("room");
    // Reset content in place to avoid losing the reference.
    roomEl.innerHTML = "";
    roomEl.className = "room";
    if (r.type === "image-choice") roomEl.classList.add("room--single");

    // image — for image-choice rooms we hide the hero plate (it would spoil the puzzle).
    const fig = document.createElement("figure");
    fig.className = "room-image";
    if (r.type === "image-choice") {
      fig.innerHTML = `
        <div class="plate-stamp"><span class="roman">PL. ?</span> Carceri</div>
        <div class="plate-veil" aria-hidden="true">
          <span class="plate-veil-num">${escapeHtml(r.plate)}</span>
          <span class="plate-veil-label">Plate concealed</span>
          <span class="plate-veil-sub">Use the clue. Choose from the four plates on the right.</span>
        </div>
        <figcaption class="room-image-cap">The plate is revealed when you choose correctly.</figcaption>
      `;
    } else {
      fig.innerHTML = `
        <div class="plate-stamp"><span class="roman">PL. ${r.plate}</span> Carceri</div>
        <img src="${r.img}" alt="${escapeHtml(r.caption)}" loading="${state.roomIdx === 0 ? "eager" : "lazy"}" />
        <figcaption class="room-image-cap">${escapeHtml(r.caption)}</figcaption>
      `;
    }

    // body
    const body = document.createElement("div");
    body.className = "room-body";
    body.innerHTML = `
      <p class="room-eyebrow">${escapeHtml(r.eyebrow)}</p>
      <h2 class="room-title">${escapeHtml(r.title)}</h2>
      <p class="room-prompt">${r.prompt}</p>
      <div class="puzzle"></div>
      <div class="hint-chip" id="hintChip"><strong>Hint</strong>${escapeHtml(r.hint)}</div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="next-row" id="nextRow"></div>
    `;

    roomEl.appendChild(fig);
    roomEl.appendChild(body);

    // Force restart of the room-in animation
    roomEl.style.animation = "none";
    void roomEl.offsetHeight;
    roomEl.style.animation = "";

    const puzzleEl = roomEl.querySelector(".puzzle");
    if (r.type === "mc") buildMC(r, puzzleEl);
    else if (r.type === "image-choice") buildImageChoice(r, puzzleEl);
    else if (r.type === "sequence") buildSequence(r, puzzleEl);
    else if (r.type === "combo") buildCombo(r, puzzleEl);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- PUZZLE: MULTIPLE CHOICE ----------
  function buildMC(r, host) {
    const choices = shuffle(r.choices.map((c, i) => ({ ...c, _i: i })));
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
        if (c.correct) {
          markCorrect(grid, btn);
          solveRoom(r);
        } else {
          markWrong(btn);
          softFail();
        }
      });
      grid.appendChild(btn);
    });
    host.appendChild(grid);
  }

  // ---------- PUZZLE: IMAGE CHOICE ----------
  function buildImageChoice(r, host) {
    const grid = document.createElement("div");
    grid.className = "choices choices-grid";
    const choices = shuffle(r.choices.map((c, i) => ({ ...c, _i: i })));
    choices.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-img";
      btn.setAttribute("aria-label", "Plate " + (idx + 1));
      // Labels are concealed until the puzzle is solved; otherwise the title gives it away.
      btn.innerHTML = `<img src="${c.src}" alt="Carceri plate option ${idx + 1}" loading="lazy" /><span class="label">Plate ${idx + 1}</span>`;
      btn.addEventListener("click", () => {
        if (c.correct) {
          $$(".choice-img", grid).forEach(el => {
            if (el !== btn) el.classList.add("is-wrong");
            el.disabled = true;
          });
          btn.classList.add("is-correct");
          // Reveal the real label of the chosen plate.
          btn.querySelector(".label").textContent = c.label;
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

  // ---------- PUZZLE: SEQUENCE ----------
  function buildSequence(r, host) {
    const items = shuffle(r.items.map((it, i) => ({ ...it, _i: i })));
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
        const expectedRank = pickIndex;
        if (Number(row.dataset.rank) === expectedRank) {
          row.classList.add("is-picked");
          row.querySelector(".seq-num").textContent = String(pickIndex);
          if (pickIndex === expected) {
            $$(".seq-item", list).forEach(el => el.disabled = true);
            solveRoom(r);
          }
        } else {
          // wrong pick — reset
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

  // ---------- PUZZLE: COMBO LOCK ----------
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
      if (allRight) {
        solveRoom(r);
      } else {
        softFail("The lock holds. Adjust the dials.");
      }
    });
    host.appendChild(tryBtn);

    function checkCombo() {
      const allRight = dialState.every((v, i) => v === r.dials[i].correctIdx);
      if (allRight) {
        tryBtn.textContent = "Open the pier";
        tryBtn.classList.add("is-ready");
      } else {
        tryBtn.textContent = "Try the lock";
        tryBtn.classList.remove("is-ready");
      }
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
  function markWrong(btn) {
    btn.classList.add("is-wrong");
    btn.disabled = true;
  }

  function softFail(msg) {
    const fb = $("#feedback");
    if (!fb) return;
    fb.textContent = msg || "Not that one. Try another.";
    fb.classList.remove("is-correct");
    showToast(msg || "Not quite — try again.");
  }

  function solveRoom(r) {
    state.solved.add(r.id);
    const fb = $("#feedback");
    if (fb) {
      fb.textContent = r.onCorrect;
      fb.classList.add("is-correct");
    }
    updateHud();

    // Reveal the concealed plate on image-choice rooms
    const veil = document.querySelector(".plate-veil");
    if (veil) {
      const fig = veil.closest(".room-image");
      if (fig) {
        fig.innerHTML = `
          <div class="plate-stamp"><span class="roman">PL. ${r.plate}</span> Carceri</div>
          <img src="${r.img}" alt="${escapeHtml(r.caption)}" />
          <figcaption class="room-image-cap">${escapeHtml(r.caption)}</figcaption>
        `;
      }
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

  restartBtn.addEventListener("click", restart);

  // ---------- FINISH ----------
  function finishGame() {
    showScreen("done");
    // Default name from URL? No. Keep blank — user types.
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

  // Live update name as user types (no submit needed)
  certName.addEventListener("input", () => {
    const v = (certName.value || "").trim();
    certNameOut.textContent = v || "—";
    certDateOut.textContent = formatDate(new Date());
  });

  printBtn.addEventListener("click", () => {
    if ((certName.value || "").trim() && certNameOut.textContent === "—") {
      certNameOut.textContent = certName.value.trim();
    }
    if (certDateOut.textContent === "—") {
      certDateOut.textContent = formatDate(new Date());
    }
    window.print();
  });

  playAgainBtn.addEventListener("click", () => {
    if (!confirmNoStorage("Play again from Room 1?")) return;
    startGame();
  });

  // ---------- INTRO ----------
  startBtn.addEventListener("click", startGame);

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
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function formatDate(d) {
    const opts = { year: "numeric", month: "long", day: "numeric" };
    try { return d.toLocaleDateString(undefined, opts); }
    catch { return d.toDateString(); }
  }

  // ---------- INITIAL ----------
  showScreen("intro");
})();
