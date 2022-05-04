<template>
  <b-container>
    <div>{{ 'data:' + datObj.childObj.clicker }}</div>
    <div>{{ 'dataComp:' + dataComputed }}</div>
    <b-card>
      <div>{{ datObjComputed }}</div>
      <div>{{ 'computed triggered:' + countComputed }}</div>
      <div>{{ 'watch triggered:' + countWatched }}</div>
    </b-card>
    <hr>
    <div>
      <b-button variant="success" @click="datObj.childObj.clicker += 1" class="my-1">click+</b-button>
      <b-button variant="success" @click="onModifierClick" class="my-1">reset</b-button>
    </div>
    <hr>
    <div>
      <b-button variant="success" @click="datObj.childObj.firstName += '_add'" class="my-1">change original element
      </b-button>
      <span>original element -> watch working</span>
    </div>
    <hr>
    <div>
      <b-button variant="success" @click="updateNewElement" class="my-1">
        {{ isNewElement ? 'change new element:watcher not work' : 'add element' }}
      </b-button>
      <span>newly added element -> watch not working</span>
    </div>
    <div>
      <b-button variant="success" @click="updateNewElement2" class="my-1">
        {{ isNewElement2 ? 'change new element:watcher work' : 'add element' }}
      </b-button>
      <span>newly added element this.$set -> watch working</span>
    </div>
    <hr>
    <div>
      <b-button variant="success" @click="datObj.childObj.arrayTest[2] = 0" class="my-1">
        update array
      </b-button>
      <span>array[index]=value -> watch not working</span>
    </div>
    <div>
      <b-button variant="success" @click="datObj.childObj.arrayTest.splice(2,1,0)" class="my-1">
        update array
      </b-button>
      <span>array.splice(index,1,value) -> watch working</span>
    </div>
  </b-container>
</template>

<script>
/**
 * computed propertyをnested object/arrayで使うための留意点
 * --------arrayの更新時-------------
 * ×：Array[index] = value
 * ○：Array.splice(index, 1, value)
 *
 * --------Objectへの要素追加時-------------
 * ×：Object[key] = value
 * ○：this.$set(Object, key, value)
 */
export default {
  data() {
    return {
      /**
       * Computedが反応した回数
       */
      countComputed: 0,
      /**
       * watchが反応した回数
       */
      countWatched: 0,
      /**
       * Objectに新規要素を追加したかどうかの判定フラグ1
       */
      isNewElement: false,
      /**
       * Objectに新規要素を追加したかどうかの判定フラグ2
       */
      isNewElement2: false,
      /**
       * computed/watchの挙動を確認するためのObject
       */
      datObj: {
        firstName: '',
        lastName: '',
        clicker: 0,
        childObj: {
          firstName: '',
          lastName: '',
          clicker: 0,
          arrayTest: [1, 2, 3, 4, 5]
        }
      },
    }
  },
  computed: {
    /**
     * click回数をカウントするcomputed
     * @returns {number}
     */
    dataComputed: function () {
      return this.datObj.childObj.clicker + 10
    },
    /**
     * datObj全体のcomputed
     * @returns {any}
     */
    datObjComputed: function () {
      this.countComputed += 1
      return JSON.parse(JSON.stringify(this.datObj))
    },
  },
  watch: {
    datObj: {
      deep: true,
      immediate: true,
      handler: function () {
        this.countWatched += 1
      }
    }
  },
  methods: {
    /**
     * datObjを初期化
     */
    onModifierClick() {
      this.datObj = {
        firstName: '',
        lastName: '',
        clicker: 0,
        childObj: {
          firstName: '',
          lastName: '',
          clicker: 0,
          arrayTest: [1, 2, 3, 4, 5]
        }
      }
      this.countComputed = 0
      this.countWatched = 0
      this.isNewElement = false
      this.isNewElement2 = false
    },
    /**
     * datObjに新規要素を追加1
     *     Object.newKey = newValue
     */
    updateNewElement() {
      if (!this.isNewElement) {
        this.datObj.childObj.newElement = 'new'
        this.isNewElement = true
      } else {
        this.datObj.childObj.newElement += '_add'
      }
    },
    /**
     * datObjに新規要素を追加3
     *     this.$set(Object, newElement, newValue)
     */
    updateNewElement2() {
      if (!this.isNewElement2) {
        this.$set(this.datObj.childObj, 'newElement', 'new')
        this.isNewElement2 = true
      } else {
        this.datObj.childObj.newElement += '_add'
      }
    }
  }
}
</script>
