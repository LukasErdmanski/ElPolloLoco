//#region preloadImagesSounds =================================================================================
/**
 * Preloads all images and sounds needed for the game.
 * @async
 * @function
 * @param {Object} soundsObj - The object that contains categorized paths and initial volume of all sounds to be
 * created, loaded and saved back into this object.
 * @param {string[]} imagePaths - An array of paths to the images to be preloaded.
 * @returns {Promise<void>} A promise that resolves once all images and sounds have been preloaded.
 */
async function preloadImagesSounds(imagePaths, soundsObj) {
  return await Promise.all([createLoadRenderSaveImages(imagePaths), createLoadSaveSounds(soundsObj)]);
}
//#endregion preloadImagesSounds =================================================================================

//#region createLoadRenderSaveImages ===============================================================================
/**
 * Creates, loads, renders, and saves all images needed for the game.
 * @async
 * @function
 * @param {string[]} imagePaths - An array of paths to the images to be preloaded.
 * @returns {Promise<void>} A promise that resolves once all images have been preloaded and rendered.
 */
async function createLoadRenderSaveImages(imagePaths) {
  const [maxWidth, maxHeight] = getMaxWidthHeigtMainCanvas();
  const tempCanvasesContainer = createTempCanvasesContainer();
  const freeTempCanvases = [];
  const tempCanvasSettings = [maxWidth, maxHeight, tempCanvasesContainer, freeTempCanvases];
  return Promise.all(imagePaths.map((path) => createLoadRenderSaveImg(path, tempCanvasSettings))).then((images) => {
    document.body.removeChild(tempCanvasesContainer);
    return images;
  });
}

/**
 * Gets the maximum width and height of the main canvas.
 * @function
 * @returns {number[]} An array containing the maximum width and height of the main canvas.
 */
function getMaxWidthHeigtMainCanvas() {
  const mainCanvas = document.getElementById('canvas');
  const maxWidth = mainCanvas.width;
  const maxHeight = mainCanvas.height;
  return [maxWidth, maxHeight];
}

/**
 * Creates a temporary container for canvas elements.
 * @function
 * @returns {HTMLElement} A new div element that will contain temporary canvas elements.
 */
function createTempCanvasesContainer() {
  const tempCanvasesContainer = document.createElement('div');
  tempCanvasesContainer.id = 'tempCanvasesContainer';
  document.body.appendChild(tempCanvasesContainer);
  return tempCanvasesContainer;
}

/**
 * Creates a temporary canvas element, loads image, draws image onto canvas, saves once drawn image.
 * @function
 * @param {Promise.resolve} resolve - Resolves the promise if the image is loaded successfully.
 * @param {Promise.reject} reject - Rejects the promise if the image fails to load.
 * @param {Object} img - The image object that was loaded.
 * @param {string} path - The path of the image object.
 * @param {Array} tempCanvasSettings - An array containing the maximum width and height of the temporary canvas, the container for temporary canvases, and an array of free temporary canvases.
 */
function createLoadRenderSaveImg(path, tempCanvasSettings) {
  return new Promise(async (resolve, reject) => {
    try {
      const [maxWidth, maxHeight, tempCanvasesContainer, freeTempCanvases] = tempCanvasSettings;
      // Create and scale the image.
      const [scaleImg, scaledWidth, scaledHeight] = await createScaleImgWithScaledWidthHeight(path, maxWidth, maxHeight);
      // Set up the temporary canvas and context.
      const [tempCanvas, tempCanvasCtx] = setTempCanvasWithContext(maxWidth, maxHeight, tempCanvasesContainer, freeTempCanvases);
      // Draw the image onto the temporary canvas.
      tempCanvasCtx.drawImage(scaleImg, 0, 0, scaledWidth, scaledHeight);
      // Make temporary canvas free and push it into 'freeTempCanvases'
      freeTempCanvases.push(tempCanvas);
      // Save the rendered img into imageCache.
      DrawableObject.imageCache[path] = scaleImg;
      // Resolve with current create load render save img promise.
      resolve(scaleImg);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Creates an image from the specified path, scales it to the specified maximum dimensions, and returns the scaled
 * image and its dimensions.
 * @function
 * @async
 * @param {string} path - The path of the image to be loaded.
 * @param {number} maxWidth - The maximum width of the scaled image.
 * @param {number} maxHeight - The maximum height of the scaled image.
 * @returns {Promise<[HTMLCanvasElement, number, number]>} A promise that resolves with an array containing the scaled
 * image, its width, and its height.
 */
async function createScaleImgWithScaledWidthHeight(path, maxWidth, maxHeight) {
  const img = await createLoadImg(path);
  const [scaleImg, scaledWidth, scaledHeight] = setScaleImgWidthHeight(img, maxWidth, maxHeight);
  return [scaleImg, scaledWidth, scaledHeight];
}

/**
 * Creates a temporary canvas element and returns it with its context.
 * @function
 * @param {number} maxWidth - The maximum width of the temporary canvas.
 * @param {number} maxHeight - The maximum height of the temporary canvas.
 * @param {HTMLDivElement} tempCanvasesContainer - The container element for temporary canvases.
 * @param {Array<HTMLCanvasElement>} freeTempCanvases - An array of free temporary canvases.
 * @returns {[HTMLCanvasElement, CanvasRenderingContext2D]} An array containing the temporary canvas and its 2D context.
 */
function setTempCanvasWithContext(maxWidth, maxHeight, tempCanvasesContainer, freeTempCanvases) {
  // Get or create a new free temporary canvas.
  const tempCanvas = getOrCreateTempCanvas(maxWidth, maxHeight, tempCanvasesContainer, freeTempCanvases);
  // Get the 2D rendering context for the temporary canvas.
  const tempCanvasCtx = tempCanvas.getContext('2d');
  return [tempCanvas, tempCanvasCtx];
}

/**
 * Creates a promise to create and load a image, The promise resolves when the image has been created and loaded.
 * @function
 * @param {string} imgPath - The path of the image file to be loaded.
 * @returns {Promise} - A promise that resolves when the image has been created and loaded.
 */
function createLoadImg(imgPath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgPath;
    const checkIfLoaded = () => {
      if (img.complete && img.naturalWidth !== 0) resolve(img);
      else if (img.complete && img.naturalWidth === 0)
        reject(new Error(`Loading source '${img.src}' for an Image object failed.`));
      else requestAnimationFrame(checkIfLoaded);
    };
    checkIfLoaded();
  });
}
/**
 * Creates a temporary canvas element if none are available, or reuses a free one.
 * @function
 * @param {number} maxWidth - The maximum width of the temporary canvas.
 * @param {number} maxHeight - The maximum height of the temporary canvas.
 * @param {HTMLElement} tempCanvasesContainer - The container element for temporary canvas elements.
 * @param {HTMLCanvasElement[]} freeTempCanvases - An array of free temporary canvas elements.
 * @returns {HTMLCanvasElement} - A temporary canvas element.
 */
function getOrCreateTempCanvas(maxWidth, maxHeight, tempCanvasesContainer, freeTempCanvases) {
  let tempCanvas;
  if (freeTempCanvases.length === 0) {
    tempCanvas = document.createElement('canvas');
    tempCanvas.width = maxWidth;
    tempCanvas.height = maxHeight;
    tempCanvasesContainer.appendChild(tempCanvas);
  } else tempCanvas = freeTempCanvases.pop();
  return tempCanvas;
}

/**
 * Sets the width and height of an image element to the scaled dimensions based on the maximum width and height.
 * @function
 * @param {HTMLImageElement} img - An image element.
 * @param {number} maxWidth - The maximum width of the image.
 * @param {number} maxHeight - The maximum height of the image.
 * @returns {[HTMLImageElement, number, number]} - An array containing the scaled image element and its dimensions.
 */
function setScaleImgWidthHeight(img, maxWidth, maxHeight) {
  let scaledWidth, scaledHeight;
  if (img.naturalWidth > img.height) {
    scaledWidth = maxWidth;
    scaledHeight = Math.round(img.height * (maxWidth / img.width));
  } else {
    scaledWidth = Math.round(img.width * (maxHeight / img.height));
    scaledHeight = maxHeight;
  }
  img.width = scaledWidth;
  img.height = scaledHeight;
  return [img, scaledWidth, scaledHeight];
}
//#endregion createLoadRenderSaveImages ===============================================================================

//#region createLoadSaveSounds =====================================================================================
/**
 * Creates, loads sounds from all paths from the given'soundsObj' and saves them back into the 'soundsObj'.
 * @function
 * @param {Object} soundsObj - The object that contains categorized paths and initial volume of all sounds to be
 * created, loaded and saved.
 * @returns {Promise[]} - An array of promises that resolve when each sound is created, loaded and saved.
 */
function createLoadSaveSounds(soundsObj) {
  let [allSoundPaths, allSoundPathPositionsInSoundsObj] = getAllSoundPathsTheirPositions(soundsObj);
  return Promise.all(
    allSoundPaths.map((path, i) => createLoadSaveSound(soundsObj, path, i, allSoundPathPositionsInSoundsObj))
  );
}

/**
 * Gets an array of all sound file paths and their positions in the 'soundsObj'.
 * @function
 * @param{Object} soundsObj - The object that contains categorized paths and initial volume of all sounds to be
 * created, loaded and saved.
 * @returns {Array} An array containing two arrays: 1) all sound file paths and 2) all positions of sound files in the 'soundsObj'.
 */
function getAllSoundPathsTheirPositions(soundsObj) {
  let allSoundPaths = [];
  let allPathPositionsInSoundsObj = [];
  [allSoundPaths, allPathPositionsInSoundsObj] = setAllSoundPathsTheirPositionsInArray(
    soundsObj,
    allSoundPaths,
    allPathPositionsInSoundsObj
  );
  return [allSoundPaths, allPathPositionsInSoundsObj];
}

/**
 * Adds all the sound paths and their positions in the 'soundsObj' to separate arrays and returns them.
 * @function
 * @param {Object} soundsObj - The object that contains categorized paths and initial volume of all sounds to be
 * created, loaded and saved.
 * @param {string[]} allSoundPaths - An array of all sound paths.
 * @param {Array.<Array.<string>>} allPathPositionsInSoundsObj - An array of all sound path positions in the 'soundsObj'.
 * @returns {[string[], Array.<Array.<string>>]} - An array containing the allSoundPaths and allPathPositionsInSoundsObj arrays.
 */
function setAllSoundPathsTheirPositionsInArray(soundsObj, allSoundPaths, allPathPositionsInSoundsObj) {
  for (const categoryKey in soundsObj) {
    if (Object.hasOwnProperty.call(soundsObj, categoryKey)) {
      const category = soundsObj[categoryKey];
      for (const soundKey in category) {
        if (Object.hasOwnProperty.call(category, soundKey)) {
          allSoundPaths.push(category[soundKey].path);
          allPathPositionsInSoundsObj.push([categoryKey, soundKey]);
        }
      }
    }
  }
  return [allSoundPaths, allPathPositionsInSoundsObj];
}

/**
 * Creates a promise to save a created, loaded and checked sound back into 'soundsObj'.
 * @async
 * @function
 * @param {Object} soundsObj - The object that contains categorized paths and initial volume of all sounds to be
 * created, loaded and saved. Into 'soundsObj' the successfully created, loaded and checked sound will be saved.
 * @param {string} path - The path of the sound file to be loaded.
 * @param {number} i - The index of the current sound in the allPathPositionsInSoundsObj array.
 * @param {Array.<Array.<string>>} allPathPositionsInSoundsObj - An array of all sound path positions in the 'soundsObj'.
 * @returns {Promise} - A promise that resolves when the sound has been created and finished loading and can be played through.
 */
async function createLoadSaveSound(soundsObj, path, i, allPathPositionsInSoundsObj) {
  return new Promise(async (resolve, reject) => {
    try {
      const [categoryKey, soundKey] = allPathPositionsInSoundsObj[i];
      const volumeInitial = soundsObj[categoryKey][soundKey].volumeInitial;
      const sound = await createLoadSound(path, volumeInitial);
      soundsObj[categoryKey][soundKey] = sound;
      resolve(sound);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Creates a promise to create, load a sound and checks if it can be played through. The promise resolves when the
 * sound has been created, loaded and can be played through.
 * @function
 * @param {number} volumeInitial - The initial volume of the sound file to be created.
 * @param {string} path - The path of the sound file to be loaded.
 * @returns {Promise} - A promise that resolves when the sound has been created, loaded and can be played through.
 */
function createLoadSound(path, volumeInitial) {
  return new Promise((resolve, reject) => {
    const sound = new Sound(undefined, volumeInitial);
    sound.src = path;
    const checkIfLoaded = () => {
      if (sound.readyState == 4) resolve(sound);
      else if (sound.error) reject(new Error(`Loading source '${sound.src}' for an Sound object failed.`));
      else requestAnimationFrame(checkIfLoaded);
    };
    checkIfLoaded();
  });
}
//#endregion createLoadSaveSounds =====================================================================================
