/**
 * Represents a sound object, extends the native Audio class.
 * @extends Audio
 */
class Sound extends Audio {
  /**
   * The array of all sound instances created in the game.
   * @type {Sound[]}
   * @static
   */
  static allSoundInstances = [];
  /**
   * The flag indicating whether all sound instances in the game are muted.
   * @type {boolean}
   * @static
   */
  static allSoundInstancesMuted = false;

  /**
   * Constructs a new Sound instance with the specified audio source and volume.
   * @param {string} src - The audio source URL.
   * @param {number} volume - The initial volume of the audio.
   */
  constructor(src, volume) {
    super(src);
    this.setInitialSoundSettings(volume);
    Sound.allSoundInstances.push(this);
  }

  /**
   * Sets the initial sound settings such as volume, mute, autoplay and loop.
   * @param {number} volume - The initial volume of the audio.
   */
  setInitialSoundSettings(volume) {
    if (volume) {
      this.volumeInitial = volume;
      this.volume = this.volumeInitial;
    }
    this.muted = false;
    this.autoplay = false;
    this.loop = false;
  }

  /**
   * Plays the audio if not already playing.
   */
  play() {
    if (Sound.allSoundInstancesMuted) {
      this.volume = 0;
      this.muted = true;
    } else {
      this.volume = this.volumeInitial;
      this.muted = false;
    }
    if (!this.isPlaying()) super.play();
  }

  /**
   * Pauses the audio if playing.
   */
  pause() {
    if (this.isPlaying()) super.pause();
  }

  /**
   * Checks if the audio is currently playing.
   * @returns {boolean} - True if the audio is playing, false otherwise.
   */
  isPlaying() {
    return this.currentTime > 0 && !this.paused && !this.ended && this.readyState > this.HAVE_CURRENT_DATA;
  }
}
