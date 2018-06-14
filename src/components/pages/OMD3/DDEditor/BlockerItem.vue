<template>
<div>
  <Object3D>

    <Object3D
    >

      <Mesh
        @attach="attachBody"
        @detach="detach"
      >
        <PlaneBufferGeometry :width="dd.w" :height="30" :nx="20" :ny="20" />
        <MeshBasicMaterial :color="0xeeeeee" />
      </Mesh>

    </Object3D>

  </Object3D>

</div>
</template>

<script>
import Bundle from '@/components/ThreeJS/Bundle.js'
// import simpleVS from '@/components/Shaders/Simple/vs.vert'
// import simpleFS from '@/components/Shaders/Simple/fs.frag'
// import DDCore from './DDCore.vue'
import * as Blockers from './blockers.js'
import * as THREE from 'three'

export default {
  props: {
    dd: {},
    ddAPI: {}
  },
  components: {
    ...Bundle
  },
  data () {
    return {
      Blockers,
      THREE,
      overlay: false,
      group: false
    }
  },
  created () {
    this.$on('add', (v) => {
      this.$parent.$emit('add', v)
    })
    this.$on('remove', (v) => {
      this.$parent.$emit('remove', v)
    })
  },
  mounted () {
    this.group.position.copy(this.dd.pos)
  },
  watch: {
  },
  computed: {
    pos () {
      return this.dd.pos
    }
  },
  methods: {
    attachBody (v) {
      this.ddAPI.add({ mesh: v, info: this.dd, canDrop: true, canDrag: true })
    },
    detach (v) {
      this.ddAPI.remove({ mesh: v, info: this.dd })
    }
  }
}
</script>

<style>

</style>
