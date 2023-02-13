class Level {
  character;
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottlesInGround;
  bottlesInFlight;
  amountOfAllCoins;
  amountOfAllBottles;
  // The end x-coordinate of the world level.
  level_end_x = 2200;

  constructor(enemies, clouds, backgroundObjects, coins, bottlesInGround, bottlesInFlight, amountOfAllBottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottlesInGround = bottlesInGround;
    this.bottlesInFlight = bottlesInFlight;
    // TODO: DIE Anzahl der Coins bleibt nach Init KONSTANT, nicht wie bottles.
    this.amountOfAllCoins = amountOfAllBottles;
    // TODO: WENN SPÄTER DIE FUNKTIONS Umwandel Coins to Bottles muss sich das hier mit jedem Kauf dynamisch ädern damit die prozentuale Berechnung stimmt für Statusanzeige, da die unrsprünglichen 100% anwachsen.
    this.amountOfAllBottles = amountOfAllBottles;
  }
}
