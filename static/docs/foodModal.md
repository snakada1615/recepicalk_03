# foodModal

## Props

| Name                       | Type      | Description                                                                                                                                                                                       | Default    |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `items` *required*         | `Array`   | modalに表示するデータarray of object、     構造は以下     [{     En: "315",     Fe: "1.9",     Pr: "3.4",     Va: "",     Name: "Yam tuber, flour",     Group: "Grains, roots and tubers",     id:"5221"     }] |            |
| `portion-units` *required* | `Array`   | portion換算用の変換表                                                                                                                                                                                    |            |
| `v-model` *required*       | `Number`  | itemに対応したweightの値                                                                                                                                                                                 |            |
| `menu-name` *required*     | `String`  | 当該作物がどのメニューの材料に含まれているのか記載                                                                                                                                                                         |            |
| `my-name` *required*       | `String`  | modalのID                                                                                                                                                                                          |            |
| `my-modal-header`          | `String`  | modalのタイトル                                                                                                                                                                                        |            |
| `max-weight`               | `Number`  | 入力するWeightの最大値を指定                                                                                                                                                                                 | `1000`     |
| `my-type`                  | `String`  | 入力値の型を指定                                                                                                                                                                                          | `"Number"` |
| `show-modal` *required*    | `Boolean` | モーダルの表示用トリガー                                                                                                                                                                                      | `false`    |

## Data

| Name         | Type     | Description | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `myMenuName` | `string` |             | `""`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `selected`   | `string` |             | `""`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `fields`     | `array`  |             | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: true, thStyle: {width: "290px"}}, {key: 'Group', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'En', sortable: true, thStyle: {width: "50px"}}, {key: 'Pr', sortable: true, thStyle: {width: "50px"}}, {key: 'Va', sortable: true, thStyle: {width: "50px"}}, {key: 'Fe', sortable: true, thStyle: {width: "50px"}}, ]` |

## Computed Properties

| Name                | Type      | Description                                  |
| ------------------- | --------- | -------------------------------------------- |
| `portionList`       | `unknown` | **Dependencies:** `portionUnits`             |
| `portionSelected`   | `unknown` |                                              |
| `inputName`         | `object`  | **Dependencies:** `myName`                   |
| `inputState`        | `boolean` | **Dependencies:** `value`, `maxWeight`       |
| `menuNameState`     | `object`  | **Dependencies:** `menuName`                 |
| `showModalComputed` | `unknown` | **Dependencies:** `showModal`                |
| `portionValue`      | `unknown` | **Dependencies:** `portionSelected`, `value` |

## Events

| Name               | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `update:showModal` | <br/>**Arguments**<br/><ul><li>**`val: unknown`**</li></ul>        |
| `update:value`     | <br/>**Arguments**<br/><ul><li>**`Number(res): Number`**</li></ul> |
| `modalOk`          | <br/>**Arguments**<br/><ul><li>**`this.items[0]: any`**</li></ul>  |
| `modalCancel`      |                                                                    |
| `update:menuName`  | &nbsp;                                                             |

## Methods

### setDigit()

...

**Syntax**

```typescript
setDigit(item: unknown, unitKey: unknown): unknown
```

### clickOk()

テーブル内の要素（items）と入力されたWtを一つのObjectに合成して返す

**Syntax**

```typescript
clickOk(): void
```

### clickCancel()

**Syntax**

```typescript
clickCancel(): void
```

