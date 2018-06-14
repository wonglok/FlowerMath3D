<template>
  <div>
    <!-- <div class="plotters" :key="current.id" v-for="plotter in plotters"> -->
      <div class="plotter">
        <input type="text" v-model="current.color">
        <input class="color" type="color" v-model="current.color">
        <input type="range" min="0" max="1.0" step="0.00001" v-model="current.stepper">
        <button @click="cloneThis(current)">Clone me</button>
        <ACE
          @save="() => {
          }"
          :path="current.id + '.js'"
          v-model="current.formula"
          @input="() => { isDirty = true; }"
          theme="chrome"
          width="100%"
          :height="'500'"
        >
        </ACE>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
import ACE from '@/components/shared/ACE/ACE.vue'

export default {
  props: {
    current: {},
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
