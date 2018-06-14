<template>
<div class="editor-2D">

  <pre>{{ coder.getCode(current.blockers.tree, current.blockers.tree.id) }}</pre>

  <input type="text" v-model="current.color">
  <input class="color" type="color" v-model="current.color">
  <input type="range" min="0" max="1.0" step="0.00001" v-model="current.stepper">
  <button @click="cloneThis(current)">Clone me</button>

  <div class="horizontal">
    <ul v-if="tools">
      <LoopItem
        class="item"
        :model="tools"
      />
    </ul>

    <ul v-if="current && current.blockers && current.blockers.tree">
      <LoopItem
        class="item"
        :model="current.blockers.tree"
      />
    </ul>

  </div>
  <!-- <pre>{{ demo.tree }}</pre> -->

</div>
</template>

<script>
import draggable from 'vuedraggable'
import LoopItem from './LoopItem.vue'
import * as coder from './coder.js'
import Viewer from '../Viewer/Viewer.vue'

let rID = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export default {
  components: {
    draggable,
    LoopItem,
    Viewer
  },
  props: {
    current: {}
  },
  data () {
    return {
      console,
      JSON,
      rID,
      coder: coder.make(),
      tools: coder.makeTools()
    }
  },
  mounted () {
    this.current.formula = this.formula
  },
  watch: {
    formula () {
      this.current.formula = this.formula
    }
  },
  computed: {
    formula () {
      return this.coder.getCode(this.current.blockers.tree, this.current.blockers.tree.id)
    }
  },
  methods: {

  }
}
</script>

<style scoped>

.editor-2D{
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.horizontal{
  display: flex;
}

.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}


</style>
