<template>
  <div>
    <div class="plotters" :key="plotter.id" v-for="plotter in plotters">
      <div class="plotter">
        <input type="text" v-model="plotter.color">
        <input class="color" type="color" v-model="plotter.color">
        <input type="range" min="0" max="1.0" step="0.00001" v-model="plotter.stepper">
        <button @click="cloneThis(plotter)">Clone me</button>
        <ACE
          @save="() => {
          }"
          :path="plotter.id + '.js'"
          v-model="plotter.formula"
          @input="() => { isDirty = true; }"
          theme="chrome"
          width="100%"
          :height="'500'"
        >
        </ACE>
      </div>
    </div>
  </div>
</template>

<script>
import ACE from '@/components/shared/ACE/ACE.vue'

export default {
  props: {
    plotters: {}
  },
  components: {
    ACE
  },
  methods: {
    cloneThis (item) {
      var newItem = JSON.parse(JSON.stringify(item))
      newItem.id = Math.random() + ''
      newItem.color = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`
      this.plotters.push(newItem)
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
.color{
  width: 40px;
}
</style>
