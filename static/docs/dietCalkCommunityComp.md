# dietCalkCommunityComp

4つのコンポーネントを組み合わせて必要な作物の量を計算する
1. driSelectModa\
対象グループの選択→栄養必要量の決定
2. FctTableModal\
利用する品目の選択→栄養供給量の決定
3. recepiTable\
選択された品目一覧を示す
4. nutritionBar\
栄養素の充足状況をバーチャートで示す

## Props

| Name                  | Type     | Description                     |
| --------------------- | -------- | ------------------------------- |
| `my-app` *required*   | `Object` | データ本体。myAppWatcherで読み込んでページ内で利用 |
| `page-id` *required*  | `Number` | 複数インスタンスを作成する場合のindex           |
| `max-page` *required* | `Number` | 作成するページ数                        |

## Data

| Name                     | Type      | Description                                                                                               | Initial value                                                                                                                              |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `targetSufficicncy`      | `number`  | 栄養素充足率のターゲット                                                                                              | `100`                                                                                                                                      |
| `nutrientTarget`         | `string`  | リストボックスで選択された重要な栄養素                                                                                       | `""`                                                                                                                                       |
| `myAppWatcher`           | `object`  | 使用する全変数のobject myAppから読み込んでこのページで利用。更新された時にemitを返す                                                        | `{}`                                                                                                                                       |
| `nutritionSupplyWatcher` | `array`   | prodTargetテーブルから計算される栄養供給量の合計値 prodTargetCases[].prodTargetから読み込んでこのページで利用。参照専用                           | `[]`                                                                                                                                       |
| `nutritionDemandWatcher` | `object`  | prodTargetテーブルから計算される栄養供給目標の合計値 nutritionDemandから読み込んでこのページで利用。参照専用                                       | `{}`                                                                                                                                       |
| `rating`                 | `array`   | nutritionBar用のレーティング nutritionDemandWatcher または nutritionSupplyWatcher が変化した際に、更新された値に基づいて栄養素ごとのratingを計算 | `[]`                                                                                                                                       |
| `nutritionLabel`         | `array`   | nutritionBar用のproperty：栄養素表示用のlabel                                                                       | `['En', 'Pr', 'Va', 'Fe']`                                                                                                                 |
| `maxRating`              | `number`  | nutritionBar用のproperty：ratingの最大値                                                                         | `10`                                                                                                                                       |
| `maxPopulation`          | `number`  | ターゲットの1グループあたり設定人数の最大値                                                                                    | `1000000`                                                                                                                                  |
| `showDriSelect`          | `boolean` | driSelectAll表示用のフラグ                                                                                       | `false`                                                                                                                                    |
| `showFct`                | `boolean` | fctTableModal表示用のフラグ                                                                                      | `false`                                                                                                                                    |
| `pageMemo`               | `string`  | 各ページの捕捉情報                                                                                                 | `""`                                                                                                                                       |
| `fieldDRI`               | `array`   | ターゲットグループの表示用のフィールド定義                                                                                     | `[ {key: 'id', sortable: true, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: false}, {key: 'number', sortable: false}, ]` |

## Computed Properties

| Name             | Type      | Description                                                  |
| ---------------- | --------- | ------------------------------------------------------------ |
| `driItem`        | `unknown` | driTableをStoreから抽出したもの<br/>**Dependencies:** `myApp`         |
| `pageIdComputed` | `unknown` | 現在のページ番号<br/>**Dependencies:** `pageId`                      |
| `pageOptions`    | `unknown` | 全ページ数<br/>**Dependencies:** `maxPage`                        |
| `noteInputState` | `object`  | noteの記入状態<br/>**Dependencies:** `pageMemo`, `pageIdComputed` |

## Events

| Name            | Description                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `update:pageId` | <br/>**Arguments**<br/><ul><li>**`newVal: unknown`**</li></ul>                                                       |
| `update:myApp`  | 更新されたmyAppをemit<br/>**Arguments**<br/><ul><li>**`JSON.parse(JSON.stringify(this.myAppWatcher)): unknown`**</li></ul> |

## Methods

### updatePageMemo()

ページメモの更新：

**Syntax**

```typescript
updatePageMemo(newVal: unknown): void
```

### updateNutrientTarget()

栄養目標（nutrientTarget）の更新：

**Syntax**

```typescript
updateNutrientTarget(newVal: unknown): void
```

### initShare()

充足率shareを取得(値が初期化されていない場合があるので)

**Syntax**

```typescript
initShare(val: unknown): number
```

### initTarget()

**Syntax**

```typescript
initTarget(val: unknown): string
```

### updateShare()

栄養素充足目標（share）の更新：

**Syntax**

```typescript
updateShare(newVal: unknown): void
```

### nutritionDemandGetter()

myApp.prodTargetCases.targetの値を集計してnutritionDemandWatcherに代入するための関数

**Syntax**

```typescript
nutritionDemandGetter(): *[]
```

**Return value**

栄養素必要量の合計値

### nutritionSupplyGetter()

myApp.prodTargetCases.prodTargetの値を集計してnutritionSupplyWatcherに代入するための関数

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

### setQuantity()

栄養必要量、栄養供給量から必要な作物位の生産量を計算する

**Syntax**

```typescript
setQuantity(nutrientsDemand: unknown, nutrientsSupply: unknown, keyNutrient: unknown, share: unknown): number | number
```

### updateDemand()

ユーザーによりtergetが変更された際に、栄養素必要量合計を再計算してemit

**Syntax**

```typescript
updateDemand(val: unknown): void
```

**Parameters**

- `val: unknown`<br/>
  更新されたグループ構成

### onFctClick()

ユーザーによりfctTableがクリックされた時に行の内容を組み込んで
newProdTargetを更新してemit

**Syntax**

```typescript
onFctClick(val: unknown): void
```

### deleteSupply()

prodTargetが削除された際に、栄養素供給量合計を再計算してemit

**Syntax**

```typescript
deleteSupply(val: unknown): void
```

**Parameters**

- `val: unknown`<br/>
  更新されたprodTarget

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
  各グループの対象人数のリスト

**Return value**

DRIの一覧表×対象人数

### setDigit()

数字の桁数を３桁に自動調整し、単位を追記して返す

**Syntax**

```typescript
setDigit(val: unknown, unitKey: unknown): string
```

### toggleFctDri()

fctとdriの表示調整

**Syntax**

```typescript
toggleFctDri(): void
```

