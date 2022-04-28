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
    const wrapperOrg = mount(foodModal, {
      localVue,
      propsData: {
        value: value,
        myName: myName,
        items: items,
        showModal: false
      }
    })

    const modal = wrapperOrg.findComponent({ name: 'BModal'})
    const Table = wrapperOrg.findComponent({ name: 'BTable' });

    //表示されていないことを確認
    expect(modal.props('visible')).toBe(false)

    //表示させる
    await wrapperOrg.setProps({showModal: true})

    //表示されていることを確認
    expect(modal.props('visible')).toBe(true)

    //表示内容を確認
    expect(Table.html()).not.toMatch(/Yam tuber, flour/)

    //表示内容を更新
    await wrapperOrg.setProps({items: JSON.parse(JSON.stringify(items2))})
    await wrapperOrg.setProps({value: 30})
    //表示内容を確認
    expect(Table.html()).toMatch(/Yam tuber, flour/)

    //Okボタンをクリック
    await wrapperOrg.findAllComponents('button').at(1).trigger('click')

    //emitを確認(setPropsで30を代入している)
    expect(wrapperOrg.emitted('modalOk')[0][0].Wt).toBe(30)
    expect(wrapperOrg.emitted('update:showModal')[0][0]).toBe(false)
    await wrapperOrg.setProps({showModal: false})

    //表示されていないことを確認
    expect(modal.props('visible')).toBe(false)

    //再度表示させる
    await wrapperOrg.setProps({showModal: true})
    expect(modal.props('visible')).toBe(true)
    //表示内容を確認
    expect(Table.html()).toMatch(/Yam tuber, flour/)

    //今度はCancelボタンをクリック
    await wrapperOrg.findAllComponents('button').at(0).trigger('click')
    //console.log(wrapperOrg.html())

    //emitを確認(false)
    //console.log(wrapperOrg.emitted())
    //expect(wrapperOrg.emitted('modalCancel')).toBe(false)
  })
})


