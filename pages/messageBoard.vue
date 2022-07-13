<template>
  <b-container style="max-width: 540px; min-width: 530px;">
    <div class="my-3 mx-2">
      <h4>Message Board</h4>
    </div>
    <div
      style="background-color: #f8f9fa"
      class="px-1 py-1"
    >
      <b-table
        id="my-table"
        :items="itemsView"
        :fields="fields"
        :sort-by="sortBy"
        :per-page="perPage"
        :current-page="currentPage"
        head-variant="light"
        borderless
        small
      >
        <!-- A custom formatted header cell for field 'name' -->
        <template #head(message)="data">
          <b-row>
            <b-col class="mx-2 text-danger">
              start new message
            </b-col>
            <b-col cols="3">
              <b-button
                @click="openModal({
                  parent: 1,
                })"
                size="sm"
                variant="warning"
                class="my-2 mx-3"
              >create
              </b-button>
            </b-col>
          </b-row>
        </template>

        <template #cell(message)="data">
          <b-row>
            <b-col cols="2" v-if="data.item.parent === 0">
            </b-col>
            <b-col cols="10">
              <b-card
                header-tag="header"
                footer-tag="footer"
                header-bg-variant="info"
                header-text-variant="white"
                border-variant="info"
              >
                {{data.item.text}}
                <template #header>
                  <b-row>
                    <b-col>{{data.item.title}}</b-col>
                    <b-col cols="3" v-if="data.item.parent === 1">
                      <b-button
                        variant="warning"
                        @click="openModal({
                          title: data.item.title,
                          mes: data.item.text,
                          parentDate: data.item.parentNum + '-' + data.item.date,
                          parent: 0,
                        })"
                        size="sm">
                        <div>respond</div>
                      </b-button>
                    </b-col>
                  </b-row>
                </template>
                <template #footer>
                  <div>author: {{data.item.author}}</div>
                  <div>date: {{data.item.date}}</div>
                </template>
              </b-card>
            </b-col>
          </b-row>
        </template>
      </b-table>
    </div>

    <b-pagination
      v-model="currentPage"
      :total-rows="rowNumber"
      :per-page="perPage"
      aria-controls="my-table"
    />

    <b-modal
      id="input-modal"
      hide-footer
      header-bg-variant="info"
      title="new message"
      header-text-variant="white"
    >
      <b-row v-if="newMessage.parent === 0">
        <b-col cols="2" class="mx-0">
          parent message:
        </b-col>
        <b-col cols="10">
          <b-card body-bg-variant="gray-200">{{modalMessageRoot}}</b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2" class="mx-0">
          title
        </b-col>
        <b-col cols="10" class="mx-0">
          <b-form-input
            id="textTitle"
            size="sm"
            class="my-2"
            v-model="newMessage.title"
            :state="stateTitle"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          text
        </b-col>
        <b-col cols="10">
          <b-form-textarea
            id="textContent"
            size="sm"
            class="my-2"
            v-model="newMessage.text"
            :state="stateText"
          ></b-form-textarea>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          date
        </b-col>
        <b-col cols="10">
          {{newMessage.date}}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          author
        </b-col>
        <b-col cols="10">
          {{newMessage.author}}
        </b-col>
      </b-row>
      <b-button
        size="sm"
        variant="primary"
        class="mt-2"
        @click="saveMessage"
        :disabled="(!stateText || !stateTitle)"
      >submit
      </b-button>
      <b-button
        size="sm"
        variant="warning"
        class="mt-2"
        @click="cancelModal"
      >cancel
      </b-button>
    </b-modal>
  </b-container>
</template>

<script>

  export default {
    data() {
      return {
        newMessage: {
          title: '',
          text: '',
          author: '',
          date: '',
          sortKey: '',
          parent: 0,
        },
        dbName: 'nfa_message',
        sortBy: 'sortKey',
        perPage: 10,
        currentPage: 1,
        itemsView: [],
        newParentNum: 0,
        items: [
          {
            parentNum: 9999, text: 'Fred', author: 'Flintstone', date: '2021-4-31-02:02', parent: 1,
            sortKey: '9999-2021-4-31-02:02-2021-4-31-02:02', title: 'test'
          },
          {
            parentNum: 999999, text: 'Wilma', author: 'Flintstone', date: '2021-5-31-02:02', parent: 0,
            sortKey: '9999-2021-4-31-02:02-2021-5-31-02:02', title: 'test'
          },
        ],
        modalMessageRoot: '',
        fields: [
          'message',
        ]
      }
    },
    watch: {
      items: {
        deep: true,
        immediate: true,
        handler() {
          console.log(this.items)
          this.setItemsView()
        },
      }
    },
    computed: {
      rowNumber() {
        return this.items.length
      },
      stateTitle() {
        return (this.newMessage.title.length >= 3)
      },
      stateText() {
        return (this.newMessage.text.length >= 3)
      },
    },
    mounted() {
   //   this.getMessageFromCloudant().then(docs => {
   //     this.items = JSON.parse(JSON.stringify(docs))
   //   })
    },
    methods: {
      getMessageFromCloudant(){
        let promise = new Promise(async (resolve, reject) => {
          const db = new PouchDB(this.$store.state.cloudantUrl + '/' + this.dbName)
          db.allDocs({include_docs: true}).then(function (docs) {
            const res = docs.rows.map(item => {
              return item.doc
            })
            resolve(res)
          }).catch(function (err) {
            console.log('error in getFctList')
            reject(err)
          })
        })
        return promise
      },
      setItemsView() {
        this.itemsView = JSON.parse(JSON.stringify(this.items))
        this.newParentNum = this.items.reduce((accumulator, currentValue) => {
          return Math.min(Number(currentValue.parentNum), accumulator)
        }, 999999)
        this.newParentNum--
        if (this.newParentNum === 999998){
          this.newParentNum = 10000
        }
      },
      saveMessage() {
        this.items.push(JSON.parse(JSON.stringify(this.newMessage)))
        this.newMessage._id = this.getNow() + String(Math.floor(Math.random() * 100))
        const db = new PouchDB(this.$store.state.cloudantUrl + '/' + this.dbName)
        pouchPutNewDoc(db, this.newMessage).catch(err => {
          throw err
        })
        this.cancelModal()
      },
      cancelModal() {
        this.$bvModal.hide("input-modal")
      },
      getNow() {
        const today = new Date()
        return [
          today.getUTCFullYear(),
          today.getUTCMonth() + 1,
          today.getUTCDate(),
          ('00' + today.getUTCHours()).slice(-2) + ':' +
          ('00' + today.getUTCMinutes()).slice(-2),
          ('00' + today.getUTCSeconds()).slice(-2),
          'GTM'
        ].join('-')
      },
      openModal(val) {
        this.modalMessageRoot = val.mes
        const saveTime = this.getNow()
        if (val.parent === 0) {
          this.newMessage.title = 'Re:' + val.title
          this.newMessage.parent = 0
          this.newMessage.parentNum = 999999
          this.newMessage.sortKey = val.parentDate + '-' + saveTime
        } else {
          this.newMessage.title = ''
          this.newMessage.parent = 1
          this.newMessage.parentNum = this.newParentNum
          this.newMessage.sortKey = this.newParentNum + '-' + saveTime + '-' + saveTime
        }
        this.$store.dispatch('setNow')
        this.newMessage.date = this.getNow()
        this.newMessage.author = this.$store.state.user.name
        this.newMessage.text = ""

        this.$bvModal.show("input-modal")
      }
    }
  }
</script>
