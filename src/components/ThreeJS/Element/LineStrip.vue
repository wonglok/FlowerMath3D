<template>
  <div class="line">
    <slot>
    </slot>
  </div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    position: {}
  },
  data () {
    return {
      element: false,
      line: false,
      material: false,
      geometry: false
    }
  },
  created () {
    this.element = this.line = new THREE.Line()
    this.$parent.$emit('add', this.line)
    this.$emit('element', this.element)

    this.$on('material', (v) => {
      this.material = v
      this.tryUpdateMaterial()
    })
    this.$on('geometry', (v) => {
      // var wireframe = new THREE.WireframeGeometry(v)
      this.geometry = v
      this.tryUpdateGeometry()
    })
  },
  beforeDestroy () {
    this.uninstall()
  },
  methods: {
    tryUpdateGeometry (v) {
      if (this.line) {
        this.line.geometry = this.geometry
      }
    },
    tryUpdateMaterial (v) {
      if (this.line) {
        this.line.material = this.material
      }
    },
    uninstall () {
      this.$parent.$emit('remove', this.line)
    }
  }
}
</script>

<style>

</style>
