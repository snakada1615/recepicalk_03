import {mount, createLocalVue} from '@vue/test-utils';
import {describe, expect, it} from "@jest/globals";
import BootstrapVue from 'bootstrap-vue'
import FctTableModal2 from "@/components/organisms/FctTableModal2";

const localVue = createLocalVue();
localVue.use(BootstrapVue)

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

const myMenu = [
  {
    Carbohydrate: "99.9",
    En: "99",
    Fe: "9.9",
    Fat: "0.9",
    Name: "YamYam",
    Pr: "3.9",
    Va: "",
    Group: "Grains, roots and tubers",
    food_grp_id: "2",
    id: "106",
    Wt: 128,
    menuName: "breakfast"
  },
]

const modalFlag = false

const portionList = [
  {
    'FCT_id': '1043',
    'id': '1',
    'count_method': 'small cup',
    'unit_weight': 50,
  },
  {
    'FCT_id': '4156',
    'id': '2',
    'count_method': 'small',
    'unit_weight': 20,
  },
  {
    'FCT_id': '4156',
    'id': '3',
    'count_method': 'medium',
    'unit_weight': 50,
  }
]


describe('FctTableModal2', () => {
  it("fctTable", async () => {
    const wrapperOrg = mount(FctTableModal2, {
      localVue,
      propsData: {
        'items': items,
        'showModal' : modalFlag,
        'menuCases' : myMenu,
        'portionUnits' : portionList,
        'myName' : 'shunModal',
      }
    })
    const modal = wrapperOrg.findComponent({ name: 'BModal'})

    //表示されていないことを確認
    expect(modal.props('visible')).toBe(false)

    //表示させる
    await wrapperOrg.setProps({showModal: true})

    //表示されていることを確認
    expect(modal.props('visible')).toBe(true)
  })
})


