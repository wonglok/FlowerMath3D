<template>
  <div class="wrapper" ref="wrapper">

    <Renderer
      v-if="size"
      ref="renderer"
      @toucher="setupTouch"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
    </Renderer>

    <!--
    <button @click="lookAt('xy')">XY</button>
    <input type="checkbox" v-model="helper.xy">


    <button @click="lookAt('xz')">XZ</button>
    <input type="checkbox" v-model="helper.xz">

    <button @click="lookAt('yz')">YZ</button>
    <input type="checkbox" v-model="helper.yz">
    -->

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="camPos"
      @camera="(v) => { camera = v; }"
      @refresh="(v) => { camera = v; }"
    />

    <Scene @scene="(v) => { scene = v }">

      <BlockerOutlet
        v-if="root && toucher && camera && control"
        :toucher="toucher"
        :camera="camera"
        :control="control"
        :root="root"
      />

      <!-- x plane -->
      <!-- <Object3D :rz="PI / 2.0" v-if="helper.yz">
        <PlaneHelper :colorAxis="'#000000'" :colorGrid="'rgb(185,185,255)'" />
      </Object3D> -->

      <!-- y plane -->
      <!-- <Object3D :ry="PI / 2.0" v-if="helper.xz">
        <PlaneHelper :colorAxis="'#000000'" :colorGrid="'rgb(185,255,185)'" />
      </Object3D> -->

      <!-- xy plane -->
      <!-- <Object3D :rx="PI / 2.0" v-if="helper.xy">
        <PlaneHelper :colorAxis="'#000000'" :colorGrid="'rgb(255,185,185)'" />
      </Object3D> -->

      <!-- <Object3D :pz="200">
        <PointLight />
      </Object3D> -->

      <!-- <Object3D :pz="0">
        <LineStrip :key="plotter.id" v-for="plotter in plotters">
          <DrawCountBufferGeometry :formula="plotter.formula" :step="plotter.stepper" />
          <LineBasicMaterial :color="plotter.color" />
        </LineStrip>
      </Object3D> -->



    </Scene>

  </div>
</template>

<script>
import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

/* eslint-disable */
// import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'
import 'imports-loader?THREE=three!@/components/shared/Touch/DragDrag.js'
import 'imports-loader?THREE=three!@/components/shared/Touch/TrackTrack.js'
/* eslint-enable */

import Bundle from '@/components/ThreeJS/Bundle.js'
// import simpleVS from '@/components/Shaders/Simple/vs.vert'
// import simpleFS from '@/components/Shaders/Simple/fs.frag'
// import DDCore from './DDCore.vue'
import BlockerOutlet from './BlockerOutlet.vue'
import * as Blockers from './blockers.js'

export default {
  props: {
    plotters: {}
  },
  components: {
    ...Bundle,
    BlockerOutlet
    // DDCore
  },
  data () {
    return {
      Blockers,
      root: false,
      helper: {
        xy: true,
        yz: true,
        xz: true
      },
      camPos: { x: 0, y: 0, z: 200 },
      PI: Math.PI,
      world: {
        rx: 0,
        ry: 0,
        rz: 0
      },
      THREE,
      control: false,
      toucher: false,
      animatable: {
        time: { value: 0 }
      },
      size: false,
      renderer: false,
      scene: false,
      camera: false
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    setupTrack () {
      let control = this.control = new THREE.TrackTrack(this.camera, this.toucher)
      control.rotateSpeed = 1.0
      control.zoomSpeed = 1.0
      control.panSpeed = window.innerWidth <= 500 ? 0.25 : 0.5
      control.noZoom = false
      control.noPan = false
      control.staticMoving = false
      control.dynamicDampingFactor = 0.234
    },
    // setupOribit () {
    //   this.control = new THREE.OrbitControls(this.camera, this.toucher)
    // },
    setupTouch (toucher) {
      this.toucher = toucher
      // this.setupOribit()
      this.setupTrack()
    },
    renderWebGL () {
      TWEEN.update()

      this.animatable.time.value = window.performance.now() * 0.001

      if (this.control) {
        this.control.update()
      }
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.root = Blockers.maker()
      let blockers = this.root.state.blockers

      let iio = Blockers.makeItem()
      iio.pos.x = 20
      blockers.push(iio)

      iio = Blockers.makeItem()
      iio.pos.x = -20
      blockers.push(iio)
    }, 10)

    var resizer = () => {
      var rect = this.$refs['wrapper'].getBoundingClientRect()
      this.size = {
        width: rect.width,
        height: rect.height,
        aspect: rect.width / rect.height
      }
      this.$nextTick(() => {
        this.$refs['renderer'].resize()
      })
    }
    window.addEventListener('resize', resizer, false)
    resizer()

    this.$nextTick(resizer)

    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.plotters{
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.plotter{
  width: 500px;
}
</style>
