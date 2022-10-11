<template>
  <b-container>
    <b-modal
      v-model="showModalComputed"
      :id="myName"
      :title="myModalHeader"
      static
      @ok="clickOk"
      @cancel="clickCancel"
      hide-header
      hide-footer
    >
      <b-card
        class="mb-2"
        border-variant="success"
      >
        <!--    ここからFCTテーブル      -->
        <b-row class="mb-0">
          <div class="font-weight-bold ml-3 text-primary">food composition table</div>
        </b-row>
        <b-row class="my-0">
          <div class="small ml-3 text-muted">(1) select food item from the list below</div>
        </b-row>
        <b-row class="my-0">
          <fct-table
            :items="items"
            head-row-variant="success"
            table-variant="light"
            @fctClick="onFctClick"
            class="mb-0"
          ></fct-table>
        </b-row>
      </b-card>
      <b-card
        class="mb-2"
        border-variant="success"
      >
        <!--   ここから選択されたfood itemの表示     -->
        <b-row>
          <div class="font-weight-bold ml-3 text-primary">
            add new ingredients
          </div>
          <b-button
            class="px-0 py-0 mx-0 my-0"
            variant="light"
            @click="showModalInput = !showModalInput"
            :disabled="!stateSelectedItem"
          >
            <b-badge variant="danger" class="px-1 py-1">
              +
            </b-badge>
          </b-button>
        </b-row>

        <b-row>
          <div class="small ml-3 text-muted">(2) add food item by clicking +</div>
        </b-row>

        <b-table
          :items="selectedItemArray"
          :fields="fieldsSelected"
          head-row-variant="success"
          small
          outlined
        >
          <!-- A custom formatted header cell for field 'name' -->
          <template #head(menuName)="data">
            <span>Menu</span>
          </template>
          <!-- A custom formatted header cell for field 'name' -->
          <template #head(Name)="data">
            <span>ingredients</span>
          </template>
          <!-- A custom formatted cell for field 'name' -->
          <template #cell(Name)="data">
            <span class="text-info" style="font-size: small">{{ data.value }}</span>
            <span v-if="!(data.value)" class="text-danger" style="font-size: small">--- no data ---</span>
          </template>
          <!-- A custom formatted cell for field 'menuName' -->
          <template #cell(menuName)="data">
            <span class="text-info pointer" style="font-size: small">{{ data.value }}</span>
            <span v-if="!(data.value)" class="text-danger" style="font-size: small">-----</span>
          </template>
          <!-- A custom formatted cell for field 'En' -->
          <template #cell(En)="data">
            <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 3) }}</span>
          </template>
          <!-- A custom formatted cell for field 'Pr' -->
          <template #cell(Pr)="data">
            <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 0) }}</span>
          </template>
          <!-- A custom formatted cell for field 'Va' -->
          <template #cell(Va)="data">
            <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 1) }}</span>
          </template>
          <!-- A custom formatted cell for field 'Fe' -->
          <template #cell(Fe)="data">
            <span class="text-info" style="font-size: small">{{ setDigit(Number(data.value), 2) }}</span>
          </template>
          <!-- A custom formatted cell for field 'Wt' -->
          <template #cell(Wt)="data">
            <span class="text-info pointer" style="font-size: small">{{ setDigit(Number(data.value), 0) }}</span>
          </template>
        </b-table>
      </b-card>

      <!--  ここから食事記録の表示    -->
      <b-card
        class="mb-2"
        border-variant="success"
      >
        <span class="font-weight-bold text-primary">diet record</span>
        <recepi-table
          :items="menuCases"
          head-row-variant="success"
          @itemDeleted="deleteSupply"
          @rowClick="onRecepiClicked"
        />
      </b-card>
    </b-modal>

    <!--  ここからデータ入力用modal  -->
    <b-modal
      v-model="showModalInput"
      id="modalInputWeight"
      hide-header
      hide-footer
    >
      <!--   タイトル   -->
      <b-row class="px-0 mx-0 my-1">
        <b-col>
          <span class="font-weight-bold">Add </span>
          <span class="text-danger font-weight-bold">{{ selectedItem.Name }}</span>
        </b-col>
      </b-row>

      <!--   食事名と食材ボリュームの記録   -->
      <b-card
        header-bg-variant="success"
        border-variant="success"
        bg-variant="light"
        class="my-2">

        <span class="font-weight-bold text-success">set diet name</span>
        <b-input-group
          size="sm"
          class="mx-0"
        >
          <template #prepend>
            <b-button size="sm" variant="info">diet name</b-button>
          </template>
          <b-form-input
            id="inputFoodName"
            v-model="foodName"
            :state="stateFoodName"
          ></b-form-input>
        </b-input-group>
        <b-row>
          <b-col>
            <b-button
              v-for="name in typicalMenu"
              :key="name"
              pill
              size="sm"
              class="px-2 py-1 my-1 mx-1"
              variant="outline-success"
              @click="foodName = name"
            >
              <span class="small ">{{ name }}</span>
            </b-button>
          </b-col>
        </b-row>
        <span class="small text-muted">
            select or type at least
            4 letters to identify the name of the diet (ex. breakfast,
            lunch, or specific name of the dish)
          </span>
      </b-card>

      <b-card
        header-bg-variant="success"
        border-variant="success"
        bg-variant="light"
        class="my-2">

        <span class="font-weight-bold text-success">set volume</span>
        <b-input-group
          size="sm"
          class="mx-0"
        >
          <template #prepend>
            <b-button size="sm" variant="info">portion count</b-button>
          </template>
          <b-form-input
            id="inputVolume"
            v-model="portionCount"
            type="number"
            :state="stateFoodVolume"
          ></b-form-input>
        </b-input-group>
        <b-row class="mt-2">
          <b-col>
            total weight:<span class="text-danger font-weight-bold">{{ foodVolume }}</span> gram
            <b-table
              bordered
              small
              sticky-header
              selectable
              select-mode="single"
              head-row-variant="success"
              :items="portionList"
              :fields="fields1"
              @row-selected="onPortionSelected"
            >
            </b-table>
            <b-card class="border-0 py-2 px-2" align="center">
              <b-img-lazy :src="portionImg" fluid alt="Loading"></b-img-lazy>
            </b-card>
          </b-col>
        </b-row>
      </b-card>

      <!--   Add/Cancelボタン   -->
      <b-row align-h="end" class="my-2">
        <b-col cols="4">
          <b-button
            variant="primary"
            class="mx-1"
            size="sm"
            :disabled="!stateFoodName || !stateFoodVolume"
            @click="addItem"
          >Add
          </b-button>

          <b-button
            class="mx-1"
            size="sm"
            @click="showModalInput = false"
          >Cancel
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import FctTable from "@/components/molecules/FctTable"
import recepiTable from "@/components/molecules/recepiTable";

/**
 * @desc FctTableをModal化したもの
 * 1. propsでFCTテーブルを受け取り表示
 * 2. 特定行をclickすると品目情報をfoodModalに転送して開く
 * 3. foodModalで重量を決定し、FctTableに戻す
 * 4. Okクリックで選択された品目と重量をemit
 */
export default {
  components: {
    FctTable,
    recepiTable
  },
  props: {
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
      default: 'my modal'
    },
    /**
     * FCTテーブル用のデータ
     */
    items: {
      type: Array,
      required: true
    },
    /**
     * menuテーブル用のデータ
     */
    menuCases: {
      type: Array,
      required: true
    },
    /**
     * portion換算用の変換表
     */
    portionUnits: {
      type: Array,
      required: true,
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
    /**
     * 食材の重さの入力値
     */
    foodVolume() {
      return this.portionCount * this.portionSize
    },
    /**
     * 重量計算用のportion一覧表
     * @returns {[{count_method: string, FCT_id: string, id: string,
     *     unit_weight: number},{count_method: string, FCT_id: string,
     *     id: string, unit_weight: number},{count_method: string,
     *     FCT_id: string, id: string, unit_weight: number}]|*[]}
     */
    portionList() {
      const vm = this
      if ((vm.items.length === 0) || (vm.selectedItem === '')) {
        return [
          {
            'FCT_id': '0',
            'id': '999',
            'count_method': 'ton',
            'unit_weight': 1000000,
          },
          {
            'FCT_id': '0',
            'id': '998',
            'count_method': 'Kg',
            'unit_weight': 1000,
          },
          {
            'FCT_id': '0',
            'id': '997',
            'count_method': 'gram',
            'unit_weight': 1,
          }
        ]
      }
      const res = this.portionUnits.filter((dat) => {
        return dat.FCT_id === vm.selectedItem.id
      })
      res.push(
        {
          'FCT_id': '0',
          'id': '999',
          'count_method': 'ton',
          'unit_weight': 1000000,
        },
        {
          'FCT_id': '0',
          'id': '998',
          'count_method': 'Kg',
          'unit_weight': 1000,
        },
        {
          'FCT_id': '0',
          'id': '997',
          'count_method': 'gram',
          'unit_weight': 1,
        }
      )
      return res
    },
    /**
     * ダイアログで食材の量が入力されているかどうかのフラグ
     * @returns {boolean}
     */
    stateFoodVolume() {
      return (this.portionCount > 0 && this.portionSize > 0)
    },
    /**
     * ダイアログで食事の名称が入力されているかどうかのフラグ
     * @returns {boolean}
     */
    stateFoodName() {
      return (this.foodName.length > 3)
    },
    /**
     * FCTで食材が選択されているかどうかのフラグ
     * @returns {boolean}
     */
    stateSelectedItem() {
      return (this.selectedItem !== '')
    },
    /**
     * 選択されたFCT行を配列に変換
     * @returns {string[]}
     */
    selectedItemArray() {
      return [this.selectedItem]
    },
    /**
     * モーダル表示用のフラグ
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
  data() {
    return {
      /**
       * 画像表示用property
       */
      imgProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: '#bbb',
        width: 200,
        height: 200,
        class: 'my-5'
      },
      /**
       * portion表示用設定
       */
      fields1: [
        {key: 'id', tdClass: 'd-none', thClass: 'd-none'},
        {key: 'FCT_id', tdClass: 'd-none', thClass: 'd-none'},
        {key: 'name', tdClass: 'd-none', thClass: 'd-none'},
        {key: 'count_method', label:'Portion'},
        {key: 'unit_weight'},
      ],
      /**
       * portionの画像リンク
       */
      portionImg: '',
      /**
       * 食材の重さの入力値:portion数
       */
      portionCount: 0,
      /**
       * 食材の重さの入力値:portionの単位量
       */
      portionSize: 0,
      /**
       * 食事のメニュー名
       */
      foodName: '',
      /**
       * 入力用のModalを開くためのフラグ
       */
      showModalInput: false,
      /**
       * 選択された行のデータを代入する変数
       */
      selectedItem: '',
      /**
       * 選択された作物(selectedItem)の表示用
       */
      fieldsSelected: [
        {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'menuName', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        {key: 'Name', sortable: true},
        {key: 'En', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        {key: 'Pr', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        {key: 'Va', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        {key: 'Fe', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
        {key: 'Wt', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
      ],
      typicalMenu: [
        '1st meal',
        '2nd meal',
        '3rd meal',
        '4th meal',
        '1st snack',
        '2nd snack',
        '3rd snack',
      ],
    }
  },
  methods: {
    onPortionSelected(item){
      console.log(item)
      if (item.length){
        this.portionImg = item[0].photoLink ? item[0].photoLink[0]: '/img/crops/no_image.png'
        this.portionSize = item[0].unit_weight
      }
    },
    /**
     * 各栄養素の値の表示用に、桁数を調整
     * @param item
     * @param unitKey
     * @returns {string}
     */
    setDigit(item, unitKey) {
      let res = ''
      const units = [
        {1: ' g', 2: ' kg', 3: ' t'},
        {1: ' µg', 2: ' mg', 3: ' g'},
        {1: ' mg', 2: ' g', 3: ' kt'},
        {1: ' KC', 2: ' MC', 3: ' GC'},
      ]
      const itemConv = item ? item : 0
      switch (true) {
        case (itemConv < 1000):
          res = String(Math.round(itemConv)) + units[unitKey]["1"]
          break;
        case (itemConv >= 1000 && itemConv < 1000000):
          res = String(Math.round(itemConv / 1000)) + units[unitKey]["2"]
          break;
        case (itemConv >= 1000000):
          res = String(Math.round(itemConv / 1000000)) + units[unitKey]["3"]
          break;
        default:
          console.error('parameter not valid:setDigit:' + itemConv)
          res = ''
          break;
      }
      return res
    },
    /**
     * 行をクリックされた場合にその内容をselectedItemにコピー
     * @param rec
     */
    onFctClick(rec) {
      this.selectedItem = JSON.parse(JSON.stringify(rec))
    },
    /**
     * 最終結果(menuCases)をemit
     */
    clickOk() {
      const vm = this
      vm.$emit('modalOk', vm.menuCases)
      //データをクリアして入力用ダイアログを閉じる
      vm.selectedItem = ''
      vm.portionCount = 0
      vm.portionSize = 1
      vm.foodName = ''
      vm.showModalInput = false
    },
    /**
     * 捜査内容を破棄して戻る
     */
    clickCancel() {
      //データをクリアして入力用ダイアログを閉じる
      const vm = this
      vm.selectedItem = ''
      vm.portionCount = 0
      vm.portionSize = 1
      vm.foodName = ''
      vm.showModalInput = false
    },
    /**
     * 入力ダイアログの内容をselectedItemに追記して、menuCasesの配列に追加後、更新のためemit
     */
    addItem() {
      const vm = this

      //selectedItemの値を更新
      vm.selectedItem.Wt = Number(vm.foodVolume)
      vm.selectedItem.menuName = vm.foodName

      let res = []
      let addNew = true
      res = vm.menuCases.map((item) => {
        // もし既存データとidおよび食事名が一致した場合には追加ではなく既存の値を変更
        if ((item.id === vm.selectedItem.id) && (item.menuName === vm.selectedItem.menuName)) {
          item.Wt = Number(vm.selectedItem.Wt)
          item.menuName = vm.selectedItem.menuName
          addNew = false
        }
        return item
      })

      // もし既存のデータとマッチしていなければ新規追加
      console.log('addNew:' + addNew)
      if (addNew) {
        res.push(vm.selectedItem)
      }

      //更新した値をemit
      this.$emit('update:menuCases', res)

      //データをクリアして入力用ダイアログを閉じる
      vm.selectedItem = ''
      vm.portionCount = 0
      vm.portionSize = 1
      vm.foodName = ''
      vm.showModalInput = false
    },
    /**
     * recepiTableの削除ボタンをクリックした際に
     *     削除後の値をemitしてmenuCasesを更新
     * @param val
     */
    deleteSupply(val) {
      //更新した値をemit
      this.$emit('update:menuCases', val)
    },
    /**
     * recepiTableの行をクリックした場合に、その行の内容を
     *     selectedItem, foodName, foodVolumeにコピーした上で
     *     編集用ダイアログを開く
     * @param val
     */
    onRecepiClicked(val) {
      this.selectedItem = JSON.parse(JSON.stringify(val))
      this.foodName = this.selectedItem.menuName
      this.portionSize = 1
      this.portionCount = this.selectedItem.Wt
      this.showModalInput = true
    },
  }
}

</script>
