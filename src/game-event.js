import { Game } from "./game.js";

export class GameEvent {
  name = "Game event";
  description = "Does something.";
  /**
   *
   * @param {Game} game
   */
  activate(game) {
    throw new Error("Meant to be overriden");
  }
}

export class GainEnergy extends GameEvent {
  name = "Gain energy";
  description = "Gain 1 energy";

  /**
   *
   * @param {Game} game
   */
  activate(game) {
    game.player.energy.value += 1;
  }
}

export class GameEventFactory {
  constructor() {
    throw new Error("This class is not meant to be instantiated!");
  }

  static createInitialGameEvents(count) {
    const gameEventSet = [GainEnergy];
    const result = [];
    for (let i = 0; i < count; i++)
      result.push(
        new gameEventSet[Math.floor(Math.random() * gameEventSet.length)]()
      );
    return result;
  }
}
