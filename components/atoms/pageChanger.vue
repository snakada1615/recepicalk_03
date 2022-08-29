<template>
  <b-container>
    <b-row align-h="between">
      <b-button @click="moveBack(tabIndex)"><</b-button>
      {{ tabTextSet[tabIndex] }}
      <b-button @click="moveForward(tabIndex)">></b-button>
    </b-row>
  </b-container>
</template>
<script>

export default {
  props: {
    tabIndex: {
      type: Number,
      required: true
    },
    tabTextSet: {
      type: Array,
      required: true
    },
    pageCount:{
      type: Number,
      required: true
    }
  },
  methods: {
    moveForward(i) {
      let res = i + 1
      if (res > this.pageCount - 1) {
        res = this.pageCount - 1
      }
      this.$emit('update:tabIndex', res)
    },
    moveBack(i) {
      let res = i - 1
      if (res < 0) {
        res = 0
      }
      this.$emit('update:tabIndex', res)
    },
  },
}
</script>
