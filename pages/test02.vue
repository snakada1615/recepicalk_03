<template>
  <div class="page">
    <label>
     <span>
       お名前:
     </span>
      <input
        type="text"
        v-model="user.name"
      >
    </label>
    <label>
     <span>
       email:
     </span>
      <input
        type="text"
        v-model="user.email"
      >
    </label>
    <button
      type="button"
      @click="submit"
    >
      Submit
    </button>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data () {
    return {
      user: {
        name: "",
        email: ""
      },
    }
  },
  methods: {
    submit () {
      let Ref = firebase.database().ref()
      Ref.push({ name: this.user.name, body: this.user.email })
        .then(response => {
          console.log(response, this.user)
        })
    },
  },
}
</script>
