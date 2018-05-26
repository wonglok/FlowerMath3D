<template>
<div class="full">
  <Viewer class="viewer" :plotters="plotters" />
  <Editor class="editor" :plotters="plotters" />
</div>
</template>

<script>
import Viewer from './Viewer/Viewer.vue'
import Editor from './Editor/Editor.vue'
export default {
  components: {
    Viewer,
    Editor
  },
  data () {
    return {
      plotters: [
        {
          id: Math.random() + '',
          color: '#ff0000',
          formula:
`
// mover 3D
//output global
var positions = output.positions;
var max = 1024;

var index = 0;
// mover3D.reset();

for (var i = 0; i < max; i++) {
  mover3D.turnBy(0.0, 13, 0.0);
  mover3D.moveBy(2.0, 0.07, 0.0);

  positions[index++] = mover3D.position.x;
  positions[index++] = mover3D.position.y;
  positions[index++] = mover3D.position.z;
}
`,
          stepper: 0.2
        },
        {
          id: Math.random() + '',
          color: '#ff0000',
          formula:
`
// mover2D
//output global
var positions = output.positions;
var max = 2048;

var index = 0;
// mover2D.reset();

for (var i = 0; i < max; i++) {
  mover2D.turnBy(45.2, 'xy');
  mover2D.moveBy(205 * i / max);

  positions[index++] = mover2D.position.x;
  positions[index++] = mover2D.position.y;
  positions[index++] = mover2D.position.z;

  // positions[index++] = 200 * i / max;
}

`,
          stepper: 0.2
        },
        {
          id: Math.random() + '',
          color: '#ff00ff',
          formula:

`
// Spiral
//output global
var positions = output.positions;
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
          id: Math.random() + '',
          color: '#bababa',
          formula:
`
// random path
//output global
var positions = output.positions;
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
        }
      ]
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
  width: calc(100% - 500px);
  height: calc(100% - 100px);
}
.editor{
  position: absolute;
  top: 0px;
  right: 0px;
  width: 500px;
  height: 100%;

  overflow: auto;
  -webkit-overflow-scrolling: touch;
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
