/**
 * Turns on the sound.
 */
function turnSoundsOn() {
  Sound.allSoundInstancesMuted = false;
  if (musicMuted) turnMusicOff();
  else turnMusicOn();
}

/**
 * Turns off the sounds.
 */
function turnSoundsOff() {
  Sound.allSoundInstancesMuted = true;
  let musicMutedValueToSet = musicMuted;
  turnMusicOff();
  musicMuted = musicMutedValueToSet;
}

/**
 * Turns on the music.
 */
function turnMusicOn() {
  musicMuted = false;
  if (!Sound.allSoundInstancesMuted) {
    sounds.game.bgMusic.volume = sounds.game.bgMusic.volumeInitial;
    sounds.game.bgMusic.muted = false;
    sounds.game.endbossBgMusic.volume = sounds.game.endbossBgMusic.volumeInitial;
    sounds.game.endbossBgMusic.muted = false;
  }
}

/**
 * Turns off the music.
 */
function turnMusicOff() {
  musicMuted = true;
  sounds.game.bgMusic.volume = 0;
  sounds.game.bgMusic.muted = true;
  sounds.game.endbossBgMusic.volume = 0;
  sounds.game.endbossBgMusic.muted = true;
}

/**
 * Resets all sound instances by pausing them, setting loop to false, and current time to 0.
 */
function resetAllSound() {
  let array = Object.values(Sound.allSoundInstances);
  array.forEach((soundInstance) => {
    soundInstance.pause();
    soundInstance.loop = false;
    soundInstance.currentTime = 0;
  });
}

/**
 * Plays the background music in a loop.
 */
function playBgMusic() {
  sounds.game.bgMusic.loop = true;
  sounds.game.bgMusic.play();
}

/**
 * Changes the background music to 'endbossBgMusic' and plays it in a loop.
 */
function changeBgMusic() {
  sounds.game.bgMusic.pause();
  sounds.game.endbossBgMusic.loop = true;
  sounds.game.endbossBgMusic.play();
}

/**
 * Pauses all sounds and depending on the state of the character, plays either 'game over' or 'game win' sound.
 */
function playSoundsAtGameOver() {
  sounds.game.bgMusic.pause();
  sounds.game.endbossBgMusic.pause();
  pauseAllSounds();
  if (!worldSingletonInstance.character) sounds.game.over.play();
  else sounds.game.win.play();
}

/**
 * Pauses all sound instances that are not already paused.
 */
function pauseAllSounds() {
  let array = Object.values(Sound.allSoundInstances);
  array.forEach((soundInstance) => {
    if (!soundInstance.paused) soundInstance.pause();
  });
}
