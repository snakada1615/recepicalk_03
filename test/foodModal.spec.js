import {mount, createLocalVue} from '@vue/test-utils';
import {describe, expect, it} from "@jest/globals";
import foodModal from '@/components/molecules/foodModal.vue';
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue();
localVue.use(BootstrapVue)

const value = 0
const myName = 'modal01'
const items =[]
const items2 = [
  {
    Carbohydrate: "67.9",
    En: "315",
    Fe: "1.9",
    Fat: "0.4",
    Food_grp: "Starchy roots, tubers and their products",
    Name: "Yam tuber, flour",
    Pr: "3.4",
    Va: "",
    Group: "Grains, roots and tubers",
    food_grp_id: "2",
    id: "110",
  },
]

describe('foodModal', () => {
  it("foodModal", async () => {
    let wrapperOrg = mount(foodModal, {
      localVue,
      propsData: {
        value: value,
        myName: myName,
        items: items,
        showModal: false
      }
    })

    const modal = wrapperOrg.findComponent({name: 'BModal'})
    //表示されていないことを確認
    expect(modal.props('visible')).toBe(false)

    //表示させる
    await wrapperOrg.setProps({showModal: true})
    //表示内容を更新
    console.log(modal.html())

    //表示されていることを確認
    expect(modal.props('visible')).toBe(true)

    //表示内容を更新
   await wrapperOrg.setProps({items: JSON.parse(JSON.stringify(items2))})
    console.log(wrapperOrg.html())

  })
})


