<template>
  <b-container class="my-0 px-0">
    <div>
      <b-table
        striped
        bordered
        small
        ref="table"
        :items="itemWeighted"
        :fields="fields"
        @input="onInput"
        @row-clicked="rowClick"
        foot-clone
        no-footer-sorting
        v-bind="$attrs">

        <!-- A custom formatted footer cell for field 'name' -->
        <template #head(menuName)="data">
          <span>Menu</span>
        </template>
        <template #foot(menuName)="data">
          <span>Menu</span>
        </template>
        <!-- A custom formatted footer cell for field 'name' -->
        <template #head(Name)="data">
          <span>ingredients</span>
        </template>
        <template #foot(Name)="data">
          <span>total</span>
        </template>
        <!-- A custom formatted footer cell for field 'En' -->
        <template #foot(En)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.En), 3) }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Pr' -->
        <template #foot(Pr)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.Pr), 0) }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Va' -->
        <template #foot(Va)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.Va), 1) }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Fe' -->
        <template #foot(Fe)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.Fe), 2) }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Wt' -->
        <template #foot(Wt)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(nutritionSum.Wt), 0) }}</span>
        </template>

        <!-- A custom formatted cell for field 'name' -->
        <template #cell(Name)="data">
          <span class="text-info pointer" style="font-size: small">{{ data.value }}</span>
          <b-button class="px-0 py-0 mx-0 my-0" variant="light" @click="delClick(data.index)">
            <b-badge variant="gray-400" class="px-0 py-0">
              <b-icon icon="X"></b-icon>
            </b-badge>
          </b-button>
        </template>
        <!-- A custom formatted cell for field 'menuName' -->
        <template #cell(menuName)="data">
          <span class="text-info" style="font-size: small">{{ data.value }}</span>
        </template>
        <!-- A custom formatted cell for field 'En' -->
        <template #cell(En)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 3) }}</span>
        </template>
        <!-- A custom formatted cell for field 'Pr' -->
        <template #cell(Pr)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 0) }}</span>
        </template>
        <!-- A custom formatted cell for field 'Va' -->
        <template #cell(Va)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 1) }}</span>
        </template>
        <!-- A custom formatted cell for field 'Fe' -->
        <template #cell(Fe)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 2) }}</span>
        </template>
        <!-- A custom formatted cell for field 'Wt' -->
        <template #cell(Wt)="data">
          <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 0) }}</span>
        </template>
      </b-table>
      KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie
    </div>
  </b-container>
</template>

<script>
/**
 * @desc 選択された品目一覧を表示するテーブル
 * 横幅がタブレット以上の場合には料理名を表示、スマホの場合は材料名のみ表示
 */

export default {
  props: {
    /**
     * 食品名及び栄養成分の一覧を含む配列
     */
    items: {
      type: Array,
      required: true,
    },
  },
  watch: {
    items: {
      immediate: true,
      handler(value) {
        if (value.length === 0) {
          this.nutritionSum = {
            En: 0,
            Pr: 0,
            Va: 0,
            Fe: 0,
            Wt: 0,
          }
        } else {
          this.itemWeighted = this.updateItemWeight(value)
          console.log(this.itemWeighted)
          this.nutritionSum = {...this.updateSum(this.itemWeighted)}
        }
      }
    }
  },
  data() {
    return {
      /**
       * itemに含まれる全ての作物の栄養成分の合計値
       */
      nutritionSum: {},
      /**
       * itemの各要素にweightを掛け合わせたもの
       */
      itemWeighted: [],
      /**
       * テーブルのフィールド毎の書式設定
       */
      fields: [
        {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'menuName', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
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
    /**
     * 各栄養素の値の表示用に、桁数を調整
     * @param item
     * @param unitKey
     * @returns {string}
     */
    setDigit(item, unitKey) {
      let res = ''
      const units = [
        {1: ' g', 2: ' kg', 3: ' t'},
        {1: ' µg', 2: ' mg', 3: ' g'},
        {1: ' mg', 2: ' g', 3: ' kt'},
        {1: ' KC', 2: ' MC', 3: ' GC'},
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
          console.error('parameter not valid:setDigit:' + item)
          res = ''
          break;
      }
      return res
    },
    /**
     * itemの各要素の値から合計値を計算
     * @param array
     * @returns {*}
     */
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
    /**
     * itemの各要素の値に重量を掛け合わせる
     * @param array
     */
    updateItemWeight(array) {
      return array.map((val) => {
        return {
          id: val.id,
          Group: val.Group,
          menuName: val.menuName,
          Name: val.Name,
          En: val.En * val.Wt,
          Pr: val.Pr * val.Wt,
          Va: val.Va * val.Wt,
          Fe: val.Fe * val.Wt,
          Wt: val.Wt
        }
      })
    },
    /**
     * itemの構成が変わるたびに、合計値をemit
     */
    onInput() {
      this.$emit('totalChanged', this.nutritionSum)
    },
    /**
     * テーブルの特定行がクリックされた場合、当該行の内容をemit
     * @param record
     */
    rowClick(record) {
      this.$emit('rowClick', record)
    },
    /**
     * 特定行の×ボタンをクリックした場合に、当該行を削除
     * @param id
     */
    delClick(id) {
      let res = []
      this.items.forEach(function (val, index) {
        if (index !== id) {
          res.push(val)
        }
      })
      this.$emit('itemDeleted', res)
    },
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
