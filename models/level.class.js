class Level {
  character;
  enemies;
  clouds;
  backgroundObjects;
  // The end x-coordinate of the world level.
  level_end_x = 2200;

  constructor(enemies, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}
