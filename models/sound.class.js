/**
 * Represents a sound object, extends the Howl class.
 * @extends Howl
 */
class Sound extends Howl {
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
    super(Sound.setInitialSoundOptions(src, volume));
    Sound.allSoundInstances.push(this);
  }

  /**
   * Sets the initial sound options such as preload src, volume, mute, autoplay and loop.
   * Sats the initial sound volume.
   * @param {string} src - The audio source URL.
   * @param {number} volume - The initial volume of the audio.
   * @static
   */
  static setInitialSoundOptions(src, volume) {
    this.volumeInitial = volume;
    return {
      preload: true,
      src: [src],
      volume: this.volumeInitial,
      mute: Sound.allSoundInstancesMuted,
      loop: false,
      autoplay: false,
    };
  }

  /**
   * Plays the sound.
   */
  play() {
    if (!super.playing()) super.play();
  }

  /**
   * Pauses the sound.
   */
  pause() {
    if (super.playing()) super.pause();
  }
}
