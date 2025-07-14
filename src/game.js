import { Action, ActionFactory } from "./action.js";
import { DiceState } from "./dice.js";
import { GameEvent, GameEventFactory } from "./game-event.js";
import { Patient, PatientFactory } from "./patient.js";
import { Player } from "./player.js";
import { State } from "./state.js";

export const GameStates = Object.freeze({
  IN_PROGESS: "Progress",
  PLAYER_LOST: "Player lost",
});

export class Game {
  /**
   * @type {State}
   * @see {Action[]}
   */
  actions;
  /**
   * @type {State}
   * @see {Patient[]}
   */
  activePatients;
  /**
   * @type {DiceState}
   */
  dice;
  /**
   * @type {State}
   * @see {GameEvent[]}
   */
  gameEvents;
  /**
   * @type {State}
   * @see {GameStates}
   */
  gameStatus;
  /**
   * @type {State}
   * @see {Patient[]}
   */
  patients;
  /**
   * @type {Player}
   */
  player;
  /**
   * @type {number}
   */
  targetPatientIdx;

  start() {
    const initialPatients = PatientFactory.createInitialPatients(10);
    this.actions = new State(ActionFactory.createInitialActions(10));
    this.activePatients = new State([initialPatients.pop()]);
    this.dice = new DiceState(1);
    this.gameEvents = new State(GameEventFactory.createInitialGameEvents(10));
    this.gameEventHistory = new State([]);
    this.gameStatus = new State(GameStates.IN_PROGESS);
    this.patients = new State(initialPatients);
    this.player = new Player();
    this.player.actions.value = ActionFactory.createInitialActions(5);
    this.player.energy.subscribe((newValue) => {
      if (newValue <= 0) this.gameStatus.value = GameStates.PLAYER_LOST;
    });
    this.targetPatientIdx = 0;
  }

  endTurn() {
    // Replenish active patients
    while (
      this.activePatients.value.length < 1 &&
      this.patients.value.length > 0
    )
      this.activePatients.value.push(this.patients.value.pop());
    this.activePatients.notifyAll();
    this.patients.notifyAll();

    // Activate event
    if (this.gameEvents.value.length > 0) {
      this.gameEventHistory.value.push(this.gameEvents.value.pop());
      this.gameEventHistory.value[
        this.gameEventHistory.value.length - 1
      ].activate(this);
      this.gameEventHistory.notifyAll();
      this.gameEvents.notifyAll();
    }

    // Replenish player actions to 5
    if (this.actions.value.length > 0) {
      for (let i = 0; i < 5; i++) {
        if (this.player.actions.value[i] == null)
          this.player.actions.value[i] = this.actions.value.pop();
        if (this.actions.value.length < 1) break;
      }
    }
    this.actions.notifyAll();
    this.player.actions.notifyAll();
  }
}
