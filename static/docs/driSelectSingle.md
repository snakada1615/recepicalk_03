# driSelectSingle

対象となる年齢、性別を選択することで、当該グループの栄養必要量をemit
人数は常に1人

## Props

| Name                   | Type    | Description             |
| ---------------------- | ------- | ----------------------- |
| `target` *required*    | `Array` | value: null,            |
| `dri-items` *required* | `Array` | list of DRI information |

## Data

| Name          | Type     | Description                   | Initial value                                                          |
| ------------- | -------- | ----------------------------- | ---------------------------------------------------------------------- |
| `fields1`     | `array`  | 栄養必要量を表示するテーブルのフィールド設定        | `[ {key: 'Item', sortable: false}, {key: 'Value', sortable: false}, ]` |
| `targetGroup` | `number` | リストボックスで選択された番号               | `0`                                                                    |
| `tableDri`    | `array`  | targetGroupの値に基づいて計算された栄養素必要量 | `[]`                                                                   |

## Computed Properties

| Name      | Type      | Description                                       |
| --------- | --------- | ------------------------------------------------- |
| `options` | `unknown` | dri一覧を表示用に整形したもの<br/>**Dependencies:** `driItems` |

## Events

| Name                   | Description                                                                                                                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `changeNutritionValue` | 必要栄養量の更新を親コンポーネントに通知\<br/>**Arguments**<br/><ul><li>**`{total: res2, target: this.target}: object`**</li></ul>                                                                                                                                  |
| `update:target`        | <br/>**Arguments**<br/><ul><li>**`this.driItems.map(function (dat) {         let count = 0         if (Number(dat.id) === Number(val)) {           count = 1         }         return {id: dat.id, count: count}       }): unknown`**</li></ul> |

## Methods

### updateAllTable()

targetプロパティの更新時に内部変数 (targetGroup, tablePop,
tableDri)を更新

**Syntax**

```typescript
updateAllTable(): void
```

### updateTableDri()

DRIのテーブル（合計値）を更新

**Syntax**

```typescript
updateTableDri(dat: unknown): [{Item: string, Value: string},
    {Item: string, Value: (number | * | number)},
    {Item: string, Value: (number | * | number)},
    {Item: string, Value: (number | * | number)},
    {Item: string, Value: (number | * | number)},
    null]
```

**Parameters**

- `dat: unknown`<br/>
  年齢別の栄養素必要量＊人数のテーブル

**Return value**

合計値のテーブル
{Item: string, Value: (number|*|number)},
{Item: string, Value: (number|*|number)},
{Item: string, Value: (number|*|number)},
{Item: string, Value: (number|*|number)},
null]}
合計値のテーブル

### updateTablePop()

DRIの一覧表（年齢別・性別）に各グループの人数を追加して戻す

**Syntax**

```typescript
updateTablePop(driValue: unknown, targetValue: unknown): any
```

**Parameters**

- `driValue: unknown`<br/>
  DRIの一覧表

- `targetValue: unknown`<br/>
  選ばれたグループのid

**Return value**

DRIの一覧表×対象人数

### onSelectionChange()

ユーザーが対象グループを変更した際にトリガー
ユーザー選択の値（Number）をもとにtarget値（Object）を
更新してemitする

**Syntax**

```typescript
onSelectionChange(val: unknown): void
```

### formatNumber()

表示用の整形（１列目と６列目を除いて桁数設定)

**Syntax**

```typescript
formatNumber(val: unknown, index: unknown): string | *
```

