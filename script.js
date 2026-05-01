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
      limit: 10,
    },
    {
      id: 3,
      name: "Storm Generator",
      base: 4000,
      rate: 1.2,
      inc: 50,
      count: 0,
      limit: 10,
    },
    {
      id: 4,
      name: "Hurricane Engine",
      base: 20000,
      rate: 1.2,
      inc: 200,
      count: 0,
      limit: 10,
    },
  ],
};
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
  document.getElementById("resource-display").innerText = `${state.res} 💧`;
  const list = document.getElementById("buildings-list");
  list.innerHTML = "";
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
  });
}
function tick() {
  let income = state.buildings.reduce((sum, b) => sum + b.count * b.inc, 0);
  state.res += income;
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
