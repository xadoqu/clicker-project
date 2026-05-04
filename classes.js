class ResourceStreamer {
  constructor(gameState) {
    this.gameState = gameState;
  }
  async *generateLogs() {
    while (true) {
      await new Promise((r) => setTimeout(r, 3000));
      const currentIncome = this.gameState.buildings.reduce((s, b) => {
        const perBuilding = b.inc || b.incomePerSecond || 0;
        return s + b.count * perBuilding;
      }, 0);

      yield {
        time: new Date().toLocaleTimeString(),
        income: currentIncome,
      };
    }
  }
}
