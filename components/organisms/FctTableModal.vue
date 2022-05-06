<template>
  <b-modal
    v-model="showModalComputed"
    :id="myName"
    :title="myModalHeader"
    static
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
        required: true
      },
      items:{
        type:Array,
        required: true
      },
      /**
       * モーダルの表示用トリガー
       */
      showModal:{
        type: Boolean,
        default: false,
        required: true
      }
    },
    computed: {
      showModalComputed: {
        get(){
          return this.showModal
        },
        set(val){
          this.$emit('update:showModal', val)
        }
      }
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
