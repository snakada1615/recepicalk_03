<template>
  <b-container>
    <b-card
      class="mb-2"
      border-variant="success"
    >
      <h4 class="text-primary">1. Select commodity</h4>
      <fct-table
        head-row-variant="success"
        :items="cropList"
        @fctClick="onFctClick"
      />
    </b-card>
    <b-card
      class="mb-2"
      border-variant="success"
    >
      <h4 class="text-primary">
        2. Add(modify) portion-size
        <span @click="addItem">
          <B-badge variant="success" class="pointer">+</B-badge>
        </span>
      </h4>
      <b-card
        class="border-0"
      >
        <b-table
          striped
          bordered
          small
          sticky-header
          head-row-variant="success"
          :items="portionList"
          :fields="fields1"
        >
          <!-- A custom formatted cell for field 'name' -->
          <template #cell(name)="data">
            <div class="d-flex justify-content-between">
              <span class="text-info">{{ data.value }}</span>
              <span>
              <b-button class="px-0 py-0 mx-0 my-0 border-0" variant="light" @click="editItem(data.item)">
                <b-badge variant="light" class="px-0 py-0">
                  <b-icon icon="PencilSquare" variant="secondary"></b-icon>
                </b-badge>
              </b-button>
              <b-button class="px-0 py-0 mx-0 my-0 border-0" variant="light" @click="deleteItem(data.item.id)">
                <b-badge variant="light" class="px-0 py-0">
                  <b-icon icon="TrashFill" variant="secondary"></b-icon>
                </b-badge>
              </b-button>
              </span>
            </div>
          </template>
        </b-table>
        <div>
          <B-button v-b-toggle.showImage size="sm" variant="light" class="small">
            show image <b-icon icon="caret-down-square"/>
          </B-button>
        </div>
        <b-collapse id="showImage" class="mt-2">
          <b-carousel :img-height="120">
            <b-carousel-slide
              v-for="(item, index) in portionList" :key="index"
              :caption="'unit: ' + item.count_method + ', weight: '+ item.unit_weight + 'g'"
              :img-src="item.photoLink ? item.photoLink[0]: '/img/crops/food_icon.png'"
            ></b-carousel-slide>
          </b-carousel>
        </b-collapse>
      </b-card>
    </b-card>

    <!-- ここからmodal作成   -->
    <b-modal
      v-model="showModal1"
      :static="true"
      @ok="modalOk1"
      id="modal1"
      title="set portion-size"
      header-bg-variant="info-2"
    >
      <h5>{{ modalValue.name }}</h5>
      <b-input-group prepend="counting method" class="my-1">
        <b-form-input v-model="modalValue.count_method"></b-form-input>
      </b-input-group>
      <b-input-group prepend="unit weight" class="my-1">
        <b-form-input v-model="modalValue.unit_weight"></b-form-input>
      </b-input-group>
      <hr>
      <upload-picture
        @get-link="getLink"
      />
    </b-modal>

  </b-container>
</template>
<script>
import FctTable from "../components/molecules/FctTable";
import {array2JSON, myUid} from "../plugins/helper";
import uploadPicture from "~/components/atoms/uploadPicture";

export default {
  layout: 'defaultEth',
  components: {
    FctTable,
    uploadPicture
  },
  data() {
    return {
      fields1: [
        {key: 'id', tdClass: 'd-none', thClass: 'd-none'},
        {key: 'FCT_id', tdClass: 'd-none', thClass: 'd-none'},
        {key: 'name'},
        {key: 'count_method'},
        {key: 'unit_weight'},
      ],
      cropId: '',
      cropName: '',
      showModal1: false,
      modalValue: {
        id: '',
        FCT_id: '',
        name: '',
        count_method: '',
        unit_weight: 0,
        photoLink: []
      }
    }
  },
  computed: {
    cropList() {
      const fct = this.$store.state.fire.myApp.dataSet.fct
      if (fct) {
        return this.$store.state.fire.myApp.dataSet.fct.map((item) => {
          return item
        })
      } else {
        return []
      }
    },
    portionList() {
      const vm = this
      if (!vm.cropId) {
        return []
      } else {
        return vm.$store.state.fire.myApp.dataSet.portionUnit.filter((item) => {
          return item.FCT_id === vm.cropId
        }).map((item2) => {
          item2.name = vm.cropName
          return item2
        })
      }
    }
  },
  methods: {
    getLink(val) {
      this.modalValue.photoLink.push(val)
      console.log('getLink:' + val)
    },
    onFctClick(val) {
      this.cropId = val.id
      this.cropName = val.Name
    },
    editItem(item) {
      this.modalValue.id = item.id
      this.modalValue.FCT_id = item.FCT_id
      this.modalValue.name = item.name
      this.modalValue.count_method = item.count_method
      this.modalValue.unit_weight = item.unit_weight
      this.modalValue.photoLink = JSON.parse(JSON.stringify(item.photoLink)) || []
      this.showModal1 = true
    },
    addItem() {
      this.modalValue.id = myUid()
      this.modalValue.FCT_id = this.cropId
      this.modalValue.name = this.cropName
      this.modalValue.count_method = ''
      this.modalValue.unit_weight = ''
      this.modalValue.photoLink = []
      this.showModal1 = true
    },
    async deleteItem(index) {
      const vm = this
      // idがval.idに合致するものだけを排除
      const myPortionUnit = JSON.parse(JSON.stringify(vm.$store.state.fire.myApp.dataSet.portionUnit)).filter((item) => {
        return item.id !== index
      })

      // storeを更新
      await vm.$store.dispatch('fire/updatePortionUnit', myPortionUnit)

      // fireBaseを更新
      await vm.$store.dispatch('fire/fireSavePortionUnit', {
          'docName': vm.$store.state.fire.myApp.dataSet.portionUnitId,
          'data': array2JSON(myPortionUnit, 'id')
        }
      )
      //更新フラグをon
      await vm.$store.dispatch('fire/setHasDocumentChanged', true)

      this.modalValue.id = ''
      this.modalValue.FCT_id = ''
      this.modalValue.name = ''
      this.modalValue.count_method = ''
      this.modalValue.unit_weight = ''
      this.modalValue.photoLink.length = 0
    },
    async modalOk1() {
      const vm = this
      let isNewValue = true
      // idの重複がある場合には、値を更新、ない場合には単純にデータ追加
      const myPortionUnit = JSON.parse(JSON.stringify(vm.$store.state.fire.myApp.dataSet.portionUnit)).map((item) => {
        if (item.id === vm.modalValue.id) {
          isNewValue = false
          return vm.modalValue
        } else {
          return item
        }
      })
      if (isNewValue) {
        myPortionUnit.push(vm.modalValue)
      }

      // storeを更新
      await vm.$store.dispatch('fire/updatePortionUnit', myPortionUnit)
      // fireBaseを更新
      await vm.$store.dispatch('fire/fireSavePortionUnit', {
          'docName': vm.$store.state.fire.myApp.dataSet.portionUnitId,
          'data': array2JSON(myPortionUnit, 'id')
        }
      )

      //更新フラグをon
      await vm.$store.dispatch('fire/setHasDocumentChanged', true)

      this.modalValue.id = ''
      this.modalValue.FCT_id = ''
      this.modalValue.name = ''
      this.modalValue.count_method = ''
      this.modalValue.unit_weight = ''
      this.modalValue.photoLink.length = 0
    },
  }
}
</script>
