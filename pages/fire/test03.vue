<template>
  <b-container>
    <b-input v-model="dbName" placeholder="Enter DB name"/>
    <b-input v-model="keyCol" placeholder="Enter key column"/>
    <csv-import :show-data="false" @getCsv="data=$event"></csv-import>
    <b-button @click="insertData">import to firebase</b-button>
    <b-button @click="getData">show data from firebase</b-button>
    <b-card>
      {{dataJson}}
    </b-card>
    <b-card>
      {{myData}}
    </b-card>
  </b-container>
</template>

<script>
import csvImport from "@/components/organisms/csvImport";
import { getDatabase, ref, child, set, get } from 'firebase/database'

export default {
  components: {
    csvImport
  },
  mounted:function (){
    this.db = getDatabase()
  },
  data() {
    return {
      data:'',
      db:'',
      dbName:'',
      keyCol:'id',
      myData:''
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
      await set(ref(this.db, "shun/dataset/"+this.dbName),
        vm.dataJson
      ).catch(error => {throw error})
    },
    async getData(){
      const dbRef = ref(this.db)
      const dat = await get(child(dbRef, "shun/dataset"))
      if (dat.exists()) {
        this.myData = dat
      } else {
        alert('id does not match')
      }
    }
  }
}
</script>
