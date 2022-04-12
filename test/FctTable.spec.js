import { mount, createLocalVue } from '@vue/test-utils';
import { describe, expect, it} from "@jest/globals";
import FctTable from '@/components/molecules/FctTable.vue'
import BootstrapVue from 'bootstrap-vue'
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


describe('FctTable', () =>{
  it("fctTable", async()=>{
    const wrapperOrg=mount(FctTable,{
      localVue,
      propsData:{
        items:items,
      }
    })
    const wrapper = wrapperOrg.findAllComponents({displayName:'BTable'})

    //BTableの行を取得
    let myRow = wrapper.at(0).findAll('table tbody tr')
    expect(myRow.length).toBe(3)
    //二行目でクリックイベントを発生させる
    await myRow.at(1).trigger('click')
    //二行目だけが選択された状態
    expect(myRow.at(0).attributes('aria-selected')).toBe('false')
    expect(myRow.at(1).attributes('aria-selected')).toBe('true')
    expect(myRow.at(2).attributes('aria-selected')).toBe('false')
    expect(wrapperOrg.emitted('fctClick')[0][0].Name).toBe('Groundnut, rose')
  })
})


