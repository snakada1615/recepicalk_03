<template>
  <b-container>
    <b-button @click="register">register</b-button>
    <b-button @click="login">login</b-button>
    <b-button @click="logOut">logout</b-button>
    <b-row class="my-2">
      <b-col cols="11">
        <b-form-input v-model="user" placeholder="Enter username" :state="stateName"/>
      </b-col>
    </b-row>
    <b-row class="my-2">
      <b-col cols="11">
        <b-form-input v-model="pass" :type="typePass" placeholder="Enter password" :state="statePass"/>
      </b-col>
      <b-col cols="1" class="py-1 px-0">
        <p class="h5">
          <b-icon v-if="typePass==='password'" icon="eye" @click="togglePass"/>
          <b-icon v-if="typePass==='text'" icon="eyeSlash" @click="togglePass"/>
        </p>
      </b-col>
    </b-row>
    <b-card>
      <div>
        login:
        <span v-if="$store.state.fire.isLoggedIn" class="text-success">on</span>
        <span v-else class="text-danger">off</span>
      </div>
      <div>name:{{ $store.state.fire.myApp.user.name }}</div>
      <div>uid:{{ $store.state.fire.myApp.user.uid }}</div>
    </b-card>
  </b-container>
</template>
<script>
export default {
  data() {
    return {
      user: '',
      pass: '',
      typePass: 'password'
    }
  },
  computed:{
    stateName(){
      return (/^[\w]{3,30}?$/).test(this.user)
    },
    statePass(){
      return (this.pass.length >= 6 && this.pass.length <= 20)
    },
  },
  methods: {
    togglePass(){
      if(this.typePass==='text'){
        this.typePass='password'
      } else {
        this.typePass='text'
      }
    },
    async register() {
      await this.$store.dispatch('fire/registerEmail', {name: this.user, password: this.pass})
        .catch((err) => {
          console.log(err)
          if (err.message.indexOf('auth/internal-error')){
            this.user = ''
            this.pass = ''
          }
        })
    },
    async login() {
      await this.$store.dispatch('fire/loginEmail', {name: this.user, password: this.pass})
        .catch((err) => {
          console.log(err)
          if (err.message.indexOf('auth/internal-error')){
            this.user = ''
            this.pass = ''
          }
        })
    },
    google() {
      this.$store.dispatch('fire/loginGoogle')
    },
    anonymous() {
      this.$store.dispatch('fire/loginGuest')
    },
    logOut() {
      this.$store.dispatch('fire/logOut')
    }
  }
}
</script>
