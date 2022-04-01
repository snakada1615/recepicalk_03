<template>
  <b-container>
    <b-button @click="anonymous">anonymous</b-button>
    <b-button @click="auth">google</b-button>
    <b-card>
      <div>login:{{$store.state.fire.isLoggedIn}}</div>
      <div>name:{{$store.state.fire.user.name}}</div>
      <div>uid:{{$store.state.fire.user.uid}}</div>
    </b-card>
  </b-container>
</template>
<script>
  export default {
    methods:{
      auth(){
        this.$store.dispatch('fire/loginGoogle')
      },
      anonymous(){
        this.$store.dispatch('fire/loginGuest')
      }
    }
  }
</script>
