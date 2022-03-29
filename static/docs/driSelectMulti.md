# driSelectMulti

## Props

| Name         | Type      | Description                                                                                                                                                                                                                | Default                     |
| ------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `target`     | `Array`   | ターゲットグループの構成：v-modelで使用  [{ id: 1, count: 1}, { id: 2, count: 5}, { id: 3, count: 0}]                                                                                                                                      | `() => [{id: 0, count: 1}]` |
| `items`      | `Array`   | driのデータセット   ex.          [{            En: "1088.0",            Fe: "5.8",            max_vol: "900",            Name: "child 6-23 month",            Pr: "11.65",            Va: "400.0",            id: 0           }], | `() => []`                  |
| `max`        | `Number`  | target.countの上限値                                                                                                                                                                                                           | `1000000`                   |
| `input-name` | `unknown` |                                                                                                                                                                                                                            | &nbsp;                      |

## Data

| Name            | Type     | Description | Initial value                                                                                                                              |
| --------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `fieldDRI`      | `array`  |             | `[ {key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: false}, {key: 'number', sortable: false}, ]` |
| `sortBy`        | `string` |             | `"id"`                                                                                                                                     |
| `fieldTableDri` | `array`  |             | `[ {key: 'Item', sortable: false}, {key: 'Value', sortable: false}, ]`                                                                     |
| `tablePop`      | `array`  |             | `[]`                                                                                                                                       |
| `tableDri`      | `array`  |             | `[]`                                                                                                                                       |

## Events

| Name                   | Description                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `changeNutritionValue` | 必要栄養量の更新を親コンポーネントに通知<br/>**Arguments**<br/><ul><li>**`{total: this.tableDri, target: this.target}: object`**</li></ul> |
| `update:target`        | &nbsp;                                                                                                                 |

## Methods

### formatNumber()

栄養必要量の表記フォーマット

**Syntax**

```vuejs
formatNumber(val: unknown, index: unknown): string | *
```

**Parameters**

- `val: unknown`<br/>
  変換前の数値

- `index: unknown`<br/>
  変換パターン

**Return value**

戻り値（テキスト）

### statusPopulationNumber()

population入力値のバリデーション

**Syntax**

```typescript
statusPopulationNumber(val: unknown): boolean
```

**Parameters**

- `val: unknown`<br/>
  入力値

**Return value**

バリデーション結果

### updateAllTable()

targetプロパティの更新時に内部変数 (tablePop, tableDri)を更新

**Syntax**

```typescript
updateAllTable(): void
```

### updateTableDri()

DRIのテーブル（合計値）を更新

**Syntax**

```typescript
updateTableDri(dat: unknown): [{Item: string, Value: string},{Item: string, Value: (number | * | number)},{Item: string, Value: (number | * | number)},{Item: string, Value: (number | * | number)},{Item: string, Value: (number | * | number)},null]
```

**Parameters**

- `dat: unknown`<br/>
  年齢別の栄養素必要量＊人数のテーブル

**Return value**

合計値のテーブル
合計値のテーブル

### updateTablePop()

**Syntax**

```typescript
updateTablePop(driValue: unknown, targetValue: unknown): unknown
```

### tablePop2Target()

**Syntax**

```typescript
tablePop2Target(dat: unknown): unknown
```

