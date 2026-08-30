<script>
import * as Phaser from 'phaser'
import { Game } from 'phavuer'
import config from './data/config'
import Root from '@/components/Root.vue'

const gameConfig = {
  type: Phaser.AUTO,
  width: config.WIDTH,
  height: config.HEIGHT,
  render: {
    roundPixels: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { x: 0, y: 0 }
    }
  },
  input: {
    activePointers: 3
  }
  // fps: { target: 30, forceSetTimeOut: true }
}

export default {
  components: { Root, Game },
  setup () {
    return {
      gameConfig
    }
  }
}
</script>

<template>
  <Game :config="gameConfig">
    <Root />
  </Game>
</template>
