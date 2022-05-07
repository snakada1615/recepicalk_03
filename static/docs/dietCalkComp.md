# dietCalkComp

dietCalkComponent

## Props

| Name                  | Type     | Description                     |
| --------------------- | -------- | ------------------------------- |
| `my-app` *required*   | `Object` | データ本体。myAppWatcherで読み込んでページ内で利用 |
| `page-id` *required*  | `Number` | 複数インスタンスを作成する場合のindex           |
| `max-page` *required* | `Number` | 作成するページ数                        |

## Data

| Name                     | Type      | Description                                                                                               | Initial value              |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| `myAppWatcher`           | `object`  | 使用する全変数のobject myAppから読み込んでこのページで利用。更新された時にemitを返す                                                        | `{}`                       |
| `nutritionSupplyWatcher` | `array`   | menuテーブルから計算される栄養供給量の合計値 menuCases[].menuから読み込んでこのページで利用。参照専用                                             | `[]`                       |
| `nutritionDemandWatcher` | `object`  | menuテーブルから計算される栄養供給目標の合計値 nutritionDemandから読み込んでこのページで利用。参照専用                                             | `{}`                       |
| `rating`                 | `array`   | nutritionBar用のレーティング nutritionDemandWatcher または nutritionSupplyWatcher が変化した際に、更新された値に基づいて栄養素ごとのratingを計算 | `[]`                       |
| `nutritionLabel`         | `array`   | nutritionBar用のproperty：栄養素表示用のlabel                                                                       | `['En', 'Pr', 'Va', 'Fe']` |
| `maxRating`              | `number`  | nutritionBar用のproperty：ratingの最大値                                                                         | `10`                       |
| `maxPopulation`          | `number`  | ターゲットの1グループあたり設定人数の最大値                                                                                    | `10000`                    |
| `driSwitch`              | `boolean` | nutritionBarで評価するmenuを１日分で評価するか、一食分で評価するか判定                                                               | `true`                     |
| `items_modal`            | `array`   | 作物情報を表すobject：作物摂取量の設定ダイアログに渡すproperty                                                                    | `[]`                       |
| `value_model`            | `number`  | 作物摂取量を表す値：作物摂取量の設定ダイアログに渡すproperty                                                                        | `0`                        |
| `showDriSelect`          | `boolean` | driSelectAll表示用のフラグ                                                                                       | `false`                    |
| `showFct`                | `boolean` | fctTableModal表示用のフラグ                                                                                      | `false`                    |
| `showModal`              | `boolean` | modal表示用のフラグ                                                                                              | `false`                    |
| `pageMemo`               | `string`  | 各ページの捕捉情報                                                                                                 | `""`                       |

## Computed Properties

| Name             | Type      | Description                                                                                                                          |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `driRange`       | `unknown` | ratingを計算するにあたって、同一メニューを一日3回食べると仮定した場合の評価、     (recepiTableの値×3)、または1回分が一日の栄養素に与える影響の評価を     切り替える<br/>**Dependencies:** `driSwitch` |
| `pageIdComputed` | `unknown` | 現在のページ番号<br/>**Dependencies:** `pageId`                                                                                              |
| `pageOptions`    | `unknown` | 全ページ数<br/>**Dependencies:** `maxPage`                                                                                                |

## Events

| Name              | Description                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `update:pageId`   | <br/>**Arguments**<br/><ul><li>**`newVal: unknown`**</li></ul>                                                       |
| `update:pageMemo` | 更新されたmyAppをemit<br/>**Arguments**<br/><ul><li>**`JSON.parse(JSON.stringify(this.myAppWatcher)): unknown`**</li></ul> |
| `update:myApp`    | 更新されたmyAppをemit<br/>**Arguments**<br/><ul><li>**`JSON.parse(JSON.stringify(vm.myAppWatcher)): unknown`**</li></ul>   |

## Methods

### updatePageMemo()

ページメモの更新：

**Syntax**

```typescript
updatePageMemo(newVal: unknown): void
```

### nutritionDemandGetter()

myApp.menuCases.targetの値を集計してnutritionDemandWatcherに代入するための関数

**Syntax**

```typescript
nutritionDemandGetter(): *[]
```

**Return value**

栄養素必要量の合計値

### nutritionSupplyGetter()

myApp.menuCases.menuの値を集計してnutritionSupplyWatcherに代入するための関数

**Syntax**

```typescript
nutritionSupplyGetter(): *[]
```

**Return value**

栄養素供給量の合計値

### ratingGetter()

nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出

**Syntax**

```typescript
ratingGetter(): *[]
```

**Return value**

栄養素ごとの充足率

### updateDemand()

ユーザーによりtergetが変更された際に、栄養素必要量合計を再計算してemit

**Syntax**

```typescript
updateDemand(val: unknown): void
```

**Parameters**

- `val: unknown`<br/>
  更新されたグループ構成

### onRecepiClicked()

ユーザーによりrecepiTableがクリックされた際に、行の内容を組み込んでfoodModalを開く

**Syntax**

```typescript
onRecepiClicked(val: unknown): void
```

### onFctClick()

ユーザーによりfctTableがクリックされた時に行の内容を組み込んでfoodModalを開く

**Syntax**

```typescript
onFctClick(val: unknown): void
```

### addSupply()

menuが変更・追加された際に、栄養素供給量合計を再計算してemit
新規なら追加、変更なら更新

**Syntax**

```typescript
addSupply(val: unknown): void
```

**Parameters**

- `val: unknown`<br/>
  更新されたmenu

### deleteSupply()

menuが削除された際に、栄養素供給量合計を再計算してemit

**Syntax**

```typescript
deleteSupply(val: unknown): void
```

**Parameters**

- `val: unknown`<br/>
  更新されたmenu

### toggleFctDri()

fctとdriの表示調整

**Syntax**

```typescript
toggleFctDri(): void
```

