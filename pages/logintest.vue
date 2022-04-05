<template>
  <b-container>
    <b-button @click="register">register</b-button>
    <b-button @click="login">login</b-button>
    <b-button @click="logOut">logout</b-button>
    <b-form-input v-model="user" placeholder="Enter username"/>
    <b-form-input v-model="pass" placeholder="Enter password"/>
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
  data() {
    return {
      user:'',
      pass:''
    }
  },
  methods:{
    register(){
      this.$store.dispatch('fire/registerEmail', {name: this.user, password: this.pass});
    },
    login(){
      this.$store.dispatch('fire/loginEmail', {name: this.user, password: this.pass});
    },
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
