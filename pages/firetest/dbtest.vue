<template>
  <b-container>
    <network-toggle/>
    <b-form-input v-model="user.id" placeholder="Enter ID" class="my-1"/>
    <b-form-input v-model="user.name" placeholder="Enter 名前" class="my-1"/>
    <b-form-input v-model="user.email" placeholder="Enter email" class="my-1"/>
    <b-button @click="insertDataCustomId" variant="info" class="px-2 py-2">Add</b-button>
    <b-button @click="updateData" variant="info" class="px-2 py-2">Update</b-button>
    <b-button @click="getData" variant="info" class="px-2 py-2">Get</b-button>
    <b-button @click="removeData" variant="info" class="px-2 py-2">Remove</b-button>
  </b-container>
</template>

<script>
import {
  doc, getDoc, setDoc, collection, getDocFromCache,
  addDoc, updateDoc, deleteDoc,
  getDocFromServer
} from 'firebase/firestore'
import networkToggle from "@/components/organisms/networkToggle";
import {firestoreDb} from "~/plugins/firebasePlugin";

export default {
  components: {
    networkToggle
  },
  data() {
    return {
      user: {
        id: "",
        name: "",
        email: ""
      },
      db: '',
    }
  },
  methods: {
    async insertData() {
      const ref = collection(firestoreDb, "myMember")
      await addDoc(ref, {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email
      }).catch(error => {
        throw error
      })
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async insertDataCustomId() {
      const ref = doc(firestoreDb, "myMember", this.user.id)
      if ($nuxt.isOnline) {
        await setDoc(ref, {
          id: this.user.id,
          name: this.user.name,
          email: this.user.email
        }).catch(error => {
          throw error
        })
      } else {
        setDoc(ref, {
          id: this.user.id,
          name: this.user.name,
          email: this.user.email
        }).catch(error => {
          throw error
        })
      }
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async updateData() {
      const ref = doc(firestoreDb, "myMember", this.user.id)
      if ($nuxt.isOnline) {
        await updateDoc(ref, {
          id: this.user.id,
          name: this.user.name,
          email: this.user.email
        }).catch(error => {
          throw error
        })
      } else {
        updateDoc(ref, {
          id: this.user.id,
          name: this.user.name,
          email: this.user.email
        }).catch(error => {
          throw error
        })
      }
      this.user.id = ''
      this.user.name = ''
      this.user.email = ''
    },
    async removeData() {
      const ref = doc(firestoreDb, "myMember", this.user.id)
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
    async getData() {
      const ref = await doc(firestoreDb, "myMember", this.user.id)
      await getDocFromCache(ref).then((doc) => {
        if (doc.exists()) {
          console.log('getData from cache')
          this.user.name = doc.data().name
          this.user.email = doc.data().email
        } else {
          this.user.id = ''
          this.user.name = ''
          this.user.email = ''
          alert('id does not match')
        }
      }).catch(async () => {
        await getDocFromServer(ref).then((doc) => {
          if (doc.exists()) {
            console.log('getData from server')
            this.user.name = doc.data().name
            this.user.email = doc.data().email
          } else {
            this.user.id = ''
            this.user.name = ''
            this.user.email = ''
            alert('id does not match')
          }
        })
      })
    }
  },
}
</script>
