/**
 * Singleton class for managing the game world.
 */
class WorldSingleton {
  /**
   * The single instance of the world.
   * @private
   */
  static #instance = null;

  /**
   * Returns the instance of the world or creates it if it doesn't exist.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
   * @param {Keyboard} keyboard - The keyboard object for input handling.
   * @returns {World} The single instance of the world.
   */
  static getInstance(canvas, keyboard) {
    if (!WorldSingleton.#instance) {
      WorldSingleton.#instance = new World(canvas, keyboard);
    }

    return WorldSingleton.#instance;
  }

  /**
   * Removes the instance of the world.
   * @returns {World|null} The removed instance of the world or null if there is no instance.
   */
  static removeInstance() {
    const instance = WorldSingleton.#instance;

    if (instance) {
      WorldSingleton.#instance = null;
    }

    return instance;
  }
}