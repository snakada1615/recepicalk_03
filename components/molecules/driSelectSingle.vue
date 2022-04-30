<template>
  <b-container>
    <b-form-select
      class="jest_select mb-2"
      v-model="targetGroup"
      :options="options"
      @change="onSelectionChange"
      size="sm"
      >
      <template #first>
        <b-form-select-option value=0 disabled>-- Please select an option --</b-form-select-option>
      </template>
    </b-form-select>
    <b-table
      class="jest_table totalDri"
      striped
      small
      :items="tableDri"
      :fields="fields1"
      :fixed=true
      head-row-variant="success"
      table-variant="light"
      v-bind="$attrs"
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
        targetGroup:0,
        tableDri:[]
      }
    },
    computed: {
      options: function () {
        let result = this.driItems.map(function (value) {
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
        required: true,
        //default:() => [{id: 0, count: 1}]
      },
      /**
       * list of DRI information
       */
      driItems: {
        type: Array,
        required: true
      }
    },
    watch: {
      target: {
        deep: true,
        immediate: true,
        handler() {
          this.updateAllTable()
        },
      }
    },
    created() {
      this.updateAllTable()
    },
    methods: {
      /**
       * targetプロパティの更新時に内部変数 (targetGroup, tablePop,
       *     tableDri)を更新
       */
      updateAllTable() {
        //targetが更新されたら、あわせてtargetGroupを更新する
        //適正なデータがなければ0を返す
        if (this.target == null || this.target.length === 0){
          throw new Error('driSelectSingle.updateAllTable: target data is invalid')
        }
        //1名以上の人数が記されているグループのidを抽出
        const res = this.target.filter(function (dat){
          return dat.count > 0
        })

        //全てのグループの人数が0名なら0を返す
        //人数1名以上の最初のグループをリストで選択されたターゲットとする
        if (res.length === 0){
          this.targetGroup = 0
        } else {
          this.targetGroup = Number(res[0].id)
        }

        //tablePop（各グループごとのtarget人数）をセット
        const tablePop = JSON.parse(JSON.stringify(
          this.updateTablePop(this.driItems, this.targetGroup)
        ))
        //tablePopの数字を使って栄養素の合計必要量の更新
        this.tableDri.length = 0
        this.tableDri = JSON.parse(JSON.stringify(
          this.updateTableDri(tablePop)
        ))
        //DOM表示用にtableDriのデータ構造を整形
        const res1 = {}
        this.tableDri.forEach(function (val){
          res1[val.Item] = val.Value
        })
        //emit用のデータ整形
        const res2 = {
          En: Number(res1.Energy),
          Pr: Number(res1.Protein),
          Va: Number(res1.Vit_A),
          Fe: Number(res1.Iron),
        }
        /**
         * 必要栄養量の更新を親コンポーネントに通知
         */
        this.$emit('changeNutritionValue', {total: res2, target: this.target})
      },
      /**
       * DRIのテーブル（合計値）を更新
       * @param dat 年齢別の栄養素必要量＊人数のテーブル
       * @returns
       *     {[{Item: string, Value: string},
       *     {Item: string, Value: (number|*|number)},
       *     {Item: string, Value: (number|*|number)},
       *     {Item: string, Value: (number|*|number)},
       *     {Item: string, Value: (number|*|number)},
       *     null]}
       *     合計値のテーブル
       */
      updateTableDri(dat){
        let result = {}
        result.Name = ''
        result.En = 0
        result.Pr = 0
        result.Va = 0
        result.Fe = 0
        dat.forEach(function (value) {
          result.En += Number(value.En) * Number(value.number)
          result.Pr += Number(value.Pr) * Number(value.number)
          result.Va += Number(value.Va) * Number(value.number)
          result.Fe += Number(value.Fe) * Number(value.number)
          if (Number(value.number) === 1) {
            result.Name = value.Name
            result.id = value.id
          }
        })
        return [
          {Item: 'target', Value: result.Name},
          {Item: 'Energy', Value: result.En},
          {Item: 'Protein', Value: result.Pr},
          {Item: 'Vit_A', Value: result.Va},
          {Item: 'Iron', Value: result.Fe},
          {Item: 'id', Value: 0}
        ]
      },
      /**
       * DRIの一覧表（年齢別・性別）に各グループの人数を追加して戻す
       * @param driValue DRIの一覧表
       * @param targetValue 選ばれたグループのid
       * @returns {*} DRIの一覧表×対象人数
       */
      updateTablePop(driValue, targetValue) {
        return driValue.map(function (driItem) {
          if (Number(driItem.id) === Number(targetValue)) {
            driItem.number = 1
          } else {
            driItem.number = 0
          }
          return driItem
        })
      },
      /**
       * ユーザーが対象グループを変更した際にトリガー
       * ユーザー選択の値（Number）をもとにtarget値（Object）を
       *     更新してemitする
       * @param val
       */
      onSelectionChange(val){
        console.log('driSelectSingle:onChange:' + val)
        const res = this.driItems.map(function(dat){
          let count = 0
          if (Number(dat.id) === Number(val)){
            count = 1
          }
          return {id: dat.id, count: count}
        })
        this.$emit('update:target', res)
      },
      /**
       * 表示用の整形（１列目と６列目を除いて桁数設定)
       * @param val
       * @param index
       * @returns {string|*}
       */
      formatNumber(val, index){
        if (index === 0){
          return val
        }
        if (index === 5){
          return val
        }
        return setDigit(val, index)
      },
    }
  }
</script>
