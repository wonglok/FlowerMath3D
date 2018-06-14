<template>
  <div>
    <slot />
  </div>
</template>

<script>
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'
import 'imports-loader?THREE=three!@/components/shared/Touch/DragDrag.js'
/* eslint-enable */

export default {
  props: {
    control: {},
    camera: {},
    toucher: {},
    draggables: {
      default () {
        return []
      }
    },
    droppables: {
      default () {
        return []
      }
    }
  },
  data () {
    return {
      TWEEN,
      THREE,
      drag: false
    }
  },
  methods: {
    onReady () {
      let drag = this.drag = new THREE.DragDrag(this.draggables, this.camera, this.toucher)
      drag.addEventListener('dragstart', this.onDragStart)
      drag.addEventListener('drag', this.onDragging)
      drag.addEventListener('click', this.onClick)
      drag.addEventListener('dragend', this.onDragEnd)

      this.$emit('ready', this)
    },
    clean () {
      this.drag.deactivate()
    },
    restart () {
      this.drag.deactivate()
      this.drag.activate()
    },
    onDragStart (evt) {
      // let onHand = evt.object

      this.control.enabled = false
    },
    onDragging (evt) {
      this.control.enabled = false
      let onHand = evt.object
      // this.sendToFront({ onHand, sendOtherBack: false })
      this.$emit('move', { onHand })

      this.getNearest({ mesh: onHand, compares: this.droppables.filter((eMesh) => { return eMesh.uuid !== onHand.uuid }) }).then((nearest) => {
        // onHand.material.color = this.colors.darkGreen
        this.$emit('hover', {
          onHand,
          nearest
        })
      }, () => {
        this.$emit('miss', {
          onHand
        })
      })
    },
    onClick () {

    },
    onDragEnd (evt) {
      this.control.enabled = true
      let onHand = evt.object
      this.getNearest({ mesh: onHand, compares: this.droppables.filter((eMesh) => { return eMesh.uuid !== onHand.uuid }) }).then((nearest) => {
        this.$emit('found', {
          onHand,
          nearest
        })
      }, () => {
        this.$emit('not-found', {
          onHand
        })
      })
    },
    add ({ mesh, info, canDrag, canDrop }) {
      mesh.userData = mesh.userData || {}
      mesh.userData.info = info
      canDrag && this.draggables.push(mesh)
      canDrop && this.droppables.push(mesh)
    },
    remove ({ mesh }) {
      this.draggables.forEach((im, idx) => {
        if (mesh.uuid === im.uuid) {
          this.draggables.splice(idx, 1)
        }
      })
      this.droppables.forEach((im, idx) => {
        if (mesh.uuid === im.uuid) {
          this.droppables.splice(idx, 1)
        }
      })
    },
    getNearest ({ mesh, compares }) {
      return new Promise((resolve, reject) => {
        let found = false
        compares.reduce((accu, item, key) => {
          let distance = item.position.clone().setFromMatrixPosition(item.matrixWorld).sub(mesh.position.clone().setFromMatrixPosition(mesh.matrixWorld)).length()
          let w = item.geometry.parameters.width / 2
          let h = item.geometry.parameters.height / 2
          // let dist = Math.sqrt(w * w + h * h)
          if (distance < w || distance < h) {
            accu.push(item)
          }
          return accu
        }, []).sort((itemA, itemB) => {
          let distanceA = itemA.position.clone().setFromMatrixPosition(itemA.matrixWorld).sub(mesh.position.clone().setFromMatrixPosition(mesh.matrixWorld)).length()
          let distanceB = itemB.position.clone().setFromMatrixPosition(itemB.matrixWorld).sub(mesh.position.clone().setFromMatrixPosition(mesh.matrixWorld)).length()
          return distanceA > distanceB
        }).forEach((item, key) => {
          let distance = item.position.clone().setFromMatrixPosition(item.matrixWorld).sub(mesh.position.clone().setFromMatrixPosition(mesh.matrixWorld)).length()
          console.log(distance)

          if (key === 0) {
            found = true
            resolve(item)
          }
        })
        if (!found) {
          reject(new Error('cant find'))
          console.log('cant find', mesh, compares)
        }
      })
    }
  },
  mounted () {
    this.onReady()
  }
}
</script>

<style>

</style>
