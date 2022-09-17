<template>
  <b-container>
    <b-row align-h="between">
      <b-button variant="light"  @click="moveBack(tabIndex)"><</b-button>
      <h2>{{ tabTextSet[tabIndex] }}</h2>
      <b-button variant="light" @click="moveForward(tabIndex)">></b-button>
    </b-row>
    <b-card bg-variant="gray-300" class="mt-2">
      <b-row class="text-center">
        <b-col>
          <b-badge
            v-for="(item, index) in Object.values(items[0])"
            :key="item"
            class="mx-1"
            :variant="tabColor[index]"
          >
            {{ item }}
          </b-badge>
        </b-col>
      </b-row>
    </b-card>
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
          col1: 'add family',
          col2: 'select family',
          col3: 'current diet',
          col4: 'priority commodity',
          col5: 'crop feasibility',
          col6: 'crop feasibility assessment summary',
          col7: 'overall result',
        }
      ]
    }
  },
  computed: {
    tabColor(){
      return Object.values(this.items[0]).map((dat, index)=>{
        if (index === this.tabIndex){
          return 'primary'
        } else {
          return 'success-3'
        }
      })
    },
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
