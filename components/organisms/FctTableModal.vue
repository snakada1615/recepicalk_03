<template>
  <b-modal
    :id="myName"
    :title="myModalHeader"
    :static="true"
    @ok="clickOk"
    @cancel="clickCancel"
    hide-header
  >
    <fct-table
      :items="items"
      head-row-variant="success"
      table-variant="light"
      @fctClick="onFctClick"
    ></fct-table>
  </b-modal>
</template>

<script>
  import FctTable from "@/components/molecules/FctTable"

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
      onFctClick(rec){
        this.selectedItem = rec
        this.$emit('click', rec)
      },
      // ...
      clickOk() {
        this.$emit('modalOk', this.selectedItem)
      },
      clickCancel() {
        console.log('Cancel')
      },
    }
  }

</script>
