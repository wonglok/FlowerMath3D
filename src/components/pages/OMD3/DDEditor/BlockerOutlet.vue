<template>
<div>
  <DDCore
    v-if="toucher && camera && control"
    :toucher="toucher"
    :camera="camera"
    :control="control"

    :draggables="draggables"

    @ready="(api) => { ddAPI = api }"

    @move="onMove"
    @hover="onHover"
    @miss="onMiss"

    @found="onFound"
    @not-found="onNotFound"
  />

  <Object3D
    v-if="ddAPI && root"

    v-for="(dd) in root.state.blockers"
    :key="dd.id"
  >

    <BlockerItem
      :dd="dd"
      :ddAPI="ddAPI"
    />

  </Object3D>

  <pre v-if="ddAPI">{{ root.state.blockers }}</pre>
</div>
</template>

<script>
import * as THREE from 'three'
import Bundle from '@/components/ThreeJS/Bundle.js'
// import simpleVS from '@/components/Shaders/Simple/vs.vert'
// import simpleFS from '@/components/Shaders/Simple/fs.frag'
import BlockerItem from './BlockerItem.vue'
import DDCore from './DDCore.vue'
import * as Blockers from './blockers.js'

export default {
  props: {
    draggables: {
      default () {
        return []
      }
    },
    root: {},
    toucher: {},
    camera: {},
    control: {}
  },
  components: {
    ...Bundle,
    DDCore,
    BlockerItem
  },
  data () {
    return {
      ddAPI: false,
      Blockers,
      colors: {
        red: new THREE.Color(0xff0000),
        green: new THREE.Color(0x00ff00),
        darkGreen: new THREE.Color(0x00bb00),
        blue: new THREE.Color(0x0000ff),
        silver: new THREE.Color(0xeeeeee),
        grey: new THREE.Color(0xeeeeee)
      }
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
    console.log(this.ddAPI)
  },
  methods: {
    updateBox ({ onHand }) {
      // if (onHand.userData.type === 'overlay') {
      //   onHand.userData.info.pos.x = onHand.position.x
      //   onHand.userData.info.pos.y = onHand.position.y
      //   onHand.userData.info.pos.z = onHand.position.z

      //   // let nextStep = att.nextStep

      //   // nextStep.position.copy(onHand.userData.info.pos)
      //   // body.position.copy(onHand.userData.info.pos)
      //   // this.$forceUpdate()
      // }
    },
    onMove ({ onHand }) {
      console.log(onHand)
      this.updateBox({ onHand })
      this.sendToFront({ onHand, sendOtherBack: false })
    },
    onHover ({ onHand, nearest }) {
      onHand.material.color = this.colors.blue
      this.sendToFront({ onHand, sendOtherBack: false })
    },
    onMiss ({ onHand }) {
      onHand.material.color = this.colors.grey
    },
    onFound ({ onHand, nearest }) {
      onHand.material.color = this.colors.green
      nearest.material.color = this.colors.grey
      this.sendToFront({ onHand, sendOtherBack: true })
    },
    onNotFound ({ onHand }) {
      onHand.material.color = this.colors.grey
      this.sendToFront({ onHand, sendOtherBack: true })
    },
    sendToFront ({ onHand, sendOtherBack }) {
      let maxZ = this.draggables.reduce((accu, item, index) => {
        if (item.position.z > accu) {
          accu = item.position.z
        }
        // item.position.z -= 0.1
        return accu
      }, 0)

      if (sendOtherBack) {
        this.draggables.forEach((dd) => {
          if (dd.position.z <= maxZ) {
            dd.position.z -= 0.1
          }
        })
        onHand.position.z = maxZ
      } else {
        onHand.position.z = maxZ + 0.1
      }
    },
    arriveBox (onHand, nearest) {
      if (onHand.isAt) {
        this.leaveBox({ isAt: onHand.isAt, onHand })
      }
      console.log(nearest.userData.info.bucket.findIndex(bb => bb.uuid === onHand.uuid))
      if (nearest.userData.info.bucket.findIndex(bb => bb.uuid === onHand.uuid) === -1) {
        nearest.userData.info.bucket.push({ id: onHand.userData.info.id })
        onHand.isAt = nearest.userData.info
      }
    },
    leaveBox ({ isAt, onHand }) {
      let isAtMesh = this.draggables.find((dg) => { return dg.userData.info.id === isAt.id })

      isAtMesh.userData.info.bucket.forEach((bb, idx) => {
        if (bb.id === onHand.userData.info.id) {
          isAtMesh.userData.info.bucket.splice(idx, 1)
        }
      })
    }
  }
}
</script>

<style>

</style>
