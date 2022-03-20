<template>
  <b-container>
    <b-table
      striped
      bordered
      head-row-variant="success"
      table-variant="light"
      :fixed=true
      :items="tableItems"
      :fields="fieldDRI"
      :sort-by.sync="sortBy"
      small
    >
      <template #cell(number)="data">
        <b-form-input
          v-model="data.item.number"
          :state="statusPopulationNumber(data.item.number)"
          @input="onPopulationChange"
          type="number"
          size="sm"
        ></b-form-input>
      </template>
    </b-table>
    <b-table
      striped
      bordered
      small
      :fixed=true
      head-row-variant="success"
      table-variant="light"
      :items="total"
      :fields="fieldTotal"
    >
      <template #cell(Value)="data">
        <span class="text-info">{{ formatNumber(data.value, data.index) }}</span>
      </template>
    </b-table>
    KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie
  </b-container>
</template>

<script>
  import {setDigit} from "@/plugins/helper"

  export default {
    data() {
      return {
        fieldDRI: [
          {key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Name', sortable: false},
          {key: 'number', sortable: false},
        ],
        sortBy: 'id',
        fieldTotal: [
          {key: 'Item', sortable: false},
          {key: 'Value', sortable: false},
        ],
        tableItems: [],
      }
    },
    props: {
      driPopulations: {
        type: Array,
        default: () => [{id: 0, count: 1}]
      },
      driItems: {
        type: Array,
        default: () => [],
      },
      max: {
        type: Number,
        default: 1000000,
      },
      inputName: '',
    },
    watch: {
      driPopulations: {
        deep: true,
        immediate: true,
        handler() {
          this.setTableItems()
        },
      }
    },
    computed: {
      total: function () {
        const vm = this
        let result = {}
        result.En = 0
        result.Pr = 0
        result.Va = 0
        result.Fe = 0
        this.tableItems.forEach(function (value) {
          result.En += Number(value.En) * Number(value.number)
          result.Pr += Number(value.Pr) * Number(value.number)
          result.Va += Number(value.Va) * Number(value.number)
          result.Fe += Number(value.Fe) * Number(value.number)
        })
        return [
          {Item: 'target', Value: 'mixed'},
          {Item: 'Energy', Value: result.En},
          {Item: 'Protein', Value: result.Pr},
          {Item: 'Vit_A', Value: result.Va},
          {Item: 'Iron', Value: result.Fe},
          {Item: 'id', Value: 0}
        ]
      },
    },
    mounted() {
      // send initial value of 'total'
      this.$emit('initTarget', this.total)
    },
    methods: {
      formatNumber(val, index) {
        if (index === 0) {
          return 'mixed'
        }
        if (index === 5) {
          return val
        }
        return setDigit(val, index)
      },
      statusPopulationNumber(val) {
        return (val >= 0 && val <= this.max)
      },
      setTableItems() {
        this.tableItems.length = 0
        this.tableItems = JSON.parse(JSON.stringify(
          this.updateTable(this.driItems, this.driPopulations)
        ))
      },
      updateTable(driValue, selectedValue) {
        return driValue.map(function (driItem) {
          const res = selectedValue.filter(
            item => Number(item.id) === Number(driItem.id)
          )
          driItem.number = res.length ? res[0].count : 0
          return driItem
        })
      },
      onPopulationChange(val) {
        /**
         * triggers when dri selection changed
         */
        const res = this.tableItems.map(function (item) {
          return {
            id: item.id,
            count: Number(item.number),
          }
        })
        this.$emit('changeNutritionGroup', res)
        /**
         * triggers when dri selection changed
         */
        this.$emit('changeNutritionValue', this.total)
      },
    }
  }
</script>
