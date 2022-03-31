<template>
  <b-container >
    <div>storeの内容</div>
    <b-card>
      <div>{{$store.state.fire.dri}}</div>
    </b-card>
    <b-card>
      <div>{{$store.state.fire.fct}}</div>
    </b-card>
  </b-container>
</template>

<script>

export default {
  mounted() {
    this.$store.dispatch('fire/fireGetFct')
    this.$store.dispatch('fire/fireGetDri')
  },
  methods: {}
}
</script>
