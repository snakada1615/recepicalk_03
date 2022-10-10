<template>
  <b-container>
    <pfc-table :items="crops"/>
  </b-container>
</template>
<script>
import pfcTable from "../components/molecules/pfcTable";

export default {
  components: {
    pfcTable
  },
  data() {
    return {
      crops: [
        {id:"1", Group: "legume", Name: "edamame", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196", menuName: "otusmami"},
        {id:"1", Group: "grain", Name: "taro", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196", menuName: "Curry"},
        {id:"2", Group: "meat", Name: "pork", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208", menuName: "Oyako-don"}
      ]
    }
  },

}
</script>
