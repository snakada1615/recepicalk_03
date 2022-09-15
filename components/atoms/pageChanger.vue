<template>
  <b-container>
    <b-row align-h="between">
      <b-button @click="moveBack(tabIndex)"><</b-button>
      {{ tabTextSet[tabIndex] }}
      <b-button @click="moveForward(tabIndex)">></b-button>
    </b-row>
    <b-table striped hover :items="items" small thead-class="hidden_header" class="mt-2"></b-table>
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
    pageCount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      items: [
        {
          col1:'add family',
          col2:'select family',
          col3:'current diet',
          col4:'priority commodity',
          col5:'crop feasibility',
          col6:'crop feasibility assessment summary',
          col7:'overall result',
        }
      ]
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

<style>
.hidden_header {
  display: none;
}
</style>
