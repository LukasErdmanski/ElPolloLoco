/**
 * Es wäre umständlich, alle einzelnen Intervalle in globale einzelne Variablen zu speichern und diese damit aufeinmal
 * (einnzel) zu stoppen. Deshalb werden alle Intervalle mit ihrer ID im Array gespeichert.
 */
let _intervalIds = [];

let i = 1;

/**
 * Sets a interval of the given function and time. Saves it under an id and pushes it the 'intervalIds' array.
 * @param {function} fn - The given function for which a interval is to set.
 * @param {numer} time - The miliseconds of the interval to set.
 */
function _setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  _intervalIds.push(id);
}

// Im world gibt es viele (parallel) laufende Intervalle, wie z.B. Chicken-Lauf, Endboss-Lauf, Character-Lauf etc.
// _setStoppableInterval(sayHello, 500);
// _setStoppableInterval(sayGoodbye, 500);

/**
 * Stops all running intervals saved in 'intervalIds' array.
 */
function _stopGame() {
  /**
   * Alle intervalle beenden.
   *
   * forEach-Schleife nimmt als Parameter die Funktion 'clearInterval' automatisch mit dem jeweiligen
   * intervallIds-Element als Parameter für die 'clearInterval' Funktion, ohne das intervallIds-Element extra in den
   * Klammern hinter 'clearInterval' zu schreiben.
   */
  intervalIds.forEach(clearInterval);
}

function sayHello() {
  console.log('Hallo', i);
  i++;
}

function sayGoodbye() {
  console.log('Tchüss', i);
  i++;
}
