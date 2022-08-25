# FctTable

FCTをpropから読み込んで表示\
*FoodGroup,およびキーワードによってフィルター
*onClickで選択行の情報をemit

## Props

| Name    | Type    | Description            | Default    |
| ------- | ------- | ---------------------- | ---------- |
| `items` | `Array` | FCTの本体。Array of Object | `() => []` |

## Data

| Name          | Type      | Description       | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------- | --------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields`      | `array`   | テーブルに表示するfieldの定義 | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: true, thStyle: {width: "290px"}}, {key: 'En', sortable: true, thStyle: {width: "50px"}}, {key: 'Pr', sortable: true, thStyle: {width: "50px"}}, {key: 'Va', sortable: true, thStyle: {width: "50px"}}, {key: 'Fe', sortable: true, thStyle: {width: "50px"}}, ]` |
| `colWidth`    | `array`   | 各列の表示幅の設定         | `[0, 0, 120, 30, 30, 30, 30]`                                                                                                                                                                                                                                                                                                                                                                                                         |
| `totalRows`   | `number`  | FCTの全ての行数         | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `currentPage` | `number`  | 現在のページ番号          | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `perPage`     | `number`  | 現在表示しているページ番号     | `5`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `pageOptions` | `array`   | 1ページ毎の表示行数        | `[5, 10, 15, {value: 100, text: "Show a lot"}]`                                                                                                                                                                                                                                                                                                                                                                                       |
| `sortBy`      | `string`  | 並べ替えの基準になる行       | `"Name"`                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `sortDesc`    | `boolean` | 並べ替えの順序           | `false`                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `filter`      | `unknown` | フィルターの内容          | `null`                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `filterOn`    | `array`   | フィルター適用のスイッチ      | `['Group', 'Name']`                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Computed Properties

| Name      | Type      | Description                                         |
| --------- | --------- | --------------------------------------------------- |
| `FoodGrp` | `unknown` | FCTに含まれるFood Groupの一覧<br/>**Dependencies:** `items` |

## Events

| Name          | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `fctClick`    | <br/>**Arguments**<br/><ul><li>**`record: unknown`**</li></ul> |
| `fctDblClick` | <br/>**Arguments**<br/><ul><li>**`record: unknown`**</li></ul> |

## Methods

### onFiltered()

フィルターをかけた際の表示行数、ページ数を調整する関数

**Syntax**

```typescript
onFiltered(filteredItems: unknown): void
```

### onInput()

入力されたキーワードに基づいたフィルターの作成

**Syntax**

```typescript
onInput(): void
```

### rowClick()

テーブルの行をクリックした際にその行の情報をemit

**Syntax**

```typescript
rowClick(record: unknown): void
```

### rowDblClick()

テーブルの行をダブルクリックした際にその行の情報をemit

**Syntax**

```typescript
rowDblClick(record: unknown): void
```

