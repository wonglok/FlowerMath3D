<template>
  <div class="geo-box"></div>
</template>

<script>
import * as THREE from 'three'
import Worker from './GeoWorker.worker.js'

export default {
  props: {
    step: {
      default: 0
    },
    formula: {
      required: true
    }
  },
  data () {
    return {
      updateDrawRage () {},
      worker: false,
      Worker,
      maxPoints: 0,
      drawCount: 0,
      geometry: false
    }
  },
  watch: {
    step () {
      this.updateDrawRage()
    },
    formula () {
      this.setup()
    }
  },
  mounted () {
    this.$parent.$emit('geometry', new THREE.BoxBufferGeometry(0.01, 0.01, 0.01, 1, 1, 1))
    this.setup()
  },
  methods: {
    setup () {
      if (this.worker) {
        this.worker.terminate()
      }
      this.worker = new Worker()
      setTimeout(() => {
        this.worker.terminate()
      }, 1000 * 120)

      this.worker.postMessage({ formula: this.formula })
      this.worker.addEventListener('message', (evt) => {
        // console.log(evt.data)
        let positions = evt.data.positions

        this.maxPoints = positions.length / 3
        let geometry = new THREE.BufferGeometry()

        // attributes
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

        geometry.attributes.position.needsUpdate = true

        this.updateDrawRage = () => {
          this.drawCount = Math.floor(this.step * this.maxPoints)
          geometry.setDrawRange(0, this.drawCount)
        }
        this.updateDrawRage()

        this.$parent.$emit('geometry', geometry)
      })
    }
  }
}
</script>

<style>

</style>
