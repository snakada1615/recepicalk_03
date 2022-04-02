<template>
  <b-container>
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
        class="px-2 py-2"
      >
        Submit
      </button>
      <button
        type="button"
        @click="insertDataCustomId"
        class="px-2 py-2"
      >
        SubmitId
      </button>
      <button
        type="button"
        @click="updateData"
        class="px-2 py-2"
      >
        update
      </button>
      <button
        type="button"
        @click="getData"
        class="px-2 py-2"
      >
        Get
      </button>
      <button
        type="button"
        @click="removeData"
        class="px-2 py-2"
      >
        Delete
      </button>
    </div>
  </b-container>
</template>

<script>
import {
  getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc
} from 'firebase/firestore'

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
    this.db = getFirestore()
  },
  methods: {
    async insertData(){
      const ref = collection(this.db, "myMember")
      await addDoc(ref, {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email
      }).catch(error => {throw error})
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async insertDataCustomId(){
      const ref = doc(this.db, "myMember", this.user.id)
      await setDoc(ref, {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email
      }).catch(error => {throw error})
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async updateData(){
      const ref = doc(this.db, "myMember", this.user.id)
      await updateDoc(ref, {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email
      }).catch(error => {throw error})
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async removeData(){
      const ref = doc(this.db, "myMember", this.user.id)
      const docSnap = await getDoc(ref)
      if (docSnap.exists()) {
        await deleteDoc(ref)
      } else {
        alert('id does not match')
      }
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async getData(){
      const ref = doc(this.db, "myMember", this.user.id)
      const docSnap = await getDoc(ref)
      if (docSnap.exists()) {
        this.user.name = docSnap.data().name
        this.user.email = docSnap.data().email
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
