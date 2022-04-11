<template>
  <b-modal
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
    props: {
      items: {
        type: Array,
        default: () => [],
      },
      value: {
        type: Number,
        default: 0,
      },
      myName: {
        type: String,
        required: true,
      },
      myModalHeader: {
        type: String,
      },
      maxWeight: {
        type: Number,
        required: true,
      },
      myType: {
        type: String,
      },
    },
    computed: {
      inputName() {
        return this.myName + '_input'
      },
      inputState() {
        return (this.value > 0 && this.value <= this.maxWeight)
      },
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
        result.Wt = this.value
        this.$emit('modalOk', result)
      },
      clickCancel() {
        console.log('Cancel')
      },
    }
  }

</script>
