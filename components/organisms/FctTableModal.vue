<template>
  <b-modal
    v-model="showModalComputed"
    :id="myName"
    :title="myModalHeader"
    static
    @ok="clickOk"
    @cancel="clickCancel"
    hide-header
  >
    <fct-table
      :items="items"
      head-row-variant="success"
      table-variant="light"
      @fctClick="onFctClick"
      @fctDblClick="onFctDblClick"
    ></fct-table>
  </b-modal>
</template>

<script>
  import FctTable from "@/components/molecules/FctTable"

  /**
   * @desc FctTableをModal化したもの
   * 1. propsでFCTテーブルを受け取り表示
   * 2. 特定行をclickすると品目情報をfoodModalに転送して開く
   * 3. foodModalで重量を決定し、FctTableに戻す
   * 4. Okクリックで選択された品目と重量をemit
   */
  export default {
    components: {
      FctTable
    },
    props:{
      /**
       * モーダル表示用のID
       */
      myName: {
        type: String,
        required: true,
      },
      /**
       * モーダルのタイトル
       */
      myModalHeader: {
        type: String,
        required: true
      },
      /**
       * FCTテーブル用のデータ
       */
      items:{
        type:Array,
        required: true
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
      /**
       * モーダル表示用のフラグ
       */
      showModalComputed: {
        get(){
          return this.showModal
        },
        set(val){
          this.$emit('update:showModal', val)
        }
      }
    },
    data(){
      return {
        /**
         * 選択された行のデータを代入する変数
         */
        selectedItem: '',
      }
    },
    methods: {
      /**
       * 行をクリックされた場合にその内容をemitする
       * @param rec
       */
      onFctClick(rec){
        this.selectedItem = rec
        this.$emit('click', rec)
      },
      /**
       * 行をクリックされた場合にその内容をemitして
       * 食品の摂取量の設定用の別のmodal（foodModal）を開く
       * @param rec
       */
      onFctDblClick(rec){
        this.selectedItem = rec
        this.$emit('click', rec)
        this.clickOk()
        this.$emit('update:showModal', false)
      },
      /**
       * 選択されたfood item（onFctClick）と摂取量(foodModal)の両方をemitする
       */
      clickOk() {
        this.$emit('modalOk', this.selectedItem)
      },
      /**
       * 捜査内容を破棄して戻る
       */
      clickCancel() {
        console.log('Cancel')
      },
    }
  }

</script>
