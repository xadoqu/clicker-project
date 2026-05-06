let state = {
  res: 0,
  level: 1,
  clickPower: 1,
  evoLevel: 0,
  globalMultiplier: 1,
  buildings: [
    {
      id: 0,
      name: "Powerful Click",
      base: 150,
      rate: 2.5,
      inc: 0,
      count: 0,
      power: 2,
      limit: 30,
    },
    {
      id: 1,
      name: "Manual Pump",
      base: 50,
      rate: 1.1,
      inc: 1,
      count: 0,
      limit: 30,
    },
    {
      id: 2,
      name: "Deep Sea Drill",
      base: 250,
      rate: 1.12,
      inc: 5,
      count: 0,
      limit: 30,
    },
    {
      id: 3,
      name: "Atmospheric Condenser",
      base: 1200,
      rate: 1.14,
      inc: 15,
      count: 0,
      limit: 30,
    },
    {
      id: 4,
      name: "Cloud Seeding Array",
      base: 8500,
      rate: 1.15,
      inc: 60,
      count: 0,
      limit: 30,
    },
    {
      id: 5,
      name: "Geothermal Desalinator",
      base: 45000,
      rate: 1.16,
      inc: 280,
      count: 0,
      limit: 30,
    },
    {
      id: 6,
      name: "Arctic Melter",
      base: 280000,
      rate: 1.17,
      inc: 1400,
      count: 0,
      limit: 30,
    },
    {
      id: 7,
      name: "Orbital Ice Harvester",
      base: 1500000,
      rate: 1.18,
      inc: 6500,
      count: 0,
      limit: 30,
    },
    {
      id: 8,
      name: "Tectonic Aquifer Extractor",
      base: 10000000,
      rate: 1.2,
      inc: 35000,
      count: 0,
      limit: 30,
    },
    {
      id: 9,
      name: "Comet Redirector",
      base: 75000000,
      rate: 1.25,
      inc: 180000,
      count: 0,
      limit: 30,
    },
    {
      id: 10,
      name: "Molecular H2O Assembler",
      base: 450000000,
      rate: 1.22,
      inc: 950000,
      count: 0,
      limit: 30,
    },
    {
      id: 11,
      name: "Quantum Water Synthesizer",
      base: 2500000000,
      rate: 1.23,
      inc: 4200000,
      count: 0,
      limit: 30,
    },
    {
      id: 12,
      name: "Planetary Hydration Core ",
      base: 15000000000,
      rate: 1.25,
      inc: 20000000,
      count: 0,
      limit: 30,
    },
  ],
  stats: {
    totalClicks: 0,
    startTime: Date.now(),
    totalResources: 0,
    timePlayed: 0,
  },
};

class EventEmitter {
  constructor() {
    this.events = {};
  }
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      [...this.events[event]].forEach(callback => callback(data));
    };
  }
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
}
const gameEvents = new EventEmitter();

const clickSound = new Audio("src/sfx/click.mp3");
clickSound.volume = 0.05;

const achievementsData = {
  "ach-clicks1k": {
    name: "Start Clicker",
    condition: () => state.stats.totalClicks >= 1000,
    unlocked: false,
  },
  "ach-clicks10k": {
    name: "Clicking Machine",
    condition: () => state.stats.totalClicks >= 10000,
    unlocked: false,
  },
  "ach-clicks100k": {
    name: "Clicking Legend",
    condition: () => state.stats.totalClicks >= 100000,
    unlocked: false,
  },
  "ach-thousand": {
    name: "First Thousand",
    condition: () => state.res >= 1000,
    unlocked: false,
  },
  "ach-million": {
    name: "Millionaire",
    condition: () => state.res >= 1000000,
    unlocked: false,
  },
  "ach-billion": {
    name: "Billionaire",
    condition: () => state.res >= 1000000000,
    unlocked: false,
  },
  "ach-time-10min": {
    name: "Spectator",
    condition: () => state.stats.timePlayed >= 600,
    unlocked: false,
  },
  "ach-time-1hr": {
    name: "Sojourner",
    condition: () => state.stats.timePlayed >= 3600,
    unlocked: false,
  },
  "ach-time-24hr": {
    name: "Astronaut",
    condition: () => state.stats.timePlayed >= 86400,
    unlocked: false,
  },
  "ach-evo1": {
    name: "Not Empty",
    condition: () => state.evoLevel >= 1,
    unlocked: false,
  },
  "ach-evo2": {
    name: "Humans",
    condition: () => state.evoLevel >= 4,
    unlocked: false,
  },
  "ach-evo3": {
    name: "Berserk",
    condition: () => state.evoLevel >= 8,
    unlocked: false,
  },
};

function checkAchievements() {
  Object.keys(achievementsData).forEach((id) => {
    let ach = achievementsData[id];
    const element = document.getElementById(id);
    if (!element) return;
    if (!ach.unlocked && ach.condition()) {
      ach.unlocked = true;
      element.classList.add("unlocked");
      element.innerText = "🏆";
      element.title = ach.name;
      EventQueue.push(`Achievement Unlocked: ${ach.name}`, "success");
    } else if (ach.unlocked) {
      element.classList.add("unlocked");
      element.innerText = "🏆";
      element.title = ach.name;
    }
  });
}

window.evolutionStages = [
  { threshold: 0, name: "Start", class: "stage-0" },
  { threshold: 5000, name: "Deep Sea Life", class: "stage-1" },
  { threshold: 15000, name: "First Islands", class: "stage-2" },
  { threshold: 30000, name: "Origin of Animals", class: "stage-3" },
  { threshold: 70000, name: "First Hominids", class: "stage-4" },
  { threshold: 150000, name: "Stone Age", class: "stage-5" },
  { threshold: 500000, name: "Bronze Age", class: "stage-6" },
  { threshold: 2000000, name: "Iron Age", class: "stage-7" },
  { threshold: 10000000, name: "Middle Ages", class: "stage-8" },
];

const evoUpgrades = [
  {
    threshold: 5000,
    name: "Deep Sea Life (5000)",
    buffText: "Manual Pump x2",
    apply: () => {
      state.buildings[1].inc *= 2;
    },
  },
  {
    threshold: 15000,
    name: "First Islands (15000)",
    buffText: "Deep Sea Diver x1.5",
    apply: () => {
      state.buildings[2].inc *= 1.5;
    },
  },
  {
    threshold: 30000,
    name: "Origin of Animals (30000)",
    buffText: "Atmospheric Condenser x1.5",
    apply: () => {
      state.buildings[3].inc *= 1.5;
    },
  },
  {
    threshold: 70000,
    name: "First Hominids (70000)",
    buffText: "Global Income x2",
    apply: () => {
      state.globalMultiplier *= 2;
    },
  },
  {
    threshold: 150000,
    name: "Stone Age (150000)",
    buffText: "Cloud Seeding Array x1.5",
    apply: () => {
      state.buildings[4].inc *= 1.5;
    },
  },
  {
    threshold: 500000,
    name: "Bronze Age (500000)",
    buffText: "Geothermal Desalinator x1.5",
    apply: () => {
      state.buildings[5].inc *= 1.5;
    },
  },
  {
    threshold: 2000000,
    name: "Iron Age (2M)",
    buffText: "Arctic Melter x1.5",
    apply: () => {
      state.buildings[6].inc *= 1.5;
    },
  },
  {
    threshold: 10000000,
    name: "Middle Ages (10M)",
    buffText: "Orbital Ice Harvester x1.5",
    apply: () => {
      state.buildings[7].inc *= 1.5;
    },
  },
];

function buyEvolution() {
  const nextEvo = evoUpgrades[state.evoLevel];
  if (!nextEvo) return;

  if (state.res >= nextEvo.threshold) {
    state.res -= nextEvo.threshold;
    nextEvo.apply();
    state.evoLevel++;
    if (window.evolutionStages && evolutionStages[state.evoLevel]) {
      state.stats.totalResources = Math.max(
        state.stats.totalResources,
        evolutionStages[state.evoLevel].threshold,
      );
    }
    if (typeof triggerEvoEffects === "function")
      triggerEvoEffects(nextEvo.name);
    render();
    updateEvoUI();
    EventQueue.push(`Planet evolved to: ${nextEvo.name}!`, "success");
    saveProgress();
  } else {
    EventQueue.push("Not enough resources for evolution!", "error");
  }
}

function updateEvoUI() {
  const next = evoUpgrades[state.evoLevel];
  const infoBlock = document.getElementById("next-evo-info");
  if (!next) {
    if (infoBlock) infoBlock.innerHTML = "Maximum Evolution Reached!";
    return;
  }
  const nameEl = document.getElementById("evo-name");
  const buffEl = document.getElementById("evo-buff");
  const btnEl = document.getElementById("buy-evo-btn");
  if (nameEl) nameEl.innerText = `Next: ${next.name}`;
  if (buffEl) buffEl.innerText = `Buff: ${next.buffText}`;
  let progressContainer = document.getElementById("evo-progress-container");
  if (!progressContainer) {
    const html = `
            <div id="evo-progress-container" class="progress-container">
                <div id="evo-progress-bar" class="progress-bar"></div>
            </div>
        `;
    buffEl.insertAdjacentHTML("afterend", html);
  }

  const progressBar = document.getElementById("evo-progress-bar");
  if (progressBar) {
    let percent = (state.res / next.threshold) * 100;
    percent = Math.min(percent, 100);
    progressBar.style.width = percent + "%";
  }
  if (btnEl) {
    btnEl.innerText = `Evolve`;
    if (state.res >= next.threshold) {
      btnEl.classList.add("visible");
    } else {
      btnEl.classList.remove("visible");
    }
  }
}

let lastStageIndex = -1;

function updateEvolution() {
  const planetEl = document.getElementById("planet");
  const stages = window.evolutionStages || [
    { threshold: 0, name: "Start", class: "stage-0" },
  ];
  if (!planetEl) return;
  let currentStageIndex = state.evoLevel || 0;
  if (currentStageIndex >= stages.length) {
    currentStageIndex = stages.length - 1;
  }

  const currentStage = stages[currentStageIndex];

  if (lastStageIndex !== -1 && lastStageIndex !== currentStageIndex) {
    planetEl.classList.add("evolving");
    const evoText = document.createElement("div");
    evoText.className = "evolution-text";
    evoText.innerText = "PLANET EVOLVED!";
    document.querySelector(".main-area")?.appendChild(evoText);

    setTimeout(() => {
      evoText.remove();
      planetEl.classList.remove("evolving");
    }, 2500);
    EventQueue.push(`Planet evolved: ${currentStage.name}!`, "success");
  }

  stages.forEach((s) => planetEl.classList.remove(s.class));
  planetEl.classList.add(currentStage.class);
  lastStageIndex = currentStageIndex;
}

const memoize = (fn, limit = 10) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    if (cache.size >= limit) cache.delete(cache.keys().next().value);
    cache.set(key, result);
    return result;
  };
};

const saveProgress = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("planetClickerSave", JSON.stringify(state));
      resolve(true);
    }, 100);
  });
  apiService.request("/sync", {
    method: "POST",
    body: JSON.stringify(state),
  });
};

const EventQueue = {
  logs: [],
  push(message, type = "info") {
    this.logs.push({
      text: message,
      type,
      time: new Date().toLocaleTimeString(),
    });
    this.render();
  },
  render() {
    const container = document.getElementById("event-log");
    if (!container) return;
    const last = this.logs[this.logs.length - 1];
    let div = document.createElement("div");
    div.className = `log-entry ${last.type}`;
    div.innerText = `[${last.time}] ${last.text}`;
    container.prepend(div);
  },
};

const mCalcCost = memoize((base, rate, count) => {
  return Math.floor(base * Math.pow(rate, count));
});

let isWelcomeMessageShown = false;
window.onload = async () => {
  const saved = localStorage.getItem("planetClickerSave");
  if (saved) {
    const loadedState = JSON.parse(saved);
    Object.assign(state, loadedState);
    EventQueue.push("Welcome back, Captain!", "success");
  }
  gameEvents.subscribe("planetClicked", (clicks) => {
    console.log("Reactive Log: System detects ${clicks} clicks.");
    checkAchievements();
  });
  gameEvents.subscribe("resourceChanged", (amount) => {
    if (amount > 1000000 && !state.milestoneReached) {
      state.milestoneReached = true;
      EventQueue.push("Global Milestone: 1M Resources reached!", "success");
    }
   
    const unsubscribeWelcome = gameEvents.subscribe('planetClicked', () => {
        if (!isWelcomeMessageShown) {
            EventQueue.push("First steps on the planet taken!", "info");
            isWelcomeMessageShown = true;
            if (unsubscribeWelcome) unsubscribeWelcome(); 
            console.log("Reactive System: Welcome event unsubscribed.");
        }
    });

    gameEvents.subscribe("planetClicked", (clicks) => {
      checkAchievements();
    });
  });

  document.getElementById("planet").onclick = doClick;
  render();
  checkAchievements();
  updateEvoUI();
};

const CLICK_SOUND_SRC = "src/sfx/click.mp3";
function doClick(event) {
  const sound = new Audio(CLICK_SOUND_SRC);
  sound.volume = 0.05;
  sound.play().catch((err) => console.log("Browser blocked click sound:", err));
  sound.onended = () => {
    sound.remove();
  };
  state.res += state.clickPower;
  state.stats.totalClicks++;
  gameEvents.emit("planetClicked", state.stats.totalClicks);
  gameEvents.emit("resourceChanged", state.res);
  state.stats.totalResources += state.clickPower;
  createFloatingText(state.clickPower);
  const p = document.getElementById("planet");
  p.classList.remove("clicked");
  void p.offsetWidth;
  p.classList.add("clicked");

  checkAchievements();
  render();
}

const evolutionIcons = {
  0: "💧",
  1: "🏝️",
  2: " 🙉",
  3: "🧬",
  4: "🪨",
  5: "⛏️",
  6: "⚒️",
  7: "⚔️",
};

function createFloatingText(value) {
  const planet = document.getElementById("planet");
  if (!planet) return;

  const rect = planet.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const offsetX = (Math.random() - 0.5) * 400;
  const offsetY = (Math.random() - 0.5) * 100;
  const text = document.createElement("div");
  text.className = "floating-text";
  text.innerText = `+${value}`;
  text.style.left = `${centerX + offsetX}px`;
  text.style.top = `${centerY + offsetY}px`;

  document.body.appendChild(text);

  setTimeout(() => {
    text.remove();
  }, 800);
}

async function buyBuilding(id) {
  const b = state.buildings.find((item) => item.id === id);
  const cost = mCalcCost(b.base, b.rate, b.count);
  const isLimitReached = b.limit && b.count >= b.limit;

  if (state.res >= cost && !isLimitReached) {
    state.res -= cost;
    b.count++;
    if (b.power) state.clickPower *= 2;
    EventQueue.push(`Bought ${b.name} (Total: ${b.count})`, "success");
    render();
    await saveProgress();
  } else if (isLimitReached) {
    EventQueue.push(`Warning: ${b.name} limit reached!`, `error`);
  }
}

function render() {
  const currentEmoji = evolutionIcons[state.evoLevel] || "💧";
  const resDisplay = document.getElementById("resource-display");
  if (resDisplay)
    resDisplay.innerText = `${Math.floor(state.res)} ${currentEmoji}`;
  const list = document.getElementById("buildings-list");
  if (list) {
    list.innerHTML = "";
    let currentIncome = 0;
    state.buildings.forEach((b) => {
      if (b.inc) currentIncome += b.inc * b.count;
    });
    state.buildings.forEach((b, index) => {
      const isLocked = index > 1 && state.buildings[index - 1].count === 0;
      const cost = mCalcCost(b.base, b.rate, b.count);
      const isLimitReached = b.limit && b.count >= b.limit;
      let div = document.createElement("div");
      div.className = `shop-item ${isLocked || state.res < cost || isLimitReached ? "disabled" : ""}`;
      if (isLocked) {
        div.innerHTML = `<b>???</b><br>Locked (Buy previous building)`;
      } else {
        const bonusText = b.inc > 0 ? `+${b.inc}/s` : `x${b.power} click power`;
        const countText = b.limit ? `${b.count}/${b.limit}` : b.count;
        const priceText = isLimitReached
          ? `<b style="color: red;">MAX LEVEL</b>`
          : `Cost: ${cost}`;
        div.innerHTML = `<b>${b.name} (${countText})</b><br>${priceText} | ${bonusText}`;
        div.onclick = () => buyBuilding(b.id);
      }
      list.appendChild(div);
    });
    const totalDisplayIncome = currentIncome * state.globalMultiplier;
    const incDisplay = document.querySelector(".income-display");
    if (incDisplay)
      incDisplay.innerText = `+${totalDisplayIncome.toFixed(1)}/s`;
  }
  const statsContent = document.getElementById("stats-content");
  if (statsContent) {
    statsContent.innerHTML = `
      <p>Total Clicks: <span id="stat-clicks">${state.stats.totalClicks}</span></p>
      <p>Time in Space: <span id="stat-time">${state.stats.timePlayed}s</span></p>
      <p>Total Earned: <span id="stat-earned">${Math.floor(state.stats.totalResources)}</span> ${currentEmoji}</p>
    `;
  }
  updateEvolution();
  updateEvoUI();
}

function tick() {
  let income = state.buildings.reduce(
    (sum, b) => sum + b.count * (b.inc || 0),
    0,
  );
  income *= state.globalMultiplier;

  state.res += income;
  gameEvents.emit("resourceChanged", state.res);
  state.stats.totalResources += income;
  state.stats.timePlayed += 1;
  checkAchievements();
  render();
}

setInterval(tick, 1000);
setInterval(saveProgress, 30000);

function switchTab(tabName) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));

  if (event) event.currentTarget.classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");
  render();
}

async function startStreaming() {
  const streamer = new ResourceStreamer(state);
  initStreamUI();
  for await (const log of streamer.generateLogs()) {
    console.log(`[Stream] Income: ${log.income} at ${log.time}`);
    state.lastStreamLog = log;
    const dataSpan = document.getElementById("stream-data");
    if (dataSpan) {
      dataSpan.innerText = `+${log.income.toFixed(1)}/s [${log.time}]`;
    }
  }
}

function initStreamUI() {
  const streamDiv = document.createElement("div");
  streamDiv.id = "stream-display";
  streamDiv.innerHTML = `📡 LINK: <span id="stream-data">CONNECTING...</span>`;
  document.body.appendChild(streamDiv);
}

startStreaming();
