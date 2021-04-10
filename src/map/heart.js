import { inject } from 'vue'
import Talker from '@/util/Talker'
import { MAIN_STEPS } from '@/data/eventSteps'
import config from '@/data/config'
export default {
  bgm: null,
  async create () {
    const uiScene = inject('uiScene').value
    const gameScene = inject('gameScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const libra = inject('player').value
    const camera = inject('camera').value
    const event = inject('event')
    const achieve = inject('achieve')

    const heartImage = field.images.find(v => v.name === 'heart').ref.value
    heartImage.setOrigin(0.5).setPosition(heartImage.x + heartImage.width.half, heartImage.y + heartImage.height.half).setTint(0x550000)
    const tween = heartImage.scene.add.tween({ targets: heartImage, loop: -1, yoyo: true, duration: 200, hold: 1200, scale: { from: 1, to: 0.93 } })
    if (state.events.main >= MAIN_STEPS.DEAD) {
      tween.stop()
      heartImage.setTint(0x330022).setScale(0.5).setDepth(heartImage.y + (heartImage.height.half * 0.5))
    }

    const kajitsu = field.getObjectById(3)
    const amili = field.getObjectById(6)
    amili.setRandomWalk()
    const speakLibra = talk.getSpeakScripts(new Talker(t('name.libra'), libra.object))
    const speakKajitsu = talk.getSpeakScripts(new Talker(t('name.kajitsu'), kajitsu.object))
    const speakAmili = talk.getSpeakScripts(new Talker(t('name.amili'), amili.object))

    kajitsu.setVisible(false)
    amili.setVisible(false)

    if (state.events.main === MAIN_STEPS.CROSSING) {
      kajitsu.setVisible(true)
      event.exec(async () => {
        await sleep(500)
        await libra.setTargetPosition(field.positions.relay.x, field.positions.relay.y)
        kajitsu.lookTo('left')
        await libra.setTargetPosition(field.positions.center.x, field.positions.center.y)
        await sleep(1000)
        const revert = await camera.move(0, -100, 1000)
        await sleep(1000)
        await speakKajitsu(t('events.heart.start1'))
        await sleep(500)
        libra.lookTo('right')
        await sleep(500)
        await speakKajitsu(t('events.heart.start2'))
        await speakLibra(t('events.libra.exclamation'))
        await sleep(500)
        await speakKajitsu(t('events.heart.start3'))
        await speakLibra(t('events.libra.silence'))
        await speakKajitsu(t('events.heart.start4'))
        const completeTransition = await uiScene.transition(1000)
        revert()
        libra.lookTo('up')
        kajitsu.setVisible(false)
        state.events.main = MAIN_STEPS.HEART
        await completeTransition()
      })
    }
    if (state.events.main === MAIN_STEPS.BRAIN) {
      kajitsu.setVisible(true)
      event.exec(async () => {
        await sleep(1500)
        await libra.setTargetPosition(field.positions.relay.x, field.positions.relay.y)
        kajitsu.lookTo('left')
        await libra.setTargetPosition(field.positions.center.x, field.positions.center.y)
        await sleep(1000)
        const revert = await camera.move(0, -100, 1000)
        await sleep(1000)
        await speakKajitsu(t('events.dream.kajitsu1'))
        libra.lookTo('right')
        await sleep(500)
        await speakKajitsu(t('events.dream.kajitsu2'))
        await speakLibra(t('events.libra.silence'))
        await speakKajitsu(t('events.dream.kajitsu3'))
        const cancel = await uiScene.setSelector(t('events.dream.yesno')) === 1
        if (cancel) {
          await speakKajitsu(t('events.dream.cancel'))
          const completeTransition = await uiScene.transition(1000)
          revert()
          kajitsu.setVisible(false)
          libra.lookTo('up')
          await completeTransition()
          return
        }
        await speakKajitsu(t('events.dream.kajitsu4'))
        await sleep(500)
        libra.lookTo('up')
        await sleep(500)
        await speakLibra(t('events.libra.silence'))
        await sleep(500)
        const white = await uiScene.transition(6000, { color: config.COLORS.white, alpha: 0.5, depth: config.DEPTH.TALK - 1, hold: 0 })
        const black = await uiScene.transition(700, { color: config.COLORS.black, alpha: 1 })
        const clear = await uiScene.setScreenMessage(t('events.dream.message'))
        await sleep(2500)
        await clear()
        kajitsu.setVisible(false)
        amili.setVisible(true)
        amili.lookTo('left')
        await sleep(500)
        await black()
        libra.lookTo('right')
        await speakLibra(t('events.libra.exclamation'))
        await speakAmili(t('events.dream.amili1'))
        await white(500, { alpha: 0.6, destroy: false })
        await speakAmili(t('events.dream.amili2'))
        await speakLibra(t('events.libra.exclamation'))
        await white(500, { alpha: 0.65, destroy: false })
        await speakAmili(t('events.dream.amili3'))
        await white(500, { alpha: 0.7, destroy: false })
        await speakAmili(t('events.dream.amili4'))
        await white(500, { alpha: 0.75, destroy: false })
        await speakAmili(t('events.dream.amili5'))
        await white(500, { alpha: 0.8, destroy: false })
        await speakAmili(t('events.dream.amili6'))
        await white(500, { alpha: 0.85, destroy: false })
        await speakAmili(t('events.dream.amili7'))
        await white(500, { alpha: 0.9, destroy: false })
        const options = async () => {
          if (state.status.heart >= 5 && state.status.body < 5) {
            await uiScene.setSelector(t('events.dream.options').slice(0, 1))
            return 0
          } else if (state.status.body >= 5 && state.status.heart < 5) {
            await uiScene.setSelector(t('events.dream.options').slice(1))
            return 1
          } else {
            return await uiScene.setSelector(t('events.dream.options'))
          }
        }
        const awake = await options() === 0
        if (awake) {
          await sleep(1500)
          await speakAmili(t('events.dream.last1.amili1'))
          await sleep(500)
          await white(3000, { alpha: 1, destroy: false })
          await sleep(3000)
          const clear = await uiScene.setScreenMessage(t('events.dream.last1.message'), 'black')
          await sleep(5000)
          await clear()
          await sleep(3000)
          sleep(3000).then(() => white(0))
          await uiScene.startCredit(true)
          achieve.activate('awaken')
          await gameScene.backToTitle()
        } else {
          sleep(1000)
          await speakAmili(t('events.dream.last2.amili1'))
          white(3000)
          const red = await uiScene.transition(1000, { color: 0x770022, alpha: 0.6, hold: 0 })
          await (15).toArray().reduce(v => {
            return v.then(async duration => {
              await red(duration, { alpha: 0.2, destroy: false })
              await red(duration, { alpha: 0.6, destroy: false })
              return Math.max(duration - 200, 200)
            })
          }, Promise.resolve(1000))
          tween.stop()
          amili.lookTo('leftUp')
          await speakAmili(t('events.dream.last2.amili2'))
          await sleep(2000)
          heartImage.scene.tweens.addCounter({
            from: 0, to: 1, duration: 2000, onUpdate: tween => {
              const r = 85 - (tween.getValue() * 34)
              const b = tween.getValue() * 34
              heartImage.setTint(Phaser.Display.Color.GetColor(r, 0, b))
            }
          })
          heartImage.scene.add.tween({ targets: heartImage, duration: 2000, scale: 0.5 })
          await red(2000)
          await speakAmili(t('events.dream.last2.amili2'))
          await sleep(1000)
          amili.lookTo('left')
          await speakAmili(t('events.dream.last2.amili3'))
          await sleep(1500)
          await speakAmili(t('events.dream.last2.amili4'))
          await sleep(1500)
          await speakAmili(t('events.dream.last2.amili5'))
          await sleep(1500)
          await speakAmili(t('events.dream.last2.amili6'))
          await sleep(3000)
          const black = await uiScene.transition(3000, { color: config.COLORS.black, alpha: 1 })
          await sleep(3000)
          const clear = await uiScene.setScreenMessage(t('events.dream.last2.message'))
          await sleep(5000)
          await clear()
          await sleep(3000)
          sleep(3000).then(() => {
            black(0)
            revert()
          })
          await uiScene.startCredit(false)
          achieve.activate('rest')
          state.events.main = MAIN_STEPS.DEAD
          await gameScene.setField('home', 0, 0, 0, { ep: true })
        }
      })
    }
  }
}
