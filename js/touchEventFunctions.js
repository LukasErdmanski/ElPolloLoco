/**
 * Displays the detected touch event in the console and updates the touchEventDetectionInfo element.
 */
function showLogOutDetectedTouchEvent() {
  const touchEventNamesArray = ['touchstart', 'touchend', 'touchcancel', 'touchmove'];
  touchEventNamesArray.forEach((eventName, index) => {
    document.addEventListener(eventName, () => {
      const textInput = ['touch start', 'touch end', 'touch cancel', 'touch move'][index];
      console.log(textInput);
      document.getElementById('touchEventDetectionInfo').innerHTML = textInput;
    });
  });
}

/**
 * Blocks select, context menu, zoom, zoom magnifier, and double-click on touch devices.
 */
function blockSelectContextMenuZoomMagnifierOnTouchDevice() {
  blockAllTouchStartEventTypesExceptButtons();
  blockAllTouchEndEventTypesExceptButtons();
  blockAllDoubleClickEvents();
}

let holdTimers = {};

/**
 * Blocks all touch start events except for buttons.
 */
function blockAllTouchStartEventTypesExceptButtons() {
  document.ontouchstart = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const touchedBtn = event.target.closest('button');
    if (touchedBtn && touchedBtn instanceof HTMLButtonElement && touchedBtn.classList.contains('control-button')) {
      clearHoldTimer(touchedBtn.id);
      keyboard[touchedBtn.id].isPressed = true;
      addBtnHighlight(touchedBtn);
    }
  };
}

/**
 * Blocks all touch end events except for buttons.
 */
function blockAllTouchEndEventTypesExceptButtons() {
  document.ontouchend = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const touchedBtn = event.target.closest('button');
    if (touchedBtn && touchedBtn instanceof HTMLButtonElement && touchedBtn.classList.contains('control-button')) {
      keyboard[touchedBtn.id].isPressed = true;
      startHoldTimer(touchedBtn);
    } else if (touchedBtn && touchedBtn instanceof HTMLButtonElement) {
      eval(touchedBtn.onclick());
      highlightBtn(touchedBtn);
    }
  };
}

/**
 * Clears the hold timer for the specified button.
 * @param {string} btnId - The ID of the button.
 */
function clearHoldTimer(btnId) {
  if (holdTimers[btnId]) {
    clearTimeout(holdTimers[btnId]);
    delete holdTimers[btnId];
  }
}

/**
 * Starts the hold timer for the specified button.
 * @param {HTMLButtonElement} button - The button element.
 */
function startHoldTimer(button) {
  const btnId = button.id;
  holdTimers[btnId] = setTimeout(() => {
    keyboard[btnId].isPressed = false;
    removeBtnHighlight(button);
    delete holdTimers[btnId];
  }, 40);
}

/**
 * Blocks all double-click events.
 */
function blockAllDoubleClickEvents() {
  document.ondblclick = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };
}
