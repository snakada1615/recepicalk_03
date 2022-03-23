<template>
  <b-container>
    <b-modal
      :id="name"
    >
      <div>halo</div>
    </b-modal>
    <b-button id="openButton" @click="oncClick" size="sm">open {{name}}</b-button>
  </b-container>
</template>

<script>
export default {
  props:{
    name: {
      type: String,
      default: () => "baka",
    },
  },
  methods:{
    oncClick(){
      this.$bvModal.show(this.name)
    },
  }
}
</script>

<style scoped>

</style>
