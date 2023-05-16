/**
 * Reference to the HTML canvas element where the game is rendered.
 * @type {HTMLElement}
 */
let canvas;

/**
 * Creates a new Keyboard object that's used for capturing keyboard inputs.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * An array to store all interval IDs that are created during the game.
 * @type {number[]}
 */
let allIntervals = [];

/**
 * Whether the game is paused (true) or playing (false). As per that the given function as argument into the function
 * {@link setStoppableInterval} will be executed or paused.
 * @type {boolean}
 */
let pause = false;

/**
 * Whether the game is over (true) or not (false).
 * @type {boolean}
 */
let gameOver = true;

/**
 * Whether the music is muted (true) or not (false).
 * @type {boolean}
 */
let musicMuted = false;

/**
 * Whether the sounds are muted (true) or not (false).
 * @type {boolean}
 */
let soundsMuted = false;

/**
 * Initializes the game.
 * @async
 * @function
 */
async function init() {
  try {
    // showLogOutDetectedTouchEvent();
    setVisibilityOfEnterExitFullScreenBtn();
    blockSelectContextMenuZoomMagnifierOnTouchDevice();
    canvas = getElem('canvas');
    checkOrientationSetContentElements();
    let preloadImagesSoundsPromise = preloadImagesSounds(imagePaths, sounds);
    await preloadImagesSoundsPromise;
    resetLevelAndWorldSingleton();
    applyOnClickEventListenerToAllButtons();
    applyMouseUpDownEventListeners();
    setScreenBtnsAsPerGameState('start');
    hideLoadingScreen();
  } catch (error) {
    giveInitErrorReloadApp(error);
  }
}

/**
 * Returns the HTML element with the given id.
 * @param {string} id - The id of the HTML element.
 * @returns {HTMLElement} - The HTML element with the given id.
 */
function getElem(id) {
  return document.getElementById(id);
}

/**
 * Resets the level and the singleton instance of the world.
 */
function resetLevelAndWorldSingleton() {
  level1 = null;
  worldSingletonInstance = null;
  WorldSingleton.removeInstance();
  initLevel();
  worldSingletonInstance = WorldSingleton.getInstance(canvas, keyboard);
}

/**
 * Handles and displays an error message when there's an issue initializing the game, then reloads the page.
 * @param {Error} error - The error that occurred during initialization.
 */
function giveInitErrorReloadApp(error) {
  console.error(error);
  alert(
    'Loading required image or sounds resources for the game failed.' +
      `\n\nDetailed error message: ${error}` +
      '\n\nPress OK to try to reload the webpage and resources again!'
  );
  location.reload();
}

/**
 * Starts the game.
 * @async
 */
async function startGame() {
  if (worldSingletonInstance.character) worldSingletonInstance.character.health = 0;
  setTimeout(() => {
    getElem('resetBtn').classList.remove('clickBtn');
    worldSingletonInstance.stopDrawing();
    clearAllStoppableIntervals();
    pause = false;
    resetPausePlayBtn();
    resetCreateCanvasElement();
    resetAllSound();
    resetLevelAndWorldSingleton();
    setScreenBtnsAsPerGameState('running');
    worldSingletonInstance.run();
    playBgMusic();
    if (musicMuted) turnMusicOff();
  }, 330);
}

/**
 * Pauses or plays the game.
 */
function pausePlayGame() {
  if (pause) pause = false;
  else pause = true;
}

/**
 * Sets a pausable/playable interval of the given function and time. Saves it under an id and pushes it the
 * 'allIntervals' array. The given function will be executed (played) or paused as per {@link pause} variable value.
 * @param {function} fn - The function for which an interval is to set.
 * @param {number} time - The milliseconds of the interval to set.
 * @returns {number} The id of the interval.
 */
function setStoppableInterval(fn, time) {
  let intervalId = setInterval(function () {
    if (!pause) fn();
  }, time);
  allIntervals.push(intervalId);
  return intervalId;
}

/**
 * Stops the game by clearing all running intervals saved in 'allIntervals' array and resets the array.
 */
function clearAllStoppableIntervals() {
  allIntervals.forEach((interval) => clearInterval(interval));
  allIntervals = [];
}
