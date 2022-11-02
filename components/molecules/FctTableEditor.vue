<template>
  <b-container class="my-0">
    <b-row align-h="end">
      <b-col cols="3" class="my-1">
        <b-button
          size="sm"
          variant="warning"
          class="float-right"
          @click="addNewItem"
        >
          +Add new item
        </b-button>
      </b-col>
    </b-row>
    <!--  food list絞り込みのためのフィルター  -->
    <b-input-group>
      <b-form-input
        id="filterInput"
        v-model="filter"
        type="search"
        placeholder="Type to Search"
        size="sm"
      />

      <template #append>
        <b-dropdown text="group" variant="primary" size="sm">
          <b-dropdown-item
            v-for="grpName in FoodGrp"
            :key="grpName.name"
            :value="grpName.name"
            @click="filter = grpName.name"
          >
            {{ grpName.name }}
          </b-dropdown-item>
        </b-dropdown>
        <b-button variant="info" :disabled="!filter" size="sm" @click="filter = ''">
          clear
        </b-button>
      </template>
    </b-input-group>

    <!--  ここからFCT本体  -->
    <div class="mt-3">
      <b-table
        ref="table"
        striped
        bordered
        border-variant="dark"
        responsive
        small
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter="filter"
        :filter-included-fields="filterOn"
        v-bind="$attrs"
        @filtered="onFiltered"
        @row-clicked="onFCTclick"
        @input="onInput"
      >
        <!-- A custom formatted cell for field 'menuName' -->
        <template #cell(Name)="data">
          <span class="text-info pointer">{{ data.item.Name }}</span>
        </template>
      </b-table>
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
          id="perPageSelect"
          v-model="perPage"
          size="sm"
          :options="pageOptions"
        />
      </b-form-group>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
      />

      <!--ここからデータ更新用のModal-->
      <b-modal
        v-if="fctItem"
        id="foodModal"
        title="Edit FCT record"
        header-bg-variant="info"
        header-text-variant="light"
        @ok="clickOk(fctItem)"
        @cancel="clickCancel"
      >
        <b-row class="my-2">
          <b-col cols="3">
            Group
          </b-col>
          <b-col cols="9">
            <b-form-select
              v-model="fctItem.Group"
              size="sm"
              :state="stateGroup"
              :options="FoodGrp.map((item)=>item.name)"
            />
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="3">
            Name
          </b-col>
          <b-col cols="9">
            <b-form-input
              v-model="fctItem.Name"
              size="sm"
              :state="stateName"
            />
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="3">
            En
          </b-col>
          <b-col cols="9">
            <b-form-input
              v-model="fctItem.En"
              size="sm"
              :state="stateEn"
            />
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="3">
            Pr
          </b-col>
          <b-col cols="9">
            <b-form-input
              v-model="fctItem.Pr"
              size="sm"
              :state="statePr"
            />
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="3">
            Va
          </b-col>
          <b-col cols="9">
            <b-form-input
              v-model="fctItem.Va"
              size="sm"
              :state="stateVa"
            />
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="3">
            Fe
          </b-col>
          <b-col cols="9">
            <b-form-input
              v-model="fctItem.Fe"
              size="sm"
              :state="stateFe"
            />
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </b-container>
</template>

<script>

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      temp: '',
      fields: [
        { key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none' },
        { key: 'Name', sortable: true, thStyle: { width: '290px' } },
        { key: 'En', sortable: true, thStyle: { width: '50px' } },
        { key: 'Pr', sortable: true, thStyle: { width: '50px' } },
        { key: 'Va', sortable: true, thStyle: { width: '50px' } },
        { key: 'Fe', sortable: true, thStyle: { width: '50px' } }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: 'Show a lot' }],
      sortBy: 'Name',
      sortDesc: false,
      filter: null,
      filterOn: ['Group', 'Name'],
      fctItem: {
        id: '',
        Group: '',
        Name: '',
        En: '',
        Pr: '',
        Va: '',
        Fe: '',
        food_grp_id: ''
      }
    }
  },
  computed: {
    FoodGrp: function () {
      const uniqueGroup = []
      const result = []
      if (this.items) {
        this.items.forEach(function (elem) {
          if (!uniqueGroup.includes(elem.Group)) {
            uniqueGroup.push(elem.Group)
            result.push({
              name: elem.Group,
              food_grp_id: elem.food_grp_id
            })
          }
        })
      }
      return result
    },
    foodIdMax () {
      return this.items.reduce(function (a, b) {
        return Math.max(Number(a), Number(b.id))
      }, 0)
    },
    stateGroup: function () {
      return (/^[a-zA-Z0-9][a-zA-Z0-9+\-_\\., ]{3,59}$/).test(this.fctItem.Group) &&
        (typeof this.fctItem.Group !== 'undefined')
    },
    stateName: function () {
      return (/^[a-zA-Z0-9][a-zA-Z0-9+\-_\\., ]{3,59}$/).test(this.fctItem.Name) &&
        (typeof this.fctItem.Name !== 'undefined')
    },
    stateEn: function () {
      return (/^[0-9]*\.?[0-9]+$/).test(this.fctItem.En) ||
        (this.fctItem.En === '')
    },
    statePr: function () {
      return (/^[0-9]*\.?[0-9]+$/).test(this.fctItem.Pr) ||
        (this.fctItem.Pr === '')
    },
    stateVa: function () {
      return (/^[0-9]*\.?[0-9]+$/).test(this.fctItem.Va) ||
        (this.fctItem.Va === '')
    },
    stateFe: function () {
      return (/^[0-9]*\.?[0-9]+$/).test(this.fctItem.Fe) ||
        (this.fctItem.Fe === '')
    }
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    onInput () {
      // Set the initial number of items
      this.totalRows = this.items.length
    },
    onFCTclick (val) {
      this.fctItem.id = val.id
      this.fctItem.Group = val.Group
      this.fctItem.Name = val.Name
      this.fctItem.En = val.En
      this.fctItem.Pr = val.Pr
      this.fctItem.Va = val.Va
      this.fctItem.Fe = val.Fe
      this.fctItem.food_grp_id = val.food_grp_id
      this.$bvModal.show('foodModal')
    },
    /**
     * 新規追加する際の初期値
     */
    addNewItem () {
      this.fctItem.id = this.foodIdMax + 1
      this.fctItem.Group = ''
      this.fctItem.Name = ''
      this.fctItem.En = ''
      this.fctItem.Pr = ''
      this.fctItem.Va = ''
      this.fctItem.Fe = ''
      this.fctItem.food_grp_id = ''
      this.$bvModal.show('foodModal')
    },
    clickOk (val) {
      // 追加か修正か判断するフラグ
      let isNewRecord = true
      const vm = this

      // food_group_idはFoodGrpの値に基づいて、手動で変更する必要がある
      val.food_grp_id = Object.values(vm.FoodGrp).filter((item) => {
        return item.name === val.Group
      })[0].food_grp_id

      const res = vm.items.map(function (doc) {
        if (doc.id === val.id) {
          isNewRecord = false
          doc.Group = val.Group
          doc.Name = val.Name
          doc.En = val.En
          doc.Pr = val.Pr
          doc.Va = val.Va
          doc.Fe = val.Fe
          doc.id = val.id
          doc.food_grp_id = val.food_grp_id
        }
        return doc
      })
      if (isNewRecord) {
        res.push(val)
      }
      this.$emit('update:items', res)
      this.$bvModal.hide('foodModal')
    },
    clickCancel () {
      console.log('cancel')
    }
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
