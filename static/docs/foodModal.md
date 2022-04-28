# foodModal

## Props

| Name                    | Type      | Description                                                                                                                                                                                       | Default    |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `items` *required*      | `Array`   | modalに表示するデータarray of object、     構造は以下     [{     En: "315",     Fe: "1.9",     Pr: "3.4",     Va: "",     Name: "Yam tuber, flour",     Group: "Grains, roots and tubers",     id:"5221"     }] | `() => []` |
| `v-model` *required*    | `Number`  | itemに対応したweightの値                                                                                                                                                                                 | `0`        |
| `my-name` *required*    | `String`  | modalのID                                                                                                                                                                                          |            |
| `my-modal-header`       | `String`  | modalのタイトル                                                                                                                                                                                        |            |
| `max-weight`            | `Number`  | 入力するWeightの最大値を指定                                                                                                                                                                                 | `1000`     |
| `my-type`               | `String`  | 入力値の型を指定                                                                                                                                                                                          | `"Number"` |
| `show-modal` *required* | `Boolean` | モーダルの表示用トリガー                                                                                                                                                                                      | `false`    |

## Data

| Name     | Type    | Description | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields` | `array` |             | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: true, thStyle: {width: "290px"}}, {key: 'Group', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'En', sortable: true, thStyle: {width: "50px"}}, {key: 'Pr', sortable: true, thStyle: {width: "50px"}}, {key: 'Va', sortable: true, thStyle: {width: "50px"}}, {key: 'Fe', sortable: true, thStyle: {width: "50px"}}, ]` |

## Computed Properties

| Name                | Type      | Description                            |
| ------------------- | --------- | -------------------------------------- |
| `inputName`         | `object`  | **Dependencies:** `myName`             |
| `inputState`        | `boolean` | **Dependencies:** `value`, `maxWeight` |
| `showModalComputed` | `unknown` | **Dependencies:** `showModal`          |

## Events

| Name               | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `update:showModal` | <br/>**Arguments**<br/><ul><li>**`val: unknown`**</li></ul>       |
| `modalOk`          | <br/>**Arguments**<br/><ul><li>**`this.items[0]: any`**</li></ul> |
| `modalCancel`      |                                                                   |
| `input`            | &nbsp;                                                            |

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

