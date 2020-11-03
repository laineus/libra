<template>
  <MenuContainer :arrowX="24 + (1 * 60)" :height="415" :title="'Bag'">
    <Container :x="30" :y="56" @preUpdate="update" ref="object">
      <Image v-for="v in items" :key="v.id" :texture="`chara_sprite/${v.key}`" :x="v.bagX" :y="v.bagY" :origin="0.5" @pointerdown="grab(v)" @pointerup="drop" />
    </Container>
  </MenuContainer>
</template>

<script>
import { Container, Image, refObj } from 'phavuer'
import { inject, computed, ref } from 'vue'
import MenuContainer from '@/components/MenuContainer'
export default {
  components: { Container, Image, MenuContainer },
  setup () {
    const storage = inject('storage')
    const controller = inject('controller')
    const object = refObj(null)
    const offsetX = computed(() => object.value?.x + object.value?.parentContainer.x)
    const offsetY = computed(() => object.value?.y + object.value?.parentContainer.y)
    const grabbed = ref(null)
    console.log(storage)
    const items = computed(() => storage.state.items)
    const grab = (v) => {
      grabbed.value = v
    }
    const update = () => {
      if (grabbed.value) {
        grabbed.value.bagX = Math.fix(controller.value.activePointer.x - offsetX.value, 0, 235)
        grabbed.value.bagY = Math.fix(controller.value.activePointer.y - offsetY.value, 0, 415)
      }
    }
    const drop = () => {
      grabbed.value = null
    }
    return {
      items,
      object,
      grab, update, drop,
      c: o => console.log(o)
    }
  }
}
</script>
