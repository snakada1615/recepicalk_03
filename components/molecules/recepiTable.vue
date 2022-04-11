<template>
  <b-container class="my-0 px-0">
    <div>
      <b-table
        striped
        bordered
        small
        ref="table"
        :items="items"
        :fields="fields"
        @input="onInput"
        @row-clicked="rowClick"
        foot-clone
        no-footer-sorting
        v-bind="$attrs">

        <!-- A custom formatted footer cell for field 'name' -->
        <template #cell(Name)="data">
          <span class="text-info">{{ data.value }}</span>
          <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="delClick(data.index)">
            <b-badge variant="gray-400" class="px-0 py-0">
              <b-icon icon="X"></b-icon>
            </b-badge>
          </b-button>
        </template>
        <template #foot(Name)="data">
          <span>total</span>
        </template>
        <template #foot(En)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.En),3) }}</span>
        </template>
        <template #foot(Pr)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.Pr),0) }}</span>
        </template>
        <template #foot(Va)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.Va),1) }}</span>
        </template>
        <template #foot(Fe)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.Fe),2) }}</span>
        </template>
        <template #foot(Wt)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.Wt),0) }}</span>
        </template>

        <!-- A custom formatted cell for field 'name' -->
        <template #cell(En)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 3) }}</span>
        </template>
        <template #cell(Pr)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 0) }}</span>
        </template>
        <template #cell(Va)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 1) }}</span>
        </template>
        <template #cell(Fe)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 2) }}</span>
        </template>
        <template #cell(Wt)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 0) }}</span>
        </template>
      </b-table>
      KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie
    </div>
  </b-container>
</template>

<script>

  export default {
    props: {
      items: {
        type: Array,
        default: () => [
          {id: "1", Group: "grain", Name: "taro", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196"},
          {id: "2", Group: "meat", Name: "pork", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208"}
        ],
      },
      FoodGrp: {
        type: Array,
        default: () => [
          {name: 'Grains, roots and tubers'},
          {name: 'Legumes and nuts'},
          {name: 'Vitamin A rich fruits and Vegetable'},
          {name: 'Other fruits and vegetables'},
          {name: 'Flesh foods'},
          {name: 'Dairy products'},
          {name: 'Eggs'},
          {name: 'non-category'}
        ],
      }
    },
    watch: {
      items: {
        immediate: true,
        handler(value) {
          if (value.length === 0){
            this.nutritionSum = {
              En: 0,
              Pr: 0,
              Va: 0,
              Fe: 0,
              Wt: 0,
            }
          } else {
            this.nutritionSum = {...this.updateSum(value)}
          }
        }
      }
    },
    data() {
      return {
        nutritionSum: {},
        showNutritionSum: {},
        fields: [
          {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Name', sortable: true},
          {key: 'En', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {key: 'Pr', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {key: 'Va', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {key: 'Fe', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {key: 'Wt', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        ],
      }
    },
    methods: {
      setDigit(item, unitKey) {
        let res = ''
        const units = [
          {1:' g', 2:' kg', 3:' t'},
          {1:' µg', 2:' mg', 3:' g'},
          {1:' mg', 2:' g', 3:' kt'},
          {1:' KC', 2:' MC', 3:' GC'},
        ]
        switch (true) {
          case (item < 1000):
            res = String(Math.round(item)) + units[unitKey]["1"]
            break;
          case (item >= 1000 && item < 1000000):
            res = String(Math.round(item / 1000)) + units[unitKey]["2"]
            break;
          case (item >= 1000000):
            res = String(Math.round(item / 1000000)) + units[unitKey]["3"]
            break;
          default:
            console.error('parameter not valid:setDigit')
            res = ''
            break;
        }
        return res
      },
      updateSum(array) {
        return array.reduce((accumulator, item) => {
          accumulator.En = (accumulator.En || 0) + Number(item.En)
          accumulator.Pr = (accumulator.Pr || 0) + Number(item.Pr)
          accumulator.Va = (accumulator.Va || 0) + Number(item.Va)
          accumulator.Fe = (accumulator.Fe || 0) + Number(item.Fe)
          accumulator.Wt = (accumulator.Wt || 0) + Number(item.Wt)
          return accumulator
        }, {})
      },
      onInput() {
        this.$emit('totalChanged', this.nutritionSum)
      },
      rowClick(record) {
        this.$emit('rowClick', record)
      },
      delClick(id) {
        let res = []
        this.items.forEach(function (val, index) {
          if (index !== id) {
            res.push(val)
          }
        })
        this.$emit('update:items', res)
      },
    }
  }
</script>
