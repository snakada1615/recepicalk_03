import { mount, createLocalVue, createWrapper } from '@vue/test-utils';
import {afterEach, describe, expect, it} from "@jest/globals";
import FctTableModal from '@/components/organisms/FctTableModal.vue'
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue();
localVue.use(BootstrapVue)

const factory = (props) =>{
  return mount(FctTableModal, {
    localVue,
    ...props,
  })
}

const items = [
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
  {
    Carbohydrate: "58.9",
    En: "380",
    Fe: "3.3",
    Fat: "5.9",
    Food_grp: "Legumes and their products",
    Name: "Bambara groundnut, dried ",
    Pr: "20.1",
    Va: "2",
    Group: "Legumes and nuts ",
    food_grp_id: "3",
    id: "111",
  },
  {
    Carbohydrate: "20.3",
    En: "562",
    Fe: "3.7",
    Fat: "43.2",
    Food_grp: "Nuts, seeds and their products",
    Name: "Groundnut, rose",
    Pr: "20.4",
    Va: "0",
    Group: "Legumes and nuts ",
    food_grp_id: "6",
    id: "273",
  }
]


describe('FctTableModal', () =>{
  it("fctTable", async()=>{
    const wrapper=mount(FctTableModal,{
      localVue,
      propsData:{
        items:items,
        myName: 'testModal',
      }
    })
    expect(wrapper.isVueInstance()).toBe(true);

    const rootWrapper = createWrapper(wrapper.vm.$root)
    rootWrapper.$emit('bv::show::modal', 'testModal')

    // イベントが発行されたかどうか
    //expect(rootWrapper.emitted()).toBe(1)
    //expect(rootWrapper.emitted('bv::show::modal')).toBeDefined()
    // イベントの実行回数
    //expect(rootWrapper.emitted('bv::show::modal').length).toBe(1)
    // イベントのペイロードを検証
    //expect(rootWrapper.emitted('bv::show::modal')[0]).toBe(['testModal']);

    console.log(wrapper)
    const modal = wrapper.find('#testModal')
    expect(modal.exists()).toBe(true)
  })
})


