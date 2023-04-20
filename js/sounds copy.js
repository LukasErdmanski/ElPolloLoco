sounds = {
  game: {
    bgMusic: new Sound('audio/bgMusic.mp3', 0.1),
    endbossBgMusic: new Sound('audio/endbossBgMusic.mp3', 0.1),
    over: new Sound('audio/gameOver.mp3', 0.1),
    win: new Sound('audio/win.mp3', 0.2),
  },
  bottle: {
    collect: new Sound('audio/collectBottle.mp3', 0.1),
    throw: new Sound('audio/bottleThrow.mp3', 0.3),
    dead: new Sound('audio/bottleHitOnGround.mp3', 0.2),
  },

  coin: {
    collect: new Sound('audio/collectCoin.mp3', 0.1),
    buyHealth: new Sound('audio/buyHealth.mp3', 0.1),
    buyBottle: new Sound('audio/buyBottle.mp3', 0.1),
  },

  chicken: {
    hurt: new Sound('audio/chickenHurt.mp3', 0.1),
    dead: new Sound('audio/chickenDead.mp3', 0.3),
  },
  character: {
    dead: new Sound('audio/characterDead.mp3', 0.2),
    hurt: new Sound('audio/characterHurt.mp3', 0.2),
    jump: new Sound('audio/characterJump.mp3', 0.2),
    moveLeftOrRight: new Sound('audio/characterMoveLeftRight.mp3', 0.4),
    snooring: new Sound('audio/characterSnooring.mp3', 0.1),
    noCoinNoBottle: new Sound('audio/characterNoCoin.mp3', 0.6),
  },
  endboss: {
    attack: new Sound('audio/endbossAttack.mp3', 0.2),
    characterDetected: new Sound('audio/endbossCharacterDetected.mp3', 0.3),
    dead: new Sound('audio/endbossDead.mp3', 0.2),
    hurt: new Sound('audio/endbossHURT.mp3', 0.1),
  },
};