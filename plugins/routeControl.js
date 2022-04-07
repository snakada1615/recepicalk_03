if (process.client) {
  // 作成時にイベントリスナーに登録
  window.addEventListener("beforeunload", this.checkWindow);
}

export function beforeDestroy() {
  window.removeEventListener('resize', this.handle);
}

