<template>
  <div class="hello">
    <OMD3 class="hello" />
  </div>
</template>

<script>
import OMD3 from '@/components/pages/OMD3/OMD3.vue'
export default {
  components: {
    OMD3
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  width: 100%;
  height: 100%;
}
</style>
