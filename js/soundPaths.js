/**
 * @typedef {Object} Sound
 * @property {string} path - The path to the sound file.
 * @property {number} volumeInitial - The initial volume of the sound.
 */

/**
 * @typedef {Object} SoundCategory
 * @property {Sound} [bgMusic] - The background music for the game.
 * @property {Sound} [endbossBgMusic] - The background music for the endboss level.
 * @property {Sound} [over] - The sound played when the game is over.
 * @property {Sound} [win] - The sound played when the game is won.
 * @property {Sound} [collect] - The sound played when an item is collected.
 * @property {Sound} [throw] - The sound played when an item is thrown.
 * @property {Sound} [dead] - The sound played when a character dies.
 * @property {Sound} [hurt] - The sound played when a character is hurt.
 * @property {Sound} [jump] - The sound played when a character jumps.
 * @property {Sound} [moveLeftOrRight] - The sound played when a character moves left or right.
 * @property {Sound} [snooring] - The sound played when a character is snooring.
 * @property {Sound} [noCoinNoBottle] - The sound played when a character has no coins or bottles.
 * @property {Sound} [attack] - The sound played when the endboss attacks.
 * @property {Sound} [characterDetected] - The sound played when the endboss detects the character.
 * @property {Sound} [buyHealth] - The sound played when health is bought.
 * @property {Sound} [buyBottle] - The sound played when a bottle is bought.
 */

/**
 * @type {Object.<string, SoundCategory>}
 * @description An object containing the sounds for the game, categorized by context. Each category
 * (for example, 'game', 'bottle', 'coin', 'chicken', 'character', 'endboss') contains its own set
 * of sounds, each represented by a `Sound` object with a `path` and `volumeInitial` property.
 */
sounds = {
  game: {
    bgMusic: {
      path: 'audio/bgMusic.mp3',
      volumeInitial: 0.1,
    },
    endbossBgMusic: {
      path: 'audio/endbossBgMusic.mp3',
      volumeInitial: 0.1,
    },
    over: {
      path: 'audio/gameOver.mp3',
      volumeInitial: 0.1,
    },
    win: {
      path: 'audio/win.mp3',
      volumeInitial: 0.2,
    },
  },
  bottle: {
    collect: {
      path: 'audio/collectBottle.mp3',
      volumeInitial: 0.1,
    },
    throw: {
      path: 'audio/bottleThrow.mp3',
      volumeInitial: 0.3,
    },
    dead: {
      path: 'audio/bottleHitOnGround.mp3',
      volumeInitial: 0.2,
    },
  },
  coin: {
    collect: {
      path: 'audio/collectCoin.mp3',
      volumeInitial: 0.1,
    },
    buyHealth: {
      path: 'audio/buyHealth.mp3',
      volumeInitial: 0.1,
    },
    buyBottle: {
      path: 'audio/buyBottle.mp3',
      volumeInitial: 0.1,
    },
  },
  chicken: {
    hurt: {
      path: 'audio/chickenHurt.mp3',
      volumeInitial: 0.1,
    },
    dead: {
      path: 'audio/chickenDead.mp3',
      volumeInitial: 0.3,
    },
  },
  character: {
    dead: {
      path: 'audio/characterDead.mp3',
      volumeInitial: 0.2,
    },
    hurt: {
      path: 'audio/characterHurt.mp3',
      volumeInitial: 0.2,
    },
    jump: {
      path: 'audio/characterJump.mp3',
      volumeInitial: 0.2,
    },
    moveLeftOrRight: {
      path: 'audio/characterMoveLeftRight.mp3',
      volumeInitial: 0.4,
    },
    snooring: {
      path: 'audio/characterSnooring.mp3',
      volumeInitial: 0.1,
    },
    noCoinNoBottle: {
      path: 'audio/characterNoCoin.mp3',
      volumeInitial: 0.6,
    },
  },
  endboss: {
    attack: {
      path: 'audio/endbossAttack.mp3',
      volumeInitial: 0.2,
    },
    characterDetected: {
      path: 'audio/endbossCharacterDetected.mp3',
      volumeInitial: 0.3,
    },
    dead: {
      path: 'audio/endbossDead.mp3',
      volumeInitial: 0.2,
    },
    hurt: {
      path: 'audio/endbossHurt.mp3',
      volumeInitial: 0.1,
    },
  },
};
