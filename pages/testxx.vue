<template>
  <b-container>
    <region-select
      :key3.sync="key3"
      :key2.sync="key2"
      :key1.sync="key1"
      :file-name="fileName"/>
  </b-container>
</template>

<script>
import regionSelect from "@/components/atoms/regionSelect";

export default {
  components: {
    regionSelect
  },
  data() {
    return {
      key1:'',
      key2:'',
      key3:'',
      fileName: '../dbs/eth_region.csv',
      /**
       * csvファイルから読み込んだデータ本体
       */
      dataCsv: '',
    }
  },
  methods: {
  }
}
</script>
