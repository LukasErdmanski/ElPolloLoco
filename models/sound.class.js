class Sound extends Audio {
  static allSoundInstances = [];
  static allSoundInstancesMuted = false;
  static numSoundsToLoad = 0;
  static numSoundsLoaded = 0;

  constructor(src, volume) {
    super(src);
    Sound.numSoundsToLoad++;
    this.volumeInitial = volume;
    this.volume = this.volumeInitial;
    this.muted = false;
    this.autoplay = false;
    this.loop = false;

    Sound.allSoundInstances.push(this);

    this.oncanplaythrough = Sound.numSoundsLoaded++;
  }

  play() {
    if (Sound.allSoundInstancesMuted) {
      this.volume = 0;
      this.muted = true;
    } else {
      this.volume = this.volumeInitial;
      this.muted = false;
    }

    if (!this.isPaying()) super.play();
  }

  pause() {
    if (this.isPaying()) super.pause();
  }

  isPaying() {
    return this.currentTime > 0 && !this.paused && !this.ended && this.readyState > this.HAVE_CURRENT_DATA;
  }

  static getAllSoundInstances() {
    return Sound.allSoundInstances;
  }

  static setAllSoundsInstances(allSoundInstances) {
    Sound.allSoundInstances = allSoundInstances;
  }
}
