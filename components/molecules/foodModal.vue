<template>
  <b-modal
    v-model="showModalComputed"
    class="jest_modal"
    :id="myName"
    :title="myModalHeader"
    @ok="clickOk"
    @cancel="clickCancel"
    hide-header
  >
    <b-table
      small
      striped
      head-row-variant="success"
      :items="items"
      :fields="fields"
    ></b-table>
    <b-input-group prepend="Weight in gram" size="sm">
      <b-form-input
        class="jest_input"
        :value="value"
        @input="$emit('input', Number($event))"
        type="number"
        :state="inputState"
        size="sm"
      ></b-form-input>
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
        default: () => [],
      },
      /**
       * itemに対応したweightの値
       */
      value: {
        type: Number,
        required: true,
        default: 0,
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
      showModal:{
        type: Boolean,
        default: false,
        required: true
      }
    },
    computed: {
      inputName() {
        return this.myName + '_input'
      },
      inputState() {
        return (this.value > 0 && this.value <= this.maxWeight)
      },
      showModalComputed: {
        get(){
          return this.showModal
        },
        set(val){
          this.$emit('update:showModal', val)
        }
      }
    },
    data() {
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
        console.log(this.items)
        result.Wt = this.value
        this.$emit('modalOk', result)
      },
      clickCancel() {
        console.log('Cancel')
      },
    }
  }

</script>
