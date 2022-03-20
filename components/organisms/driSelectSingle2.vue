<template>
  <b-container>
    <b-form-select
      v-model="targetComp"
      :options="options"
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
      }
    },
    computed: {
      targetComp:{
        get(){
          if (this.target == null){
            return null
          }
          return this.target[0].id
        },
        set(val){
          this.$emit('update:target', [{id: val, count:1}])
        }
      },
      total:function () {
        if (this.target == null){
          return null
        }
        const res1 = [...this.setDRI(this.target[0].id)]
        const res2 = this.target
        //値に変化があった場合にまとめてemit
        this.$emit('changeNutritionValue', {total: res1, target:res2})
        return res1
      },
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
