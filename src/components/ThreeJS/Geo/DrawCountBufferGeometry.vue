<template>
  <div class="geo-box"></div>
</template>

<script>
import * as THREE from 'three'

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
    this.setup()
  },
  methods: {
    setup () {
      // update positions
      var mover = {
        angle: 0,
        position: { x: 0, y: 0, z: 0 },
        plane: 'xy',
        reset: () => {
          mover.plane = 'xy'
          mover.angle = 0
          mover.position.x = 0
          mover.position.y = 0
          mover.position.z = 0
        },
        turnBy: (by, plane) => {
          mover.angle += by / 360 * (Math.PI * 2)
          mover.plane = plane || mover.plane
        },
        moveBy: (by, plane) => {
          var dx = by * Math.sin(mover.angle)
          var dy = by * Math.cos(mover.angle)
          var dz = 0.0
          mover.plane = plane || mover.plane

          if (mover.plane === 'xy') {
            mover.position.x += dx
            mover.position.y += dy
            mover.position.z += dz
          } else if (mover.plane === 'xz') {
            mover.position.x += dx
            mover.position.y += dz
            mover.position.z += dy
          } else if (mover.plane === 'yz') {
            mover.position.x += dz
            mover.position.y += dx
            mover.position.z += dy
          }
        }
      }
      var mover3D = {
        position: new THREE.Vector3(),
        object3D: new THREE.Object3D(),
        reset: () => {
          mover3D.object3D = new THREE.Object3D()
          mover3D.position = new THREE.Vector3()
        },
        turnBy: (x, y, z) => {
          x = x || 0
          y = y || 0
          z = z || 0

          mover3D.object3D.rotation['x'] = x / 360 * (Math.PI * 2)
          mover3D.object3D.rotation['y'] = y / 360 * (Math.PI * 2)
          mover3D.object3D.rotation['z'] = z / 360 * (Math.PI * 2)
        },
        moveBy: (x, y, z) => {
          x = x || 0
          y = y || 0
          z = z || 0

          mover3D.object3D.position['x'] = x
          mover3D.object3D.position['y'] = y
          mover3D.object3D.position['z'] = z

          mover3D.object3D.updateMatrix()
          mover3D.position.applyMatrix4(mover3D.object3D.matrix)
        }
      }

      /* eslint-disable */
      var makeVertex = new Function('output', 'mover2D', 'mover3D', this.formula)
      /* eslint-enable */
      var output = {
        positions: []
      }
      makeVertex(output, mover, mover3D)
      console.log(output)

      this.maxPoints = output.positions.length / 3
      let geometry = new THREE.BufferGeometry()

      // attributes
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(output.positions, 3))

      geometry.attributes.position.needsUpdate = true

      this.updateDrawRage = () => {
        this.drawCount = Math.floor(this.step * this.maxPoints)
        geometry.setDrawRange(0, this.drawCount)
      }
      this.updateDrawRage()

      this.$parent.$emit('geometry', geometry)
    }
  }
}
</script>

<style>

</style>
