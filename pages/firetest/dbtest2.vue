<template>
  <b-container>
    halo
    <b-form-input v-model="name" placeholder="add name" class="my-2"></b-form-input>
    <b-form-input v-model="age" type="number" placeholder="add age" class="my-2"></b-form-input>
    <b-card class="my-2">
      <div>name: {{name}}</div>
      <div>age: {{age}}</div>
    </b-card>
    <b-button variant="info" @click="insertData" class="my-2">add</b-button>
  </b-container>
</template>

<script>
import {firestoreDb} from "~/plugins/firebasePlugin";
import {addDoc, collection} from "firebase/firestore";

export default {
  data() {
    return {
      name:'',
      age:0
    }
  },
  methods:{
    async insertData() {
      const ref = collection(firestoreDb, "test")
      const age = this.age
      const name = this.name
      this.age= 0
      this.name= ''
      await addDoc(ref, {
        age: age,
        name: name,
      }).catch(error => {
        throw error
      })
      console.log({name: name, age:age})
    },
  }
}

</script>
