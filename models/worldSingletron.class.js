class WorldSingleton {
  static #instance = null;

  static getInstance(canvas, keyboard) {
    if (!WorldSingleton.#instance) {
      WorldSingleton.#instance = new World(canvas, keyboard);
    }

    return WorldSingleton.#instance;
  }

  static removeInstance() {
    if (WorldSingleton.#instance) {
      WorldSingleton.#instance = null;
    }

    return WorldSingleton.#instance;
  }
}
