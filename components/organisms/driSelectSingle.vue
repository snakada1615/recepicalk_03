<template>
  <b-container>
    <b-form-select
      :value="target[0].id"
      :options="options"
      @input="onChange"
      size="sm"
      class="mb-2">
    </b-form-select>
    <b-table
      striped
      small
      :items="total"
      :fields="fields1"
      :fixed=true
      head-row-variant="success"
      table-variant="light"
      v-bind="$attrs"
      class="totalDri"
    >
      <template #cell(Value)="data">
        <span class="text-info">{{ formatNumber(data.value, data.index) }}</span>
      </template>
    </b-table>
    KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie
  </b-container>
</template>

<script>
  /**
   * this component is a combination of dropdown menu and table linked together.
   *
   * table shows DRI information to match with items selected from dropdown menu
   *
   */
  import { setDigit } from "@/plugins/helper"

  export default {
    data() {
      return {
        fields1: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
        total: [],
      }
    },
    mounted() {
      // to reflect property on initial loading
      if (this.target.length > 0) {
        const id = this.target[0].id
        this.$emit('initTarget', this.setDRI(id))
      }
    },
    computed: {
      options: function () {
        let result = this.items.map(function (value) {
          return {
            'value': value.id,
            'text': value.Name
          }
        })
        result.push({
          'value': '',
          'text': 'Please select target beneficiary',
          disabled: true,
          selected: true,
        })
        return result
      },
    },
    props: {
      /**
       * value of selecetd item
       */
      //value: null,
      target:{
        type:Array,
        default:() => [{id: 0, count: 1}]
      },
      /**
       * list of DRI information
       */
      items: {
        type: Array,
        required: true
      }
    },
    methods: {
      formatNumber(val, index){
        if (index === 0){
          return val
        }
        if (index === 5){
          return val
        }
        return setDigit(val, index)
      },
      onChange:function(val){
        console.log('total is calculated')
        if (val >= 0) {
          this.total = [...this.setDRI(val)]
          // will not be implemented if called from 'mounted:{}'
            /**
             * triggers when dri selection changed
             */
            this.$emit('changeNutritionGroup', [{id: val, count:1}])
            /**
             * triggers when dri selection changed
             */
            this.$emit('changeNutritionValue', this.total)
        } else {
          console.error('invalid selection id for driTable: onChange-driTable')
        }
      },
      setDRI: function (selectedId) {
        const vm = this
        let tableItem = []
        //vm.selectedData.length = 0
        const dat = vm.items.filter(function (item) {
          return Number(item.id) === Number(selectedId)
        })
        if (dat.length !== 1) {
          return []
        } else {
          tableItem.push(
            {Item: 'target', Value: dat[0].Name},
            {Item: 'Energy', Value: dat[0].En},
            {Item: 'Protein', Value: dat[0].Pr},
            {Item: 'Vit_A', Value: dat[0].Va},
            {Item: 'Iron', Value: dat[0].Fe},
            {Item: 'id', Value: selectedId}
          )
          return tableItem
        }
      }
    }
  }
</script>
