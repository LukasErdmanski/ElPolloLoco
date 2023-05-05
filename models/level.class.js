/**
 * Represents a game level.
 * @class
 */
class Level {
  /**
   * The background objects in the level.
   * @type {BackgroundObject[]}
   */
  backgroundObjects;

  /**
   * The clouds in the level.
   * @type {Cloud[]}
   */
  clouds;

  /**
   * The enemies in the level.
   * @type {Enemy[]}
   */
  enemies;

  /**
   * The coins in the level.
   * @type {Coin[]}
   */
  coins;

  /**
   * The bottles on the ground in the level.
   * @type {Bottle[]}
   */
  bottlesInGround;

  /**
   * The bottles in flight in the level.
   * @type {Bottle[]}
   */
  bottlesInFlight;

  /**
   * The amount of all coins in the level.
   * @type {number}
   */
  amountOfAllCoins;

  /**
   * The amount of all bottles in the level.
   * @type {number}
   */
  amountOfAllBottles;

  /**
   * The amount of background objects in the level.
   * @type {number}
   */
  amountOfBG = 5;

  /**
   * The start x-coordinate of the world level.
   * @type {number}
   */
  start_x;

  /**
   * The end x-coordinate of the world level.
   * @type {number}
   */
  end_x;

  /**
   * Creates a new instance of Level.
   *
   * @constructor
   * @param {BackgroundObject[]} backgroundObjects - The background objects in the level.
   * @param {Cloud[]} clouds - The clouds in the level.
   * @param {Enemy[]} enemies - The enemies in the level.
   * @param {Coin[]} coins - The coins in the level.
   * @param {Bottle[]} bottlesInGround - The bottles on the ground in the level.
   * @param {Bottle[]} bottlesInFlight - The bottles in flight in the level.
   */
  constructor(backgroundObjects, clouds, enemies, coins, bottlesInGround, bottlesInFlight) {
    this.backgroundObjects = backgroundObjects;
    this.clouds = clouds;
    this.enemies = enemies;
    this.coins = coins;
    this.bottlesInGround = bottlesInGround;
    this.bottlesInFlight = bottlesInFlight;
    this.amountOfAllCoins = this.coins.length;
    this.amountOfAllBottles = this.bottlesInGround.length;
    this.start_x = this.getLevelStartX();
    this.end_x = this.getLevelEndX();
    this.setLevel();
  }

  /**
   * Returns the start x-coordinate of the level.
   *
   * @returns {number} The start x-coordinate of the level.
   */
  getLevelStartX() {
    let level_start_x = this.backgroundObjects[0].x;
    return level_start_x;
  }

  /**
   * Returns the end x-coordinate of the level.
   *
   * @returns {number} The end x-coordinate of the level.
   */
  getLevelEndX() {
    let lastBGOInLevelArray = this.backgroundObjects[this.backgroundObjects.length - 1];
    let lastBG_start_x = lastBGOInLevelArray.x;
    let end_x = lastBG_start_x + lastBGOInLevelArray.width;
    return end_x;
  }

  /**
   * Sets the level for enemies and clouds.
   */
  setLevel() {
    this.enemies.forEach((enemy) => {
      enemy.level = this;
      enemy.setStartXAndSpeedX();
    });
    this.clouds.forEach((cloud) => {
      cloud.level = this;
      cloud.setStartX();
    });
  }
}