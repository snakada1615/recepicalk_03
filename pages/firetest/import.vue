<template>
  <b-container>
    <b-input v-model="collection" placeholder="Enter collection name" class="my-1"/>
    <b-input v-model="dbName" placeholder="Enter doc name" class="my-1"/>
    <b-input v-model="keyCol" placeholder="Enter key column" class="my-1"/>
    <csv-import :show-data="false" @getCsv="data=$event" class="my-1"></csv-import>
    <b-button @click="insertData" class="my-1">import to firebase</b-button>
    <b-button @click="getData" class="my-1">show data from firebase</b-button>
    <b-card>
      {{dataJson}}
    </b-card>
    <b-card>
      {{myData}}
    </b-card>
  </b-container>
</template>

<script>
import csvImport from "@/components/molecules/csvImport";
import {firestoreDb} from "~/plugins/firebasePlugin";
import {doc, getDoc, setDoc} from "firebase/firestore";

export default {
  components: {
    csvImport
  },
  data() {
    return {
      data:'',
      db:'',
      dbName:'',
      keyCol:'id',
      myData:'',
      collection:"dataset"
    }
  },
  computed:{
    dataJson:function () {
      if (this.data.length === 0) { return }
      const res = {}
      this.data.forEach((val)=>{
        const myKey = val[this.keyCol]
        if (myKey !== ""){
          res[myKey] = val
        }
      })
      return res
    }
  },
  methods: {
    async insertData(){
      if (this.dbName === '' || this.data.length === 0){ return }
      const vm = this
      const ref = doc(firestoreDb, vm.collection, vm.dbName)
      await setDoc(ref,
        vm.dataJson
      ).catch(error => {
        throw error
      }).then(()=>{
        console.log("import complete: "+this.dbName)
      })
    },
    async getData(){
      const ref = await doc(firestoreDb, this.collection, this.dbName)
      await getDoc(ref).then((doc) => {
        if (doc.exists()) {
          this.myData = doc.data()
        } else {
          alert('id does not match')
        }
      })
    }
  }
}
</script>
