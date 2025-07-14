import { Action } from "./action.js";
import { GameEvent } from "./game-event.js";
import { Game } from "./game.js";
import { Patient } from "./patient.js";

const game = new Game();
game.start();
const player = game.player;

// #action-count subscribes to game.actions
const actionCount = document.getElementById("action-count");
actionCount.innerText = game.actions.value.length;
game.actions.subscribe((newValue) => {
  actionCount.innerText = newValue.length;
});

// #dice-value subscribes to game.dice
const diceValue = document.getElementById("dice-value");
diceValue.innerText = game.dice.value;
game.dice.subscribe((newValue) => {
  diceValue.innerText = newValue;
});

// #event-count subscribes to game.gameEvents
const eventCount = document.getElementById("event-count");
eventCount.innerText = game.gameEvents.value.length;
game.gameEvents.subscribe((newValue) => {
  eventCount.innerText = newValue.length;
});

// #patient-count subscribes to game.patients and game.activePatients
const patientCount = document.getElementById("patient-count");
const updatePatientCount = () => {
  patientCount.innerText =
    game.patients.value.length + game.activePatients.value.length;
};
updatePatientCount();
game.patients.subscribe(updatePatientCount);
game.activePatients.subscribe(updatePatientCount);

// #player-energy-value subscribes to player.energy
const energy = document.getElementById("player-energy-value");
energy.innerText = player.energy.value;
player.energy.subscribe((newValue) => {
  energy.innerText = newValue;
});

// Card CSS
const cardSizeCss = "w-[128px] h-[200px]";
const cardCss = `${cardSizeCss} bg-white rounded-xl shadow-lg border border-gray-300 p-[10px]`;

/**
 *
 * @param {GameEvent[]} eventHistory
 */
const renderLastEvent = (eventHistory) => {
  const lastEventEle = document.getElementById("last-event");
  lastEventEle.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = `flex flex-col justify-between ${cardCss}`;
  wrapper.innerHTML = `<div class="text-sm font-bold text-red-600">${
    eventHistory[eventHistory.length - 1].name
  }</div>
                      <div>
                        <div class="text-xs">${
                          eventHistory[eventHistory.length - 1].description
                        }</div>
                      </div>`;
  lastEventEle.appendChild(wrapper);
};
game.gameEventHistory.subscribe(renderLastEvent);

// #active-patients subscribes to game.activePatients
/**
 *
 * @param {Patient[]} patients
 */
const renderPatients = (patients) => {
  const activePatientsEle = document.getElementById("active-patients");
  activePatientsEle.innerHTML = "";
  patients.forEach((p, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = `flex flex-col justify-between ${cardCss}`;
    wrapper.onclick = () => {
      game.targetPatientIdx = idx;
    };
    wrapper.innerHTML = `<div class="text-sm font-bold text-red-600">${p.name}</div>
                        <div>
                          <div class="text-xs mb-[10px]">Symptoms: ${p.symptoms}</div>
                          <div class="text-xs">${p.description}</div>
                        </div>`;
    activePatientsEle.appendChild(wrapper);
  });
};
renderPatients(game.activePatients.value);
game.activePatients.subscribe(renderPatients);

// #hand subscribes to player.actions
/**
 *
 * @param {(Action | null)[]} playerActions
 */
const renderHand = (playerActions) => {
  const hand = document.getElementById("hand");
  hand.innerHTML = "";
  const cardIds = [];
  const cardIdPrefix = "action-";
  for (let i = 0; i < playerActions.length; i++)
    cardIds[i] = `${cardIdPrefix}${i}`;
  playerActions.forEach((pAction, idx) => {
    const playerActionUI = document.createElement("div");
    playerActionUI.id = cardIds[idx];
    if (pAction == null) {
      hand.appendChild(playerActionUI);
      playerActionUI.className = cardSizeCss;
      return;
    }
    playerActionUI.className = `flex flex-col justify-between absolute bottom-0 left-[${
      idx * 128
    }px] ${cardCss}`;
    playerActionUI.innerHTML = `<div class="text-sm font-bold text-red-600">${pAction.name}</div>
                        <div class="text-[9px]">${pAction.description}</div>`;
    playerActionUI.onclick = () => {
      if (playerActions[idx].performable(game)) player.performAction(game, idx);
    };
    hand.appendChild(playerActionUI);
  });
};
renderHand(player.actions.value);
player.actions.subscribe(renderHand);

// Bind game.endturn() to #end-turn-button
const button = document.getElementById("end-turn-button");
button.onclick = () => {
  game.endTurn();
};
