/**
 * Turns on the sound.
 */
function turnSoundsOn() {
  Howler.mute(false);
  if (musicMuted) turnMusicOff();
  else turnMusicOn();
}

/**
 * Turns off the sounds.
 */
function turnSoundsOff() {
  Howler.mute(true);
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
    sounds.game.bgMusic.mute(false);
    sounds.game.endbossBgMusic.mute(false);
  }
}

/**
 * Turns off the music.
 */
function turnMusicOff() {
  musicMuted = true;
  sounds.game.bgMusic.mute(true);
  sounds.game.endbossBgMusic.mute(true);
}

/**
 * Resets all sound instances by pausing them, setting loop to false, and current time to 0.
 */
function resetAllSound() {
  Howler.stop();
  let array = Object.values(Sound.allSoundInstances);
  array.forEach((soundInstance) => soundInstance.loop(false));
}

/**
 * Plays the background music in a loop.
 */
function playBgMusic() {
  sounds.game.bgMusic.loop(true);
  sounds.game.bgMusic.play();
}

/**
 * Changes the background music to 'endbossBgMusic' and plays it in a loop.
 */
function changeBgMusic() {
  sounds.game.bgMusic.pause();
  sounds.game.endbossBgMusic.loop(true);
  sounds.game.endbossBgMusic.play();
}

/**
 * Pauses all sounds and depending on the state of the character, plays either 'game over' or 'game win' sound.
 */
function playSoundsAtGameOver() {
  pauseAllSounds();
  if (!worldSingletonInstance.character) sounds.game.over.play();
  else sounds.game.win.play();
}

/**
 * Pauses all sound instances that are not already paused.
 */
function pauseAllSounds() {
  Howler.stop();
}
