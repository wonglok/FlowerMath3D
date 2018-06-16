<template>
<div class="full">
  <Viewer class="viewer" :plotters="plotters" />
  <div class="editor">
    <div class="viewer-list">
      <Viewer
        :class="{ 'marker': current === plot, 'no-marker': current !== plot }"
        :noControl="true"
        :key="plot.id"
        v-for="plot in plotters"
        class="viewer-item" :plotters="[plot]"
        @click="current = plot"
      />
    </div>

    <Editor v-if="current && current.type === 'code'" :current="current" :plotters="plotters" @clone="cloneMe" />
    <Editor2D v-if="current && current.type === 'blockers'" :current="current" @clone="cloneMe" />
  </div>

</div>
</template>

<script>
import Viewer from './Viewer/Viewer.vue'
import Editor from './Editor/Editor.vue'
import Editor2D from './Editor2D/Editor2D.vue'
import * as coder from './Editor2D/coder.js'

export default {
  components: {
    Viewer,
    Editor,
    Editor2D
  },
  data () {
    return {
      current: false,
      editWith: 'blockers',
      plotters: [
        {
          type: 'code',
          id: Math.random() + '',
          color: '#ff0000',
          formula:
`
// mover 3D
//output global
var max = 1024;

var index = 0;
// mover3D.reset();

for (var i = 0; i < max; i++) {
  mover3D.turnBy(0.0, 13, 0.0);
  mover3D.moveBy(2.0, 0.07, 0.0);
}
`,
          stepper: 0.2
        },
        {
          type: 'code',
          id: Math.random() + '',
          color: '#ff0000',
          formula:
`
// mover2D
//output global
var max = 2048;

var index = 0;
// mover2D.reset();

for (var i = 0; i < max; i++) {
  mover2D.turnBy(45.1, 'xy');
  mover2D.moveBy(205 * i / max);
}

`,
          stepper: 0.2
        },
        {
          type: 'code',
          id: Math.random() + '',
          color: '#ff00ff',
          formula:

`
// Spiral
//output global
var max = 1024;

var index = 0;
for (var i = 0; i < max; i++) {
  let e = i / max * Math.PI * 2.0;

  var x = (0.5 - Math.sin(e) * Math.sin(e)) * 100.0;
  var y = (Math.sin(e) * Math.cos(e)) * 100.0;
  var z = e * 10.0;

  positions[index++] = x;
  positions[index++] = y;
  positions[index++] = z;
}
`,
          stepper: 0.75
        },
        {
          type: 'code',
          id: Math.random() + '',
          color: '#bababa',
          formula:
`
// random path
//output global
var max = 1024;

var x = 0;
var y = 0;
var z = 0;
var index = 0;
for (var i = 0; i < max; i++) {
  positions[index++] = x;
  positions[index++] = y;
  positions[index++] = z;

  x += (Math.random() - 0.5) * 8;
  y += (Math.random() - 0.5) * 8;
  z += (Math.random() - 0.5) * 8;
}
`,
          stepper: 0.01
        },
        {
          type: 'blockers',
          id: Math.random() + '',
          color: '#000000',
          stepper: 1.0,
          formula: '',
          blockers: coder.makeDemo1()
        }
      ]
    }
  },
  mounted () {
    this.current = this.plotters.find(e => e.type === 'blockers')
  },
  methods: {
    cloneMe (item) {
      var newItem = JSON.parse(JSON.stringify(item))
      newItem.id = Math.random() + ''
      newItem.color = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`
      this.plotters.push(newItem)
    }
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
.viewer{
  border: silver solid 1px;
  position: fixed;
  top: 0px;
  left: 0px;
  width: calc(100% - 60vw);
  height: calc(100% - 100px);
}
.editor{
  border: silver solid 1px;
  position: absolute;
  top: 0px;
  right: 0px;
  width: 60vw;
  /* height: 100%; */
  height: calc(100% - 100px);

  /* overflow: auto;
  -webkit-overflow-scrolling: touch; */
}

.viewer-list{
  width: 100%;
  display: block;
  flex-wrap: warp;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.viewer-item{
  display: inline-block;
  width: 100px;
  height: 100px;
}

.marker{
  border: blue solid 2px;
}
.no-marker{
  border: white solid 2px;
}


@media screen and (max-width: 600px){
  .full{
    display: flex;
    flex-direction: column;
  }
  .viewer{
    position: relative;
    top: unset;
    left: unset;
    width: 100%;
    height: 400px;
  }
  .editor{
    position: relative;
    top: unset;
    right: unset;
    margin-top: 50px;
    width: 100%;
    height: 400px;
  }
}

</style>
