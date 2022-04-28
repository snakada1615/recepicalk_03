// parent component
<template>
  <b-modal
    v-model="showComputed" static>
    Modal Content
    <b-table
      small
      striped
      head-row-variant="success"
      :items="items"
      :fields="fields"
    ></b-table>
  </b-modal>
</template>
<script>
export default {
  props: {
    show:{
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  computed: {
    showComputed: {
      get(){
        return this.show
      },
      set(val){
        this.$emit('update:show', val)
      }
    }
  },
  data(){
    return {
      fields: [
        {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Name', sortable: true, thStyle: {width: "290px"}},
        {key: 'Group', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'En', sortable: true, thStyle: {width: "50px"}},
        {key: 'Pr', sortable: true, thStyle: {width: "50px"}},
        {key: 'Va', sortable: true, thStyle: {width: "50px"}},
        {key: 'Fe', sortable: true, thStyle: {width: "50px"}},
      ],
    }
  }
}
</script>
