<template>
<div class="line-basic-material"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    color: {
      default () {
        return Math.random() * 0xffffff
      }
    }
  },
  data () {
    return {
      material: false
    }
  },
  watch: {
    color () {
      this.setup()
    }
  },
  methods: {
    setup () {
      this.material = new THREE.LineBasicMaterial({
        color: new THREE.Color(this.color),
        linewidth: 0.25
      })
      this.$parent.$emit('material', this.material)
    }
  },
  mounted () {
    this.setup()
  }
}
</script>

<style>

</style>
