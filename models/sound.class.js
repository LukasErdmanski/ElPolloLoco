class Sound extends Audio {
  static allSoundInstances = [];
  static allSoundInstancesMuted = false;

  constructor(src, volume) {
    super(src);
    if (volume) {
      this.volumeInitial = volume;
      this.volume = this.volumeInitial;
    }
    this.muted = false;
    this.autoplay = false;
    this.loop = false;

    Sound.allSoundInstances.push(this);
  }

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

  pause() {
    if (this.isPlaying()) super.pause();
  }

  isPlaying() {
    return this.currentTime > 0 && !this.paused && !this.ended && this.readyState > this.HAVE_CURRENT_DATA;
  }

  static getAllSoundInstances() {
    return Sound.allSoundInstances;
  }

  static setAllSoundsInstances(allSoundInstances) {
    Sound.allSoundInstances = allSoundInstances;
  }
}
