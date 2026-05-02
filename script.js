let state = {
  res: 0,
  level: 1,
  clickPower: 1,
  buildings: [
    {
      id: 0,
      name: "Vapor Collector",
      base: 50,
      rate: 1.15,
      inc: 1,
      count: 0,
      limit: 20,
    },
    {
      id: 1,
      name: "Rain Synthesizer",
      base: 200,
      rate: 1.5,
      inc: 0,
      count: 0,
      power: 1,
      limit: 10,
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
      rate: 1.2,
      inc: 50,
      count: 0,
      limit: 20,
    },
    {
      id: 4,
      name: "Hurricane Engine",
      base: 20000,
      rate: 1.2,
      inc: 200,
      count: 0,
      limit: 20,
    },
  ],
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
  "ach-thousand": { condition: () => state.res >= 1000, unlocked: false },
  "ach-million": { condition: () => state.res >= 1000000, unlocked: false },
  "ach-billion": { condition: () => state.res >= 1000000000, unlocked: false },
  "ach-time-10min": {
    condition: () => (Date.now() - state.stats.startTime) / 1000 >= 600,
    unlocked: false,
  },
  "ach-time-1hr": {
    condition: () => (Date.now() - state.stats.startTime) / 1000 >= 3600,
    unlocked: false,
  },
  "ach-time-24hr": {
    condition: () => (Date.now() - state.stats.startTime) / 1000 >= 86400,
    unlocked: false,
  },
};

function checkAchievements() {
  Object.keys(achievementsData).forEach((id) => {
    let ach = achievementsData[id];
    if (!ach.unlocked && ach.condition()) {
      ach.unlocked = true;
      const element = document.getElementById(id);
      if (element) {
        element.classList.add("unlocked");
        element.innerText = "🏆";
        EventQueue.push(`Achievement Unlocked!`, "success");
      }
    }
  });
}

const evolutionStages = [
  { threshold: 0, class: "stage-0", name: "Empty World" },
  { threshold: 50, class: "stage-1", name: "Deep Sea Life" },
  { threshold: 100, class: "stage-2", name: "First Islands" },
];

let lastStageIndex = -1;

function updateEvolution() {
  const planetEl = document.getElementById("planet");
  if (!planetEl) return;

  let currentStageIndex = 0;
  evolutionStages.forEach((stage, index) => {
    if (state.stats.totalResources >= stage.threshold) {
      currentStageIndex = index;
    }
  });

  const currentStage = evolutionStages[currentStageIndex];

  if (lastStageIndex !== -1 && lastStageIndex !== currentStageIndex) {
    planetEl.classList.remove("evolving");
    void planetEl.offsetWidth;
    planetEl.classList.add("evolving");

    const evoText = document.createElement("div");
    evoText.className = "evolution-text";
    evoText.innerText = "PLANET EVOLVED!";

    document.querySelector(".main-area").appendChild(evoText);

    setTimeout(() => {
      evoText.remove();
      planetEl.classList.remove("evolving");
    }, 2500);

    EventQueue.push(`Planet evolved: ${currentStage.name}!`, "success");
  }

  evolutionStages.forEach((s) => planetEl.classList.remove(s.class));
  planetEl.classList.add(currentStage.class);

  lastStageIndex = currentStageIndex;
}

if (!state.stats) {
  state.stats = {
    totalClicks: 0,
    startTime: Date.now(),
    totalResources: 0,
  };
}
// lab 3
const memoize = (fn, limit = 10) => {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const val = cache.get(key);
      cache.delete(key);
      cache.set(key, val);
      console.log("%c [Cache Hit] ", "color: #00ff00", key);
      return val;
    }

    const result = fn(...args);

    if (cache.size >= limit) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
      console.log("%c [Evicted] ", "color: #ff0000", firstKey);
    }

    cache.set(key, result);
    console.log("%c [Cache Miss] ", "color: #ffaa00", key);
    return result;
  };
};
//lab 5
const asyncUtils = {
  async forEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },
};

const saveProgress = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("clicker_save", JSON.stringify(state));
      resolve(true);
    }, 500);
  });
};

// lab 4
const EventQueue = {
  logs: [],
  push(message, type = "info") {
    const entry = {
      text: message,
      type,
      time: new Date().toLocaleTimeString(),
    };
    this.logs.push(entry);
    this.render();
  },
  render() {
    const container = document.getElementById("event-log");
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
  const saved = localStorage.getItem("clicker_save");
  if (saved) {
    state = JSON.parse(saved);
    EventQueue.push("Welcome back, Captain!", "success");
  }

  document.getElementById("planet").onclick = doClick;
  render();
};

function doClick() {
  state.res += state.clickPower;
  const p = document.getElementById("planet");
  state.stats.totalClicks++;
  state.stats.totalResources++;
  checkAchievements();
  p.classList.remove("clicked");
  void p.offsetWidth;
  p.classList.add("clicked");
  setTimeout(() => {
    p.classList.remove("clicked");
  }, 50);

  render();
}

async function buyBuilding(id) {
  const b = state.buildings.find((item) => item.id === id);
  const cost = Math.floor(b.base * Math.pow(b.rate, b.count));

  const isLimitReached = b.limit && b.count >= b.limit;

  if (state.res >= cost && !isLimitReached) {
    state.res -= cost;
    b.count++;
    EventQueue.push(`Bought ${b.name} (Total: ${b.count})`, "success");
    if (b.power) {
      state.clickPower += b.power;
    }

    render();
    EventQueue.push(`Saving progress...`, "info");
    await saveProgress();
    EventQueue.push(`Progress saved!`, "success");
  } else if (isLimitReached) {
    EventQueue.push(`Warning: ${b.name} limit reached!`, `error`);
  }
}

function render() {
  document.getElementById("resource-display").innerText =
    `${Math.floor(state.res)} 💧`;
  const list = document.getElementById("buildings-list");
  list.innerHTML = "";
  let currentIncome = 0;
  state.buildings.forEach((b) => {
    if (b.inc) currentIncome += b.inc * b.count;
  });
  const incDisplay = document.querySelector(".income-display");
  if (incDisplay) {
    incDisplay.innerText = `+${currentIncome}/s`;
  }
  state.buildings.forEach((b) => {
    const cost = mCalcCost(b.base, b.rate, b.count);
    const isLimitReached = b.limit && b.count >= b.limit;
    let div = document.createElement("div");
    div.className = `shop-item ${state.res < cost || isLimitReached ? "disabled" : ""}`;
    const bonusText = b.inc > 0 ? `+${b.inc}/s` : `+${b.power} click power`;
    const priceText = isLimitReached
      ? `<b style="color: red;">MAX LEVEL</b>`
      : `Cost: ${cost}`;
    div.innerHTML = `<b>${b.name} (${b.count}${b.limit ? "/" + b.limit : ""})</b><br>${priceText} | ${bonusText}`;

    div.onclick = () => buyBuilding(b.id);
    list.appendChild(div);
    updateEvolution();
  });

  const statsContent = document.getElementById("stats-content");
  if (statsContent && state.stats) {
    const playTime = Math.floor((Date.now() - state.stats.startTime) / 1000);
    statsContent.innerHTML = `
      <p>Total Clicks: ${state.stats.totalClicks}</p>
      <p>Time in Space: ${playTime}s</p>
      <p>Total Earned: ${state.stats.totalResources}💧</p>
    `;
  }
}
function tick() {
  let income = state.buildings.reduce((sum, b) => sum + b.count * b.inc, 0);
  state.res += income;
  state.stats.totalResources += income;
  checkAchievements();
  render();
}

setInterval(tick, 1000);

function switchTab(tabName) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  event.currentTarget.classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");

  render();
}
