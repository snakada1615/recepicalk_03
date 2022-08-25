# recepiTable

選択された品目一覧を表示するテーブル
横幅がタブレット以上の場合には料理名を表示、スマホの場合は材料名のみ表示

## Props

| Name               | Type     | Description       | Default |
| ------------------ | -------- | ----------------- | ------- |
| `items` *required* | `Array`  | 食品名及び栄養成分の一覧を含む配列 |         |
| `dummy-draw-flag`  | `Number` |                   | `0`     |

## Data

| Name           | Type     | Description              | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `nutritionSum` | `object` | itemに含まれる全ての作物の栄養成分の合計値  | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `itemWeighted` | `array`  | itemの各要素にweightを掛け合わせたもの | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `fields`       | `array`  | テーブルのフィールド毎の書式設定         | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'}, {key: 'menuName', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Name', sortable: true}, {key: 'En', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Pr', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Va', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Fe', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Wt', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, ]` |

## Events

| Name           | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `totalChanged` | <br/>**Arguments**<br/><ul><li>**`nutritionSum: object`**</li></ul> |
| `rowClick`     | <br/>**Arguments**<br/><ul><li>**`record: unknown`**</li></ul>      |
| `itemDeleted`  | <br/>**Arguments**<br/><ul><li>**`[]: array`**</li></ul>            |

## Methods

### setDigit()

各栄養素の値の表示用に、桁数を調整

**Syntax**

```typescript
setDigit(item: unknown, unitKey: unknown): string
```

### updateSum()

itemの各要素の値から合計値を計算

**Syntax**

```typescript
updateSum(array: unknown): any
```

### updateItemWeight()

itemの各要素の値に重量を掛け合わせる

**Syntax**

```typescript
updateItemWeight(array: unknown): unknown
```

### onInput()

itemの構成が変わるたびに、合計値をemit

**Syntax**

```typescript
onInput(): void
```

### rowClick()

テーブルの特定行がクリックされた場合、当該行の内容をemit

**Syntax**

```typescript
rowClick(record: unknown): void
```

### delClick()

特定行の×ボタンをクリックした場合に、当該行を削除

**Syntax**

```typescript
delClick(id: unknown): void
```

