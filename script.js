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
      base: 100,
      rate: 2,
      inc: 0,
      count: 0,
      power: 1,
      limit: 10,
    },
    {
      id: 1,
      name: "Vapor Collector",
      base: 50,
      rate: 1.3,
      inc: 1,
      count: 0,
      limit: 20,
    },
    {
      id: 2,
      name: "Cloud Harvester",
      base: 500,
      rate: 1.3,
      inc: 10,
      count: 0,
      limit: 20,
    },
    {
      id: 3,
      name: "Storm Generator",
      base: 4000,
      rate: 1.3,
      inc: 50,
      count: 0,
      limit: 20,
    },
    {
      id: 4,
      name: "Hurricane Engine",
      base: 20000,
      rate: 1.3,
      inc: 200,
      count: 0,
      limit: 20,
    },
    {
      id: 5,
      name: "Atmosphere Stabilizer",
      base: 100000,
      rate: 1.3,
      inc: 1000,
      count: 0,
      limit: 20,
    },
    {
      id: 6,
      name: "Orbital Station",
      base: 500000,
      rate: 1.3,
      inc: 5000,
      count: 0,
      limit: 20,
    },
  ],
  stats: {
    totalClicks: 0,
    startTime: Date.now(),
    totalResources: 0,
    timePlayed: 0,
  },
};

const achievementsData = {
  "ach-clicks1k": {
    condition: () => state.stats.totalClicks >= 1000,
    unlocked: false,
  },
  "ach-clicks10k": {
    condition: () => state.stats.totalClicks >= 10000,
    unlocked: false,
  },
  "ach-clicks100k": {
    condition: () => state.stats.totalClicks >= 100000,
    unlocked: false,
  },
  "ach-thousand": {
    condition: () => state.res >= 1000,
    unlocked: false,
  },
  "ach-million": {
    condition: () => state.res >= 1000000,
    unlocked: false,
  },
  "ach-billion": {
    condition: () => state.res >= 1000000000,
    unlocked: false,
  },
  "ach-time-10min": {
    condition: () => state.stats.timePlayed >= 600,
    unlocked: false,
  },
  "ach-time-1hr": {
    condition: () => state.stats.timePlayed >= 3600,
    unlocked: false,
  },
  "ach-time-24hr": {
    condition: () => state.stats.timePlayed >= 86400,
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
];

const evoUpgrades = [
  {
    threshold: 5000,
    name: "Deep Sea Life (5000)",
    buffText: "Vapor Collector x2",
    apply: () => {
      state.buildings[1].inc *= 2;
    },
  },
  {
    threshold: 15000,
    name: "First Islands (15000)",
    buffText: "Cloud Harvester x1.5",
    apply: () => {
      state.buildings[2].inc *= 1.5;
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

  let currentStageIndex = 0;
  stages.forEach((stage, index) => {
    if (state.stats.totalResources >= stage.threshold) {
      currentStageIndex = index;
    }
  });

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

window.onload = async () => {
  const saved = localStorage.getItem("planetClickerSave");
  if (saved) {
    const loadedState = JSON.parse(saved);
    Object.assign(state, loadedState);
    EventQueue.push("Welcome back, Captain!", "success");
  }

  document.getElementById("planet").onclick = doClick;
  render();
  checkAchievements();
  updateEvoUI();
};

function doClick() {
  state.res += state.clickPower;
  state.stats.totalClicks++;
  state.stats.totalResources += state.clickPower;
  createFloatingText(state.clickPower);
  const p = document.getElementById("planet");
  p.classList.remove("clicked");
  void p.offsetWidth;
  p.classList.add("clicked");

  checkAchievements();
  render();
}

function createFloatingText(value) {
    const planet = document.getElementById("planet");
    if (!planet) return;


    const rect = planet.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (Math.random() - 0.5) * 500; 
    const offsetY = (Math.random() - 0.5) * 200; 
    const text = document.createElement('div');
    text.className = 'floating-text';
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
    if (b.power) state.clickPower += b.power;
    EventQueue.push(`Bought ${b.name} (Total: ${b.count})`, "success");
    render();
    await saveProgress();
  } else if (isLimitReached) {
    EventQueue.push(`Warning: ${b.name} limit reached!`, `error`);
  }
}

function render() {
  const resDisplay = document.getElementById("resource-display");
  if (resDisplay) resDisplay.innerText = `${Math.floor(state.res)} 💧`;
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
        const bonusText = b.inc > 0 ? `+${b.inc}/s` : `+${b.power} click power`;
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
      <p>Total Earned: <span id="stat-earned">${Math.floor(state.stats.totalResources)}</span>💧</p>
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
