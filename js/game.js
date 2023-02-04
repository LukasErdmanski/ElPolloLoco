let canvas;
let world;
let keyboard = new Keyboard();
let allIntervals = [];
/**
 * Storage if the game is paused (equal to true) or playing (equal to false). As per that the given function as 
 * argument into the function {@link setStoppableInterval} will be executed or paused.
 * @type {boolean}
 */
let pause = false;
let gameOver = true;
const CONTROLLER_BUTTONS = [
  {
    keyName: 'LEFT',
    keyCode: 37,
  },
  {
    keyName: 'UP',
    keyCode: 38,
  },
  {
    keyName: 'RIGHT',
    keyCode: 39,
  },
  /*   {
    keyName: 'SPACE',
    keyCode: 32,
  }, */
  {
    keyName: 'A',
    keyCode: 65,
  },
  {
    keyName: 'S',
    keyCode: 83,
  },
  {
    keyName: 'D',
    keyCode: 68,
  },
];

/**
 * Returns the HTMLelement with the given id.
 * @param {string} id - The id of the HTMLelement you want to get.
 * @returns {HTMLElement} The HTMLelement with the given id.
 */
function getElem(id) {
  return document.getElementById(id);
}

function init() {
  setScreenBtnsAsPerGameState('running');

  canvas = getElem('canvas');

  // TODO: Hier bei Game End: alle laufende (Game, Sound) Intervalle clearen (aus einer vorher gesammelten Invervall Collection beim Game Ende)
  // TODO: Alle Sounds stoppen UND ZURÜCKSETZEN
  // TODO: Canvan mit setTimeOut von 500 ms starten, damit am Anfang canvan nicht ruckelt.

  stopGame();

  initLevel();

  world = new World(canvas, keyboard);

  applyOnClickEventListenerToAllButtons();
  applyMouseTouchUpDownEventListeners();

  checkOrientationSetContentElements();

  console.log('My character is', world.character);
}

/**
 * Sets the screen and buttons as per the game state ('start / running / over').
 */
function setScreenBtnsAsPerGameState(gameState) {
  if (gameState == 'start') {
    setBtnsAsPerGameState('startBtn');
    setScreenAsPerGameState('startScreen');
  }
  if (gameState == 'running') {
    setBtnsAsPerGameState();
    setScreenAsPerGameState();
  }
  if (gameState == 'over') {
    setBtnsAsPerGameState('resetBtn');
    setScreenAsPerGameState('gameOverScreen');
  }
}

function setBtnsAsPerGameState(idOfVisibleBtn) {
  let allBtns = getElem('buttonsRowBottom').getElementsByTagName('button');

  for (const btn of allBtns) {
    if (idOfVisibleBtn && btn.id != idOfVisibleBtn) {
      btn.classList.add('dNone');
    } else {
      btn.classList.remove('dNone');
    }
  }

  if (idOfVisibleBtn != 'startBtn') getElem('startBtn').classList.add('dNone');
}

function setScreenAsPerGameState(ifOfVisibleScreen) {
  getElem('startScreen').classList.add('dNone');
  getElem('gameOverScreen').classList.add('dNone');

  if (ifOfVisibleScreen) getElem(ifOfVisibleScreen).classList.remove('dNone');
}

/**
 * Hides the start screen and the start button, shows the pause / play button.
 */
function hideStartScreenAndBtnShowResetBtn() {
  getElem('startScreen').classList.add('dNone');
  getElem('startBtn').classList.add('dNone');

  getElem('resetBtn').classList.remove('dNone');
}

/**
 * Applies the event listener for key up event to the window object and sets the property of the keyboard object (equal
 * to the held key name) as true.
 */
window.addEventListener('keydown', (event) => {
  // console.log(event);
  setTrueOrFalseTheKeyboardProperty(event, true);
});

/**
 * Applies the event listener for key down event to the window object and sets the property of the keyboard object (equal
 * to the released key name) as false.
 */
window.addEventListener('keyup', (event) => {
  // console.log(event);
  setTrueOrFalseTheKeyboardProperty(event, false);
});

/**
 * Sets the keyboard property (equal to key name) true or false, adds the highlight effect to the equal cotroller
 * button when it is true, removes the highlight effect to the equal button when it is false.
 * @param {event} event - The given keyboard event..
 * @param {boolean} keyboardPropertyValue - The value to assign to the property of the keyboard object (equal to key name).
 */
function setTrueOrFalseTheKeyboardProperty(event, keyboardPropertyValue) {
  if (world.character.health != 0) {
    for (const keyObject in CONTROLLER_BUTTONS) {
      if (Object.hasOwnProperty.call(CONTROLLER_BUTTONS, keyObject)) {
        const keyCodeOfKeyObject = CONTROLLER_BUTTONS[keyObject].keyCode;
        const keyNameOfKeyObject = CONTROLLER_BUTTONS[keyObject].keyName;
        if (event.keyCode == keyCodeOfKeyObject) {
          keyboard[keyNameOfKeyObject] = keyboardPropertyValue;

          const idOfCotrollerBtn = CONTROLLER_BUTTONS[keyObject].keyName;
          let controllerButton = getElem(idOfCotrollerBtn);
          checkIfAddOrRemoveBtnHighlightAddDoIt(controllerButton, keyboardPropertyValue);
        }
      }
    }
  }
}

/**
 * Checks if the given keyboardPropertyValue is true or false. If it is true, it adds the highlight effect to the given
 * controller button. If it is false, it removes the highlight effect from the given controller button.
 * @param {HTMLButtonElement} controllerButton - The given controller button you want to add or remove the highlight effect.
 * @param {boolean} keyboardPropertyValue - The given keyboardPropertyValue. It is true if the controller button or the
 * corresponding key is held. It is false if they are released.
 */
function checkIfAddOrRemoveBtnHighlightAddDoIt(controllerButton, keyboardPropertyValue) {
  // console.log(keyboardPropertyValue);
  if (keyboardPropertyValue) {
    addBtnHighlight(controllerButton);
  } else {
    removeBtnHighlight(controllerButton);
  }
}

/**
 * Adds the highlight effect of the button element.
 * @param {HTMLButtonElement} element - The button element to add the highlight effect.
 */
function addBtnHighlight(element) {
  element.classList.add('clickBtn');
}

/**
 * Removes the highlight effect of the button element.
 * @param {HTMLButtonElement} element - The button element to remove the highlight effect.
 */
function removeBtnHighlight(element) {
  element.classList.remove('clickBtn');
}

/**
 * Applies the event listeners for mouse / touch up and down events to all controller buttons."
 */
function applyMouseTouchUpDownEventListeners() {
  applyEventListenerToAllControllerButtons('mousedown', true);
  applyEventListenerToAllControllerButtons('mouseup', false);
  applyEventListenerToAllControllerButtons('touchstart', true);
  applyEventListenerToAllControllerButtons('touchend', false);
}

/**
 * Applys an event listener to all controller buttons.
 * @param {string} event - The event to apply.
 * @param {boolean} keyboardPropertyValue - The value to assign to the property of the keyboard object.
 */
function applyEventListenerToAllControllerButtons(event, keyboardPropertyValue) {
  for (const keyObject in CONTROLLER_BUTTONS) {
    if (Object.hasOwnProperty.call(CONTROLLER_BUTTONS, keyObject)) {
      const idOrKeyName = CONTROLLER_BUTTONS[keyObject].keyName;
      let controllerButton = getElem(idOrKeyName);
      controllerButton.addEventListener(event, (event) => {
        event.preventDefault();
        keyboard[idOrKeyName] = keyboardPropertyValue;
        checkIfAddOrRemoveBtnHighlightAddDoIt(controllerButton, keyboardPropertyValue);
      });
    }
  }
}

/**
 * "Applies the event listeners for click event to all buttons."
 */
function applyOnClickEventListenerToAllButtons() {
  const ALL_BUTTONS = getElem('buttonsLayer').getElementsByTagName('button');

  for (let i = 0; i < ALL_BUTTONS.length; i++) {
    const button = ALL_BUTTONS[i];
    button.addEventListener('click', () => {
      highlightBtn(button);
    });
  }
}

/**
 * Highlight the button element on click event.
 * @param {HTMLButtonElement} element - The button element to highlight.
 */
function highlightBtn(element) {
  addBtnHighlight(element);
  setTimeout(() => {
    removeBtnHighlight(element);
  }, 225);
}

/**
 * Executes currently set function on click event. Changes the 'onclick' attrubute to new function and the button icon.
 * @param {string} currentFn - The name of the function that is currently to be executed.
 * @param {strin} newFn - The name of the function to be executed next.
 * @param {HTMLButtonElement}btnElem - The button element that was clicked
 * @param {strin} newSrc - The new source of the button icon.
 */
function exeFnChangeOnclickAndBtnSrc(currentFn, newFn, btnElem, newSrc) {
  let currentSrc = changeBtnIcon(btnElem, newSrc);

  let newOnCLickValue = `exeFnChangeOnclickAndBtnSrc('${newFn}', '${currentFn}', this, '${currentSrc}')`;
  btnElem.setAttribute('onclick', newOnCLickValue);

  let exeFn = new Function(`${currentFn}()`);
  exeFn();
}

/**
 * Changes the src of the button icon.
 * @param {HTMLButtonElement} elem - The button element that you want to change the icon of.
 * @param {string} newSrc - The source of the new icon.
 */
function changeBtnIcon(btnElem, newSrc) {
  let imgElem = btnElem.firstElementChild;
  let currentSrc = imgElem.src;
  imgElem.src = newSrc;
  return currentSrc;
}

/**
 * Turns off the music.
 */
function turnMusicOff() {
  console.log('MUSIC IS OFFFFFFFFFFFFFFFF');
}

/**
 * Turns on the music.
 */
function turnMusicOn() {
  console.log('MUSIC IS Onnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
}

/**
 * Turns off the sounds.
 */
function turnSoundsOff() {
  console.log('ALL SOUNDS IS OFFFFFFFFFFFFFFFF');
}

/**
 * Turns on the sound.
 */
function turnSoundsOn() {
  console.log('ALL SOUNDS Onnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
}

/**
 * Pauses or plays the game.
 */
function pausePlayGame() {
  if (pause) {
    pause = false;
  } else {
    pause = true;
  }
}

/**
 * Sets a pausable/playable interval of the given function and time. Saves it under an id and pushes it the 
 * 'allIntervals' array. The given fuction will be executed (played) or paused as per {@link pause} variable value.
 * @param {function} fn - The given function for which a interval is to set.
 * @param {number} time - The miliseconds of the interval to set.
 */
function setStoppableInterval(fn, time) {
  let intervalId = setInterval(() => {if (!pause) fn()}, time);
  allIntervals.push(intervalId);
}

/**
 * Stops the game by clearing all running intervals saved in 'intervalIds' array.
 */
function stopGame() {
  /**
   * Alle intervalle beenden.
   *
   * forEach-Schleife nimmt als Parameter die Funktion 'clearInterval' automatisch mit dem jeweiligen
   * intervallIds-Element als Parameter für die 'clearInterval' Funktion, ohne das intervallIds-Element extra in den
   * Klammern hinter 'clearInterval' zu schreiben.
   */
  allIntervals.forEach((interval) => {
    clearInterval(interval);
  });

  allIntervals = [];
}

async function enterFullscreen() {
  fullscreenContent = getElem('content');
  await fullscreenContent.requestFullscreen();

  checkOrientationSetContentElements();
}

async function exitFullscreen() {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    await document.webkitExitFullscreen();
  }

  checkOrientationSetContentElements();
}

window.addEventListener('resize', checkOrientationSetContentElements);
window.addEventListener('orientationchange', checkOrientationSetContentElements);

function checkOrientationSetContentElements() {
  detectIfBrowserIsOperaAndSetCanvasHeightIfYes();
  switchContentVisibilityAsPerOrientation();
  adjustWidthHeightOfScreensButtonLayer();
  setVisibilityFullscreenBtn();
  turnOnOffHoverEffectForBtns();
}

function switchContentVisibilityAsPerOrientation() {
  if (getIfOrientationLandscape()) {
    getElem('title').classList.remove('dNone');
    getElem('rotateDeviceInfo').classList.add('dNone');
    getElem('content').classList.remove('dNone');
  } else {
    getElem('title').classList.add('dNone');
    getElem('rotateDeviceInfo').classList.remove('dNone');
    getElem('content').classList.add('dNone');
  }
}

function getIfOrientationLandscape() {
  if (window.matchMedia('(orientation: landscape)').matches) {
    console.log('LANDSCAPE');
    return true;
  } else {
    console.log('PORTRAIT');
    return false;
  }
}

function detectIfBrowserIsOperaAndSetCanvasHeightIfYes() {
  // Get the user-agent string
  let userAgentString = navigator.userAgent;
  // Detect Chrome
  let chromeAgent = userAgentString.indexOf('Chrome') > -1;
  // Detect Opera
  let operaAgent = userAgentString.indexOf('OP') > -1;

  // Check if the user-agent of the Opera browser is “OP” and this includes the Chrome browser’s user-agent.
  if (chromeAgent && operaAgent) {
    // Yes, this means that the browser is Opera. Discard Chrome since it also matches Opera.
    chromeAgent = false;
    // Set the canvas height for Opera browser if the orientation is landscape.
    setCanvasHeightForOperaAsLandscape();
  }
}

/**
 * Special function for the Opera browser. For devices with the display height below 480 px in the landspace orientation, the default setting
 * height = 100vh for canvas element does not work in the Opera browser. This function sets it.
 */
function setCanvasHeightForOperaAsLandscape() {
  if (window.matchMedia('(orientation: landscape)').matches) {
    if (window.innerHeight <= 480) {
      let newHeight = window.innerHeight;
      getElem('canvas').style.height = `${newHeight}px`;
    }
  } else {
    getElem('canvas').style.height = `100%`;
  }
}

function adjustWidthHeightOfScreensButtonLayer() {
  getElem('screensButtonsLayerContainer').removeAttribute('style');

  let canvasHeight = getElem('canvas').clientHeight;
  let canvasWidth = getElem('canvas').clientWidth;

  let canvasRatio = canvasWidth / canvasHeight;

  console.log(canvasRatio);

  if (canvasRatio < 2) {
    console.log('HIER DRIN!!');
    let buttonsLayerHeight = canvasWidth / 2;
    getElem('screensButtonsLayerContainer').style.height = `${buttonsLayerHeight}px`;
    getElem('screensButtonsLayerContainer').style.width = `${canvasWidth}px`;
  }

  hideTitle();
}

function hideTitle() {
  let canvas = getElem('canvas');
  let title = getElem('title');
  if (window.innerHeight <= canvas.clientHeight + 160 || getIfRotateDveiceInfoVisible()) {
    title.classList.add('dNone');
  } else {
    title.classList.remove('dNone');
  }
}

function getIfRotateDveiceInfoVisible() {
  return !getElem('rotateDeviceInfo').classList.contains('dNone');
}

function setVisibilityFullscreenBtn() {
  if (getIfCanvasTakeFullDeviceDimensions() && !document.fullscreenElement) {
    getElem('enterExitFullScreenBtn').classList.add('dNone');
  } else {
    getElem('enterExitFullScreenBtn').classList.remove('dNone');
  }
}

function getIfCanvasTakeFullDeviceDimensions() {
  let canvas = getElem('canvas');
  if (canvas.clientWidth == screen.width && canvas.clientHeight == screen.height) {
    console.log('Yeeeeeeeeeeeees');
    return true;
  } else {
    console.log('Noooooooooooooo');
    return false;
  }
}

function turnOnOffHoverEffectForBtns() {
  let allBtns = getElem('buttonsLayer').getElementsByTagName('button');

  for (const btn of allBtns) {
    if (getIfDeviceIsMobileOrTablet()) {
      btn.classList.remove('btnHoverEffect');
    } else {
      btn.classList.add('btnHoverEffect');
    }
  }
}

function getIfDeviceIsMobileOrTablet() {
  // Detect if at least one pointing device has limited accuracy. If yes, it is a mobile / tablet device.
  return window.matchMedia('(any-pointer:coarse)').matches;
}

checkOrientationSetContentElements();
setScreenBtnsAsPerGameState('start');

document.addEventListener('dead', (e) => {
  console.log(e);
});

function name(params) {
  let abc = 42343;

  cde;

  if (true) {
    let cde = 3333;

    abc;
  }
}
