<template>
  <b-container>
  </b-container>
</template>

<script>
export default {
  name: 'Lifecycle',
  data: function () {
    return {
      properties: {
        message: 'default value.',
      },
    }
  },
  props: {
    hasChanged: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  /**
   * [公式](https://jp.vuejs.org/v2/api/index.html#created) から拝借｡
   *
   * インスタンスが作成された後に同期的に呼ばれます。
   * この段階では、インスタンスは、データ監視、算出プロパティ、メソッド、watch/event コールバックらの
   * オプションのセットアップ処理が完了したことを意味します。
   * しかしながら、マウンティングの段階は未開始で、`$el` プロパティはまだ利用できません。
   */
  created: function () {
    this.properties.message = 'set value on created.'
    window.addEventListener('beforeunload', this.beforeWindowUnload)
    console.log(`beforeunload registered`)
  },
  /**
   * [公式](https://jp.vuejs.org/v2/api/index.html#beforeDestroy) から拝借｡
   *
   * > Vue インスタンスが破棄される直前に呼ばれます。
   * この段階ではインスタンスはまだ完全に機能しています。
   *
   * **このフックはサーバサイドレンダリングでは呼ばれません。**
   */
  beforeDestroy: function () {
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
    console.log(`beforeunload removed`)
  },
  // ****************************
  // * ページを移動するときの処理: v-router
  // ****************************
  beforeRouteLeave(to, from, next) {
    // アラートダイアログを表示して、結果に応じて遷移
    if (this.hasChanged){
      const msg = 'Do you want to move to other page? if you proceed, the change you have made will lost.`';
      const answer = window.confirm(msg);
      next(answer);
    }
  },
  methods: {
    beforeWindowUnload(e) {
      if (this.hasChanged){
        const msg = 'Do you want to move to other page? if you proceed, the change you have made will lost.`';
        const answer = window.confirm(msg);
        if (!answer) {
          // Cancel the event
          e.preventDefault()
          // Chrome requires returnValue to be set
          e.returnValue = ''
        }
      }
    },
  }
}
</script>
