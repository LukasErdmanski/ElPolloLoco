class Level {
  character;
  enemies;
  clouds;
  backgroundObjects;
  coins;
  // The end x-coordinate of the world level.
  level_end_x = 2200;

  constructor(enemies, clouds, backgroundObjects, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
  }
}
