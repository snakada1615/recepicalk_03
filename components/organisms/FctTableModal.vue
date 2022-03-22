<template>
  <b-modal
    :id="myName"
    :title="myModalHeader"
    @ok="clickOk"
    @cancel="clickCancel"
    hide-header
  >
    <fct-table
      :items="items"
      head-row-variant="success"
      table-variant="light"
      @fctClick="onFCTclick"
    ></fct-table>
  </b-modal>
</template>

<script>
  import FctTable from "@/components/organisms/FctTable"

  export default {
    components: {
      FctTable
    },
    props:{
      myName: {
        type: String,
        required: true,
      },
      myModalHeader: {
        type: String,
      },
      items:{
        type:Array,
      },
    },
    data(){
      return {
        selectedItem: '',
      }
    },
    methods: {
      onFCTclick(rec){
        this.selectedItem = rec
        this.$emit('click', rec)
      },
      // ...
      clickOk() {
        console.log('OK')
        this.$emit('modalOk', this.selectedItem)
      },
      clickCancel() {
        console.log('Cancel')
      },
    }
  }

</script>
