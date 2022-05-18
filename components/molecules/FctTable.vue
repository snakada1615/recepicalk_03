<template>
  <b-container class="my-0">
    <!--  フィルター用のリストボックス  -->
    <b-input-group>
      <b-form-input
        v-model="filter"
        type="search"
        id="filterInput"
        placeholder="Type to Search"
      ></b-form-input>

      <template #append>
        <b-dropdown text="Group" variant="primary">
          <b-dropdown-item
            v-for="grpName in FoodGrp"
            :key="grpName.name"
            :value="grpName.name"
            @click="filter = grpName.name"
          >{{ grpName.name }}
          </b-dropdown-item>
        </b-dropdown>
        <b-button variant="info" :disabled="!filter" @click="filter = ''">clear</b-button>
      </template>

    </b-input-group>

    <!--  ここからFCTテーブル本体  -->
    <div class="mt-3">
      <b-table
        class="jest_table"
        striped
        bordered
        border-variant="dark"
        responsive
        selectable
        select-mode="single"
        small
        ref="table"
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter="filter"
        :filter-included-fields="filterOn"
        @filtered="onFiltered"
        @row-clicked="rowClick"
        @input="onInput"
        v-bind="$attrs">
      </b-table>

      <!--   ページ毎の表示件数を選択   -->
      <b-form-group
        label="Per page"
        label-cols-sm="10"
        label-cols-md="10"
        label-cols-lg="10"
        label-align-sm="right"
        label-size="sm"
        label-for="perPageSelect"
        class="mb-1"
      >
        <b-form-select
          v-model="perPage"
          id="perPageSelect"
          size="sm"
          :options="pageOptions"
        ></b-form-select>
      </b-form-group>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
      ></b-pagination>
    </div>
  </b-container>

</template>


<script>

/**
 * @desc FCTをpropから読み込んで表示\
 * *FoodGroup,およびキーワードによってフィルター
 * *onClickで選択行の情報をemit
 */
export default {
  props: {
    /**
     * FCTの本体。Array of Object
     */
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    /**
     * FCTに含まれるFood Groupの一覧
     * @returns {*[]}
     * @constructor
     */
    FoodGrp: function () {
      let uniqueGroup = []
      let result = []
      if (this.items) {
        this.items.forEach(function (elem) {
          if (uniqueGroup.indexOf(elem.Group) === -1) {
            uniqueGroup.push(elem.Group)
            result.push({
              name: elem.Group
            })
          }
        })
      }
      return result
    },
  },
  data() {
    return {
      /**
       * テーブルに表示するfieldの定義
       */
      fields: [
        {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
        {key: 'Name', sortable: true, thStyle: {width: "290px"}},
        {key: 'En', sortable: true, thStyle: {width: "50px"}},
        {key: 'Pr', sortable: true, thStyle: {width: "50px"}},
        {key: 'Va', sortable: true, thStyle: {width: "50px"}},
        {key: 'Fe', sortable: true, thStyle: {width: "50px"}},
      ],
      /**
       * 各列の表示幅の設定
       */
      colWidth: [0, 0, 120, 30, 30, 30, 30],
      /**
       * FCTの全ての行数
       */
      totalRows: 1,
      /**
       * 現在のページ番号
       */
      currentPage: 1,
      /**
       * 現在表示しているページ番号
       */
      perPage: 5,
      /**
       * 1ページ毎の表示行数
       */
      pageOptions: [5, 10, 15, {value: 100, text: "Show a lot"}],
      /**
       * 並べ替えの基準になる行
       */
      sortBy: 'Name',
      /**
       * 並べ替えの順序
       */
      sortDesc: false,
      /**
       * フィルターの内容
       */
      filter: null,
      /**
       * フィルター適用のスイッチ
       */
      filterOn: ['Group', 'Name'],
    }
  },
  methods: {
    /**
     * フィルターをかけた際の表示行数、ページ数を調整する関数
     * @param filteredItems
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
      console.log('filtered!!')
    },
    /**
     * 入力されたキーワードに基づいたフィルターの作成
     */
    onInput() {
      // Set the initial number of items
      this.totalRows = this.items.length
    },
    /**
     * テーブルの行をクリックした際にその行の情報をemit
     * @param record
     */
    rowClick(record) {
      this.$emit('fctClick', record)
    }
  },
}
</script>
