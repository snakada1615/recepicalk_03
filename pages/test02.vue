<template>
  <b-container>
    <form>
      <input type="file" @change="readfile" />
    </form>
    <div v-html="computedData"></div>
  </b-container>

</template>
<script>
import { marked } from 'marked'
export default {
  name: 'App',
  data(){
    return {
      markdown:  "# Hello World",
      data:''
    };
  },
  computed: {
    computedData(){
      return marked(this.data)
    }
  },
  methods:{
    readfile: function(e) {
      const vm = this
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = function() {
        vm.data = reader.result
      }
      reader.readAsText( file )
    }
  }
}
</script>
<style scoped src="@/assets/css/modest.css">
</style>
