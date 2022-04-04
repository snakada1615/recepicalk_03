<template>
  <b-container>
    <b-button @click="anonymous">anonymous</b-button>
    <b-button @click="auth">google</b-button>
    <b-button @click="logOut">logout</b-button>
    <b-card>
      <div>
        login:
        <span v-if="$store.state.fire.isLoggedIn" class="text-success">on</span>
        <span v-else class="text-danger">off</span>
      </div>
      <div>name:{{$store.state.fire.myApp.user.name}}</div>
      <div>uid:{{$store.state.fire.myApp.user.uid}}</div>
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
    },
    logOut(){
      this.$store.dispatch('fire/logOut')
    }
  }
}
</script>
