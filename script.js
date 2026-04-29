let state = {
  res: 0,
  level: 1,
  buildings: [{ name: "Vapor Collector", base: 15, rate: 1.15, count: 0 }],
};

window.onload = () => {
  document.getElementById("planet").onclick = () => {
    state.res += 1;
    render();
  };
};

function render() {
  document.getElementById("resource-display").innerText = `${state.res} 💧`;
}
