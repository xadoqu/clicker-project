let state = { res: 0, level: 1 };

window.onload = () => {
    document.getElementById('planet').onclick = () => {
        state.res += 1;
        render();
    };
};

function render() {
    document.getElementById('resource-display').innerText = `${state.res} 💧`;
}