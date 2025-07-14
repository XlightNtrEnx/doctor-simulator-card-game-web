import { State } from "./state.js";

export class DiceState extends State {
  /**
   * @returns {number}
   */
  roll() {
    const result = 1 + Math.floor(Math.random() * 6);
    this.value = result;
    return result;
  }
}
