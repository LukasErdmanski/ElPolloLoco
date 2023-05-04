/**
 * Resets the canvas element.
 */
function resetCreateCanvasElement() {
  canvas.remove();
  let element = document.createElement('canvas');
  getElem('content').append(element);
  element.id = 'canvas';
  canvas = getElem('canvas');
  canvas.width = 960;
  canvas.height = 480;
}

/**
 * Sets the screen and buttons based on the game state.
 * @param {('start'|'running'|'loss'|'win')} gameState - The current game state.
 */
function setScreenBtnsAsPerGameState(gameState) {
  const stateActions = {
    start: ['startBtn', 'startScreen'],
    running: [undefined, undefined],
    loss: ['resetBtn', 'lossScreen'],
    win: ['resetBtn', 'winScreen'],
  };
  let actions = stateActions[gameState];
  setBtnsAsPerGameState(actions[0]);
  setScreenAsPerGameState(actions[1]);
}

/**
 * Sets the visibility of the game buttons according to the current game state.
 * @param {string} idOfVisibleBtn - The id of the visible button.
 */
function setBtnsAsPerGameState(idOfVisibleBtn) {
  let allBtns = getElem('buttonsRowBottom').getElementsByTagName('button');
  for (const btn of allBtns) {
    if (idOfVisibleBtn && btn.id != idOfVisibleBtn) btn.classList.add('dNone');
    else btn.classList.remove('dNone');
  }
  if (idOfVisibleBtn != 'startBtn') getElem('startBtn').classList.add('dNone');
}

/**
 * Sets the visibility of the game screens according to the current game state.
 * @param {string} idOfVisibleScreen - The id of the visible screen.
 */
function setScreenAsPerGameState(idOfVisibleScreen) {
  getElem('startScreen').classList.add('dNone');
  getElem('lossScreen').classList.add('dNone');
  getElem('winScreen').classList.add('dNone');
  if (idOfVisibleScreen) getElem(idOfVisibleScreen).classList.remove('dNone');
}

/**
 * Hides the loading screen and shows the start screen of the game.
 */
function hideLoadingScreen() {
  getElem('loadingScreen').classList.add('translateLoadingScreen');
}

/**
 * Applies the event listener for key up event to the window object and sets the property of the keyboard object (equal
 * to the held key name) as true.
 */
window.addEventListener('keydown', (event) => setKeyObjIsPressedProperty(event, true));

/**
 * Applies the event listener for key down event to the window object and sets the property of the keyboard object
 * (equal to the released key name) as false.
 */
window.addEventListener('keyup', (event) => setKeyObjIsPressedProperty(event, false));

/**
 * Sets the key object property 'isPressed' of the keyboard object true or false, adds the highlight effect to the
 * equal controller button when it is true, removes the highlight effect to the equal button when it is false.
 * @param {KeyboardEvent} event - The given keyboard event.
 * @param {boolean} isPressedValue - The value to assign to the key object property 'isPressed' of the keyboard object.
 */
function setKeyObjIsPressedProperty(event, isPressedValue) {
  for (const keyObj in keyboard) {
    if (Object.hasOwnProperty.call(keyboard, keyObj)) {
      if (event.keyCode == keyboard[keyObj].keyCode) {
        keyboard[keyObj].isPressed = isPressedValue;
        const idOfCotrollerBtn = keyObj;
        let controllerButton = getElem(idOfCotrollerBtn);
        checkIfAddOrRemoveBtnHighlightAddDoIt(controllerButton, isPressedValue);
      }
    }
  }
}

/**
 * Checks if the given 'isPressedValue' is true or false. If it is true, it adds the highlight effect to the given
 * controller button. If it is false, it removes the highlight effect from the given controller button.
 * @param {HTMLButtonElement} controllerButton - The given controller button you want to add or remove the highlight effect.
 * @param {boolean} isPressedValue - The given 'isPressedValue'. It is true if the controller button or the
 * corresponding key is held. It is false if they are released.
 */
function checkIfAddOrRemoveBtnHighlightAddDoIt(controllerButton, isPressedValue) {
  if (isPressedValue) addBtnHighlight(controllerButton);
  else removeBtnHighlight(controllerButton);
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
 * Applies the event listeners for click event to all buttons.
 */
function applyOnClickEventListenerToAllButtons() {
  const ALL_BUTTONS = getElem('buttonsLayer').getElementsByTagName('button');
  for (let i = 0; i < ALL_BUTTONS.length; i++) {
    const button = ALL_BUTTONS[i];
    button.addEventListener('click', () => highlightBtn(button));
  }
}

/**
 * Highlights the button element on click event.
 * @param {HTMLButtonElement} element - The button element to highlight.
 */
function highlightBtn(element) {
  addBtnHighlight(element);
  setTimeout(() => removeBtnHighlight(element), 225);
}

/**
 * Applies the event listeners for mouse/touch up and down events to all controller buttons.
 */
function applyMouseTouchUpDownEventListeners() {
  applyEventListenerToAllControllerButtons('mousedown', true);
  applyEventListenerToAllControllerButtons('mouseup', false);
  applyEventListenerToAllControllerButtons('touchstart', true);
  applyEventListenerToAllControllerButtons('touchend', false);
}

/**
 * Applies an event listener to all controller buttons.
 * @param {string} event - The event to apply.
 * @param {boolean} isPressedValue - The value to assign to the key object property 'isPressed' of the keyboard object.
 */
function applyEventListenerToAllControllerButtons(event, isPressedValue) {
  for (const keyObj in keyboard) {
    if (Object.hasOwnProperty.call(keyboard, keyObj)) {
      const idOfCotrollerBtn = keyObj;
      let controllerButton = getElem(idOfCotrollerBtn);
      controllerButton.addEventListener(event, (event) => {
        event.preventDefault();
        keyboard[keyObj].isPressed = isPressedValue;
        checkIfAddOrRemoveBtnHighlightAddDoIt(controllerButton, isPressedValue);
      });
    }
  }
}

/**
 * Resets the pause and play button.
 */
function resetPausePlayBtn() {
  getElem('pausePlayBtn').remove();
  let pausePlayBtn = /* html */ `
        <button id="pausePlayBtn" onclick="exeFnChangeOnclickAndBtnSrc('pausePlayGame', 'pausePlayGame', this, 'img/10_buttons/play-button.png')"><img src="img/10_buttons/pause-128.png" alt="pause-play-button-icon"></button>
      `;
  let buttonsRowBottomButtonsGroupCenter = getElem('buttonsRowBottomButtonsGroupCenter');
  buttonsRowBottomButtonsGroupCenter.innerHTML += pausePlayBtn;
}

/**
 * Executes currently set function on click event. Changes the 'onclick' attribute to new function and the button icon.
 * @param {string} currentFn - The name of the function that is currently to be executed.
 * @param {string} newFn - The name of the function to be executed next.
 * @param {HTMLButtonElement} btnElem - The button element that was clicked.
 * @param {string} newSrc - The new source of the button icon.
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
 * @param {HTMLButtonElement} btnElem - The button element that you want to change the icon of.
 * @param {string} newSrc - The source of the new icon.
 * @returns {string} The current source of the button icon.
 */
function changeBtnIcon(btnElem, newSrc) {
  let imgElem = btnElem.firstElementChild;
  let currentSrc = imgElem.src;
  imgElem.src = newSrc;
  return currentSrc;
}

/**
 * Hides controller buttons by adding 'dNone' class to their elements.
 */
function hideControllerButtons() {
  for (const keyObj in keyboard) {
    if (Object.hasOwnProperty.call(keyboard, keyObj)) {
      const idOfCotrollerBtn = keyObj;
      let controllerButton = getElem(idOfCotrollerBtn);
      controllerButton.classList.add('dNone');
    }
  }
}

/**
 * Requests full screen mode for the content element and adjusts the content elements according to the device orientation.
 */
async function enterFullscreen() {
  fullscreenContent = getElem('content');
  await fullscreenContent.requestFullscreen();
  checkOrientationSetContentElements();
}

/**
 * Exits the full screen mode and adjusts the content elements according to the device orientation.
 */
async function exitFullscreen() {
  if (document.exitFullscreen) await document.exitFullscreen();
  else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
  checkOrientationSetContentElements();
}

// Add event listeners for window resize and orientation change
window.addEventListener('resize', checkOrientationSetContentElements);
window.addEventListener('orientationchange', checkOrientationSetContentElements);

/**
 * Checks the device orientation and adjusts the content elements accordingly.
 */
function checkOrientationSetContentElements() {
  detectIfBrowserIsOperaAndSetCanvasHeightIfYes();
  switchContentVisibilityAsPerOrientation();
  adjustWidthHeightOfScreensButtonLayer();
  setVisibilityFullscreenBtn();
  turnOnOffHoverEffectForBtns();
  setControlInfoBox();
}

/**
 * Checks if the browser is Opera and if so, adjusts the canvas height for landscape orientation.
 */
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
 * Adjusts the canvas height for Opera browser in landscape orientation.
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

/**
 * Switches the visibility of content elements based on the device orientation.
 */
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

/**
 * Determines whether the device orientation is landscape.
 * @returns {boolean} Returns true if the device orientation is landscape, otherwise false.
 */
function getIfOrientationLandscape() {
  if (window.matchMedia('(orientation: landscape)').matches) return true;
  else return false;
}

/**
 * Adjusts the height and width of the screen button layer based on the canvas dimensions.
 */
function adjustWidthHeightOfScreensButtonLayer() {
  getElem('screensButtonsLayerContainer').removeAttribute('style');
  let canvasHeight = getElem('canvas').clientHeight;
  let canvasWidth = getElem('canvas').clientWidth;
  let canvasRatio = canvasWidth / canvasHeight;
  if (canvasRatio < 2) {
    let buttonsLayerHeight = canvasWidth / 2;
    getElem('screensButtonsLayerContainer').style.height = `${buttonsLayerHeight}px`;
    getElem('screensButtonsLayerContainer').style.width = `${canvasWidth}px`;
  }
  hideTitle();
}

/**
 * Hides the title if the device height is less than the sum of the canvas height and a specified value, or if the
 * rotate device info is visible.
 */
function hideTitle() {
  let canvas = getElem('canvas');
  let title = getElem('title');
  if (window.innerHeight <= canvas.clientHeight + 160 || getIfRotateDveiceInfoVisible()) title.classList.add('dNone');
  else title.classList.remove('dNone');
}

/**
 * Checks if the rotate device info is visible.
 * @returns {boolean} Returns true if the rotate device info is visible, otherwise false.
 */
function getIfRotateDveiceInfoVisible() {
  return !getElem('rotateDeviceInfo').classList.contains('dNone');
}

/**
 * Sets the visibility of the fullscreen button based on whether the canvas takes full device dimensions and if the document is not in fullscreen mode.
 */
function setVisibilityFullscreenBtn() {
  if (getIfCanvasTakeFullDeviceDimensions() && !document.fullscreenElement)
    getElem('enterExitFullScreenBtn').classList.add('dNone');
  else getElem('enterExitFullScreenBtn').classList.remove('dNone');
}

/**
 * Checks if the canvas takes full device dimensions.
 * @returns {boolean} Returns true if the canvas takes full device dimensions, otherwise false.
 */
function getIfCanvasTakeFullDeviceDimensions() {
  let canvas = getElem('canvas');
  if (canvas.clientWidth == screen.width && canvas.clientHeight == screen.height) return true;
  else return false;
}

/**
 * Adds or removes a hover effect for all buttons in the buttons layer based on the type of device (mobile/tablet or other).
 */
function turnOnOffHoverEffectForBtns() {
  let allBtns = getElem('buttonsLayer').getElementsByTagName('button');
  for (const btn of allBtns) {
    if (getIfDeviceIsMobileOrTablet()) btn.classList.remove('btnHoverEffect');
    else btn.classList.add('btnHoverEffect');
  }
}

/**
 * Checks if the device is mobile or tablet.
 * @returns {boolean} Returns true if the device is mobile or tablet, otherwise false.
 */
function getIfDeviceIsMobileOrTablet() {
  // Detect if at least one pointing device has limited accuracy. If yes, it is a mobile / tablet device.
  return window.matchMedia('(any-pointer:coarse)').matches;
}

/**
 * Sets the control info box based on the device.
 */
function setControlInfoBox() {
  if (getIfDeviceIsMobileOrTablet()) {
    getElem('mobileOrTabletButtons').classList.remove('dNone');
    getElem('keyboardButtons').classList.add('dNone');
  } else {
    getElem('mobileOrTabletButtons').classList.add('dNone');
    getElem('keyboardButtons').classList.remove('dNone');
  }
}

/**
 * Switches to the game information box, hiding the control information box.
 */
function switchGameInfoBox() {
  switchInfoBox();
  getElem('gameInfo').classList.remove('dNone');
  getElem('controlInfo').classList.add('dNone');
}

/**
 * Switches to the control information box, hiding the game information box.
 */
function switchControlInfoBox() {
  switchInfoBox();
  getElem('controlInfo').classList.remove('dNone');
  getElem('gameInfo').classList.add('dNone');
}

/**
 * Toggles the visibility of the info box and pauses/plays the game.
 */
function switchInfoBox() {
  getElem('infoBoxContainer').classList.toggle('dNone');
  pausePlayGame();
}
