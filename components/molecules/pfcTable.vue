<template>
  <b-container class="my-0 px-0">
    <div>
      <b-table
        striped
        bordered
        small
        sticky-header
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
        <!-- A custom formatted footer cell for field 'Pr' -->
        <template #foot(Pr)="data">
          <span class="text-info" style="font-size: small">{{ myFormat(nutritionSum.Pr, 1) }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Fat' -->
        <template #foot(Fat)="data">
          <span class="text-info" style="font-size: small">{{ myFormat(nutritionSum.Fat, 1) }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Fe' -->
        <template #foot(Carbo)="data">
          <span class="text-info" style="font-size: small">{{ myFormat(nutritionSum.Carbo, 1) }}</span>
        </template>
        <!-- A custom formatted footer cell for field 'Wt' -->
        <template #foot(Wt)="data">
          <span class="text-info" style="font-size: small">{{ myFormat(nutritionSum.Wt, 2) }}</span>
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
        <!-- A custom formatted cell for field 'Pr' -->
        <template #cell(Pr)="data">
          <span class="text-info" style="font-size: small">{{ myFormat(data.value, 1)}}</span>
        </template>
        <!-- A custom formatted cell for field 'Fat' -->
        <template #cell(Fat)="data">
          <span class="text-info" style="font-size: small">{{ myFormat(data.value, 1) }}</span>
        </template>
        <!-- A custom formatted cell for field 'Carbo' -->
        <template #cell(Carbo)="data">
          <span class="text-info" style="font-size: small">{{ myFormat(data.value, 1) }}</span>
        </template>
        <!-- A custom formatted cell for field 'Wt' -->
        <template #cell(Wt)="data">
          <span class="text-info" style="font-size: small">{{ myFormat(data.value, 2) }}</span>
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

import {setDigit} from "../../plugins/helper";

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
      deep: true,
      handler(value) {
        if (value.length === 0) {
          this.nutritionSum = {
            Pr: 0,
            Fat: 0,
            Carbo: 0,
            Wt: 0,
          }
          this.itemWeighted.splice(0, this.itemWeighted.length)
        } else {
          this.itemWeighted = this.updateItemWeight(value)
          this.nutritionSum = {...this.updateSum(this.itemWeighted)}
        }
      }
    }
  },
  data() {
    return {
      /**
       * itemに含まれる全ての作物のPFCの合計値(カロリー)
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
        {key: 'Pr', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        {key: 'Fat', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        {key: 'Carbo', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        {key: 'Wt', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
      ],
    }
  },
  methods: {
    myFormat(val, index){
      return setDigit(Number(val), index)
    },
    /**
     * itemの各要素の値から合計値を計算
     * @param array
     * @returns {*}
     */
    updateSum(array) {
      return array.reduce((accumulator, item) => {
        accumulator.Pr = (accumulator.Pr || 0) + Number(item.Pr ? item.Pr : 0)
        accumulator.Fat = (accumulator.Fat || 0) + Number(item.Fat ? item.Fat : 0)
        accumulator.Carbo = (accumulator.Carbo || 0) + Number(item.Carbo ? item.Carbo : 0)
        accumulator.Wt = (accumulator.Wt || 0) + Number(item.Wt ? item.Wt : 0)
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
          Pr: Math.round(val.Pr * val.Wt * 4),
          Fat: Math.round(val.Fat * val.Wt * 9),
          Carbo: Math.round(val.Carbohydrate * val.Wt * 4),
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
