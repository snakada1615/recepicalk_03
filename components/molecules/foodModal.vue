<template>
  <b-modal
    v-model="showModalComputed"
    :id="myName"
    :title="myModalHeader"
    :ok-disabled = "!menuNameState"
    @ok="clickOk"
    @cancel="clickCancel"
    hide-header
    static
  >
    <b-input-group prepend="name of dish" size="sm">
      <b-input
        :value="menuName"
        @input="$emit('update:menuName', $event)"
        :state="menuNameState"
        placeholder="name of the dish"
      />
    </b-input-group>
    <b-table
      small
      striped
      selectable
      select-mode="single"
      head-row-variant="success"
      :items="items"
      :fields="fields"
    ></b-table>
    <b-input-group prepend="quantity" size="sm">
      <b-form-input
        v-model="portionValue"
        type="number"
        :state="inputState"
        :disabled="!selected"
      ></b-form-input>
      <template #append>
        <!-- portionList配列からcount_methodを抽出して計量方法を選択 -->
        <b-form-select
          v-model="selected"
          :options="portionList.map((item)=>{return item.count_method})"
          size="sm"
        />
      </template>
    </b-input-group>
    <div class="text-info">(={{ setDigit(value, 0) }})</div>
  </b-modal>
</template>

<script>

export default {
  /**
   * foodModal
   *     fctTableから行の値を受け取ってmodalに表示する
   *     ユーザーが入力したweight値をOkクリック時にemit
   */
  props: {
    /**
     * modalに表示するデータarray of object、
     *     構造は以下
     *     [{
     *     En: "315",
     *     Fe: "1.9",
     *     Pr: "3.4",
     *     Va: "",
     *     Name: "Yam tuber, flour",
     *     Group: "Grains, roots and tubers",
     *     id:"5221"
     *     }]
     */
    items: {
      type: Array,
      required: true,
    },
    portionUnits: {
      type: Array,
      required: true,
    },
    /**
     * itemに対応したweightの値
     */
    value: {
      type: Number,
      required: true,
    },
    /**
     * 当該作物がどのメニューの材料に含まれているのか記載
     */
    menuName: {
      type: String,
      required: true,
    },
    /**
     * modalのID
     */
    myName: {
      type: String,
      required: true,
    },
    /**
     * modalのタイトル
     */
    myModalHeader: {
      type: String,
    },
    /**
     * 入力するWeightの最大値を指定
     */
    maxWeight: {
      type: Number,
      default: 1000,
    },
    /**
     * 入力値の型を指定
     */
    myType: {
      type: String,
      default: 'Number'
    },
    /**
     * モーダルの表示用トリガー
     */
    showModal: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  computed: {
    portionList() {
      const vm = this
      if (vm.items.length === 0) {
        return [
          {
            'FCT_id': '0',
            'id': '0',
            'count_method': 'ton',
            'unit_weight': 1000000,
          },
          {
            'FCT_id': '0',
            'id': '0',
            'count_method': 'Kg',
            'unit_weight': 1000,
          },
          {
            'FCT_id': '0',
            'id': '0',
            'count_method': 'gram',
            'unit_weight': 1,
          }
        ]
      }
      const res = this.portionUnits.filter((dat) => {
        return dat.FCT_id === vm.items[0].id
      })
      res.push(
        {
          'FCT_id': '0',
          'id': '0',
          'count_method': 'ton',
          'unit_weight': 1000000,
        },
        {
          'FCT_id': '0',
          'id': '0',
          'count_method': 'Kg',
          'unit_weight': 1000,
        },
        {
          'FCT_id': '0',
          'id': '0',
          'count_method': 'gram',
          'unit_weight': 1,
        }
      )
      return res
    },
    portionSelected() {
      const vm = this
      return vm.portionList.filter((dat) => {
        return dat.count_method === vm.selected
      })
    },
    inputName() {
      return this.myName + '_input'
    },
    inputState() {
      return (this.value > 0 && this.value <= this.maxWeight)
    },
    menuNameState() {
      return (this.menuName.length > 3)
    },
    showModalComputed: {
      get() {
        return this.showModal
      },
      set(val) {
        this.$emit('update:showModal', val)
      }
    },
    portionValue: {
      get() {
        if (this.portionSelected.length === 0) {
          return this.value
        }
        return Math.round(this.value * 10 / this.portionSelected[0].unit_weight) / 10
      },
      set(val) {
        const res = Math.round(val * this.portionSelected[0].unit_weight * 10) / 10
        this.$emit('update:value', Number(res))
      }
    }
  },
  data() {
    return {
      myMenuName: '',
      selected: '',
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
  },
  watch: {
    //modalが表示される度にcount_methodをgramにセットする
    showModal(val) {
      if (val) {
        this.selected = this.portionList[this.portionList.length - 1].count_method
      }
    }
  },
  methods: {
    // ...
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
          res = String(item) + units[unitKey]["1"]
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
    /**
     * テーブル内の要素（items）と入力されたWtを一つのObjectに合成して返す
     */
    clickOk() {
      let result = {}
      result = this.items[0]
      result.Wt = this.value
      result.menuName = this.menuName
      this.$emit('modalOk', result)
    },
    clickCancel() {
      this.$emit('modalCancel')
    },
  }
}

</script>
