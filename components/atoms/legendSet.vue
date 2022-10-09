<template>
  <b-container>
    <svg height="40" width="80" v-for="(item, index) in legendDataset.dataset" :key="index">
      <rect
        :x="legendDataset.rectOptions.x"
        :y="legendDataset.rectOptions.y"
        :width="legendDataset.rectOptions.width"
        :height="legendDataset.rectOptions.height"
        :fill="item.bgColor"
      />
      <text
        :x="item.x"
        :y="item.y"
        :fill="item.textColor"
        :font-size="item.fontSize"
        font-weight="bold"
      >{{ item.text }}
      </text>
    </svg>
  </b-container>
</template>

<script>
export default {
  name: "legendSet",
  props:{
    legendDataset:{
      type: Object,
      required: true
    }
  }
}
</script>
