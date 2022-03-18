<template>
  <b-container class="my-0">
    <b-input-group>
      <b-form-input
        v-model="filter"
        type="search"
        id="filterInput"
        placeholder="Type to Search"
      ></b-form-input>

      <template #append>
        <b-dropdown text="Group" variant="primary" >
          <b-dropdown-item
            v-for="grpName in FoodGrp"
            :key="grpName.name"
            :value="grpName.name"
            @click="filter = grpName.name"
          >{{ grpName.name }}</b-dropdown-item>
        </b-dropdown>
        <b-button variant="info" :disabled="!filter" @click="filter = ''">clear</b-button>
      </template>

    </b-input-group>

    <div class="mt-3">
      <b-table
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

  export default {
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
    computed:{
      FoodGrp: function () {
        let uniqueGroup = []
        let result = []
        if (this.items){
          this.items.forEach(function (elem, index) {
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
        fields: [
          {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'},
          {key: 'Name', sortable: true, thStyle: {width: "290px"}},
          {key: 'En', sortable: true, thStyle: {width: "50px"}},
          {key: 'Pr', sortable: true, thStyle: {width: "50px"}},
          {key: 'Va', sortable: true, thStyle: {width: "50px"}},
          {key: 'Fe', sortable: true, thStyle: {width: "50px"}},
        ],
        colWidth: [0, 0, 120, 30, 30, 30, 30],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15, {value: 100, text: "Show a lot"}],
        sortBy: 'Name',
        sortDesc: false,
        filter: null,
        filterOn: ['Group', 'Name'],
      }
    },
    methods: {
      hello() {
        console.log('hello refreshed!')
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
        console.log('filtered!!')
      },
      onInput() {
        // Set the initial number of items
        this.totalRows = this.items.length
      },
      rowClick(record) {
        this.$emit('fctClick', record)
      }
    },
  }
</script>
