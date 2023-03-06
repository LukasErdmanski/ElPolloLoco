class Sound extends Audio {
  static allSoundInstances = [];
  // readyToPlay = false;

  constructor(src, volume) {
    super();
    this.src = src;
    this.volume = volume;
    this.autoplay = false;
    this.muted = false;
    this.id = Object.keys(Sound.allSoundInstances).length + 1; // Set unique ID for each audio instance
    Sound.allSoundInstances[this.id] = this;
    // this.addEventListener('canplaythrough', () => (this.readyToPlay = true));
  }

  play() {
    if (this.paused) super.play();
  }

  pause() {
    if (!this.paused) super.pause();
  }
}
