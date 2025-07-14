import { Player } from "./player.js";
import { Game } from "./game.js";

/**
 * @abstract
 */
export class Action {
  /**
   * @type {string}
   */
  description;
  /**
   * @type {string}
   */
  name;
  /**
   * @type {number}
   */
  energyCost = 1;

  /**
   *
   * @param {Game} game
   */
  perform(game) {
    game.player.reduceEnergy(this.energyCost);
  }

  /**
   *
   * @param {Game} game
   * @returns {true}
   */
  performable(game) {
    return true;
  }
}

export class Snack extends Action {
  name = "Snack 🍫";
  description =
    "You bite into your chocalate bar that you always keep with you for emergencies. You tend to be too tired and forget to check for its expiry date. Gain 1 energy when greater than 2 is rolled and lose 2 otherwise ";
  /**
   *
   * @param {Game} game
   */
  perform(game) {
    if (game.dice.roll() > 2) {
      game.player.increaseEnergy(1);
    } else {
      game.player.reduceEnergy(2);
    }
  }
}

export class TreatPatientAction extends Action {
  /**
   *
   * @param {Game} game
   */
  perform(game) {
    super.perform(game);
    game.activePatients.value.pop(game.targetPatientIdx);
    game.activePatients.notifyAll();
  }

  /**
   *
   * @param {Game} game
   * @returns {boolean}
   */
  performable(game) {
    if (game.activePatients.value.length > game.targetPatientIdx) return true;
    return false;
  }
}

class Zen extends TreatPatientAction {
  name = "Zen 🔥";
  description =
    "The stars aligned, allowing you to  perfectly diagnose and prescribe the most effective treatment without breaking a sweat. Patient gets treated without any effect.";
  energyCost = 0;
}

class MaxEffort extends TreatPatientAction {
  name = "Maximum Effort 💪";
  description =
    "Your brain starts working overtime to figure out exactly what is wrong with this patient. Treat the patient and reduce energy by 1.";
}

export class ActionFactory {
  /**
   *
   * @param {number} count
   * @param {Game} game
   * @returns
   */
  static createInitialActions(count) {
    const pool = this.allRegisteredActions();
    const actions = [];
    for (let i = 0; i < count; i++)
      actions.push(new pool[Math.floor(Math.random() * pool.length)]());
    return actions;
  }

  static allRegisteredActions() {
    return [Zen, MaxEffort, Snack];
  }
}
