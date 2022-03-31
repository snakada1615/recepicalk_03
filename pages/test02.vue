<template>
  <div class="page">
    <label>
     <span>
       id:
     </span>
      <input
        type="text"
        v-model="user.id"
      >
    </label>
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
      @click="insertData"
    >
      Submit
    </button>
    <button
      type="button"
      @click="getData"
    >
      Get
    </button>
    <button
      type="button"
      @click="removeData"
    >
      Delete
    </button>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'
import { getDatabase, ref, child, set, get, remove } from 'firebase/database'

export default {
  data () {
    return {
      user: {
        id: "",
        name: "",
        email: ""
      },
      db:'',
    }
  },
  mounted:function (){
    this.db = getDatabase()
  },
  methods: {
    async insertData(){
      await set(ref(this.db, "userList/"+this.user.id),{
        name: this.user.name,
        email: this.user.email
      }).catch(error => {throw error})
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async removeData(){
      await remove(ref(this.db, "userList/"+this.user.id),{
      }).catch(error => {
        alert('id does not match')
        throw error
      })
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async getData(){
      const dbRef = ref(this.db)
      const dat = await get(child(dbRef, "userList/"+this.user.id))
      if (dat.exists()) {
        this.user.name = dat.val().name
        this.user.email = dat.val().email
      } else {
        this.user.id = ''
        this.user.name = ''
        this.user.email = ''
        alert('id does not match')
      }
    }
  },
}
</script>
