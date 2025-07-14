import { Action } from "./action.js";
import { Game } from "./game.js";
import { State } from "./state.js";

class EnergyState extends State {}

class ActionsState extends State {
  /**
   * @returns {Action[]}
   */
  get value() {
    return super.value;
  }

  /**
   * @param {Action[]} value
   */
  set value(value) {
    super.value = value;
  }
}

export class Player {
  energy = new EnergyState(10);
  actions = new ActionsState([]);

  increaseEnergy(value) {
    this.energy.value += value;
  }

  /**
   *
   * @param {Game} game
   * @param {number} idx
   */
  performAction(game, idx) {
    this.actions.value[idx].perform(game);
    this.actions.value[idx] = null;
    this.actions.notifyAll();
  }

  reduceEnergy(value) {
    this.energy.value -= value;
  }
}
