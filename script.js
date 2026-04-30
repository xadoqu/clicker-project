let state = {
  res: 0,
  level: 1,
  buildings: [
    { id: 0, name: "Vapor Collector", base: 50, rate: 1.15, inc: 1, count: 0 },
  ],
};

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

const mCalcCost = memoize((base, rate, count) => {
  return Math.floor(base * Math.pow(rate, count));
});

window.onload = () => {
  document.getElementById("planet").onclick = doClick;
  render();
};

function doClick() {
  state.res += 1;
  const p = document.getElementById("planet");

  p.classList.remove("clicked");
  void p.offsetWidth;
  p.classList.add("clicked");
  setTimeout(() => {
    p.classList.remove("clicked");
  }, 50);

  render();
}

function buyBuilding(id) {
  const b = state.buildings.find((item) => item.id === id);
  const cost = Math.floor(b.base * Math.pow(b.rate, b.count));

  if (state.res >= cost) {
    state.res -= cost;
    b.count++;
    render();
  }
}

function render() {
  document.getElementById("resource-display").innerText = `${state.res} 💧`;
  const list = document.getElementById("buildings-list");
  list.innerHTML = "";
  state.buildings.forEach((b) => {
    const cost = Math.floor(b.base * Math.pow(b.rate, b.count));
    let div = document.createElement("div");
    div.className = `shop-item ${state.res < cost ? "disabled" : ""}`;
    div.innerHTML = `<b>${b.name} (${b.count})</b><br>Cost: ${cost} | +${b.inc}/s`;
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
