<template>
  <b-modal
    v-model="showModalComputed"
    :id="myName"
    :title="myModalHeader"
    :static="true"
    @ok="clickOk"
    hide-header
  >
    <dri-select-all
      :targetSwitch="targetSwitch"
      :max="max"
      :driPopulations="driPopulations"
      :driItems="driItems"
      @update:targetSwitch="$emit('update:targetSwitch', $event)"
      @update:target="$emit('update:target', $event)"
      @changeNutritionValue="$emit('changeNutritionValue', $event)"
    ></dri-select-all>
  </b-modal>
</template>

<script>
import driSelectAll from "@/components/organisms/driSelectAll.vue"

/**
 * @desc driSelectAllをモーダル化したもの
 */
export default {
  components: {
    driSelectAll
  },
  props: {
    /**
     * モーダルの表示用トリガー
     */
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    /**
     * モーダル表示用のID
     */
    myName: {
      type: String,
      required: true,
    },
    /**
     * モーダルのヘッダー用テキスト
     */
    myModalHeader: {
      type: String,
      required: true,
    },
    /**
     * dri表示用のデータ
     */
    driItems: {
      type: Array,
      required: true,
    },
    /**
     * 対象者を表すArray（グループ毎の人数）
     */
    driPopulations: {
      type: Array,
      required: true,
    },
    /**
     * 一グループあたり設定できる人数の最大値
     */
    max: {
      type: Number,
      required: true,
    },
    /**
     * driSelectAllとdriSelectMultiの切り替え用フラグ
     */
    targetSwitch: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    /**
     * モーダル表示用のフラグを扱うためのComputed Prop
     */
    showModalComputed: {
      get() {
        return this.showModal
      },
      set(val) {
        this.$emit('update:showModal', val)
      }
    }
  },
  methods: {
    clickOk() {
      console.log('done')
    },
  }
}

</script>
