class ResourceStreamer {
  constructor(gameState) {
    this.gameState = gameState;
  }
  async *generateLogs() {
    while (true) {
      await new Promise((r) => setTimeout(r, 3000));
      yield {
        time: new Date().toLocaleTimeString(),
        income: this.gameState.buildings.reduce(
          (s, b) => s + b.count * (b.incomePerSecond || 0),
          0,
        ),
      };
    }
  }
}
