# feasibilityCheckComponent

3つのコンポーネントを組み合わせて特定の品目のfeasibility scoreを算出する
1. FctTableModal - 作物を選択した場合、これに応じた栄養素供給量を返す
2. driSelectSingle - 対象グループを選択した場合、これに応じた栄養素必要量を返す
3. nutritionBar - 上記2つから、栄養素の銃速度をバーチャートで示す

## Props

| Name                  | Type     | Description                     | Default |
| --------------------- | -------- | ------------------------------- | ------- |
| `my-app` *required*   | `Object` | データ本体。myAppWatcherで読み込んでページ内で利用 |         |
| `page-id`             | `Number` | 現在のページ番号                        | `1`     |
| `max-page` *required* | `Number` | 作成するページ数                        | &nbsp;  |

## Data

| Name                 | Type      | Description                                        | Initial value                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | --------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `myAppWatcher`       | `object`  | 使用する全変数のobject myAppから読み込んでこのページで利用。更新された時にemitを返す | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `ansId`              | `array`   | (カテゴリ、質問ID)の一蘭                                     | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `qaScore`            | `array`   | 質問への回答のカテゴリごとの合計                                   | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `ansListWatcher`     | `array`   | 質問への回答一覧                                           | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `targetGroup`        | `array`   | 対象グループ                                             | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `targetCrop`         | `array`   | 選択された作物                                            | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `cropName`           | `array`   | 選択された作物名                                           | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `items`              | `array`   | fctの一覧                                             | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `itemsDRI`           | `array`   | driの一覧                                             | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `nutritionDemand`    | `array`   | 栄養摂取目標                                             | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `nutritionSum`       | `array`   | 栄養供給量                                              | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `nutritionRatingSet` | `array`   | 栄養素の充足率                                            | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `pageMemo`           | `string`  | ページメモ                                              | `""`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `showFct`            | `boolean` | fctTableModal表示用のフラグ                               | `false`                                                                                                                                                                                                                                                                                                                                                                                                              |
| `portionSize`        | `number`  | 選択された食品の重量（portion size)                           | `100`                                                                                                                                                                                                                                                                                                                                                                                                                |
| `qaListDataFrame`    | `array`   | qaListのデータ構造                                       | `[ { categoryID: 1, categoryText: 'Nutrient balance', itemsQA: [] }, { categoryID: 2, categoryText: 'Socioeconomic feasibility', itemsQA: [] }, { categoryID: 3, categoryText: 'Technical feasibility', itemsQA: [] }, { categoryID: 4, categoryText: 'Investment', itemsQA: [] }, { categoryID: 5, categoryText: 'Stability', itemsQA: [] }, { categoryID: 6, categoryText: 'Market opportunity', itemsQA: [] }, ]` |
| `qaList`             | `array`   | 質問と回答一覧                                            | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Computed Properties

| Name              | Type      | Description                                                  |
| ----------------- | --------- | ------------------------------------------------------------ |
| `qaCategoryCount` | `unknown` | QAリストのカテゴリ数<br/>**Dependencies:** `ansId`                    |
| `pageIdComputed`  | `unknown` | 現在のページ番号<br/>**Dependencies:** `pageId`                      |
| `pageOptions`     | `unknown` | 全ページ数<br/>**Dependencies:** `maxPage`                        |
| `noteInputState`  | `object`  | noteの記入状態<br/>**Dependencies:** `pageMemo`, `pageIdComputed` |

## Events

| Name            | Description                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `update:myApp`  | 更新されたmyAppをemit<br/>**Arguments**<br/><ul><li>**`JSON.parse(JSON.stringify(this.myAppWatcher)): unknown`**</li></ul> |
| `update:pageId` | <br/>**Arguments**<br/><ul><li>**`newVal: unknown`**</li></ul>                                                       |

## Methods

### onNoteChange()

**Syntax**

```typescript
onNoteChange(val: unknown): void
```

### updateAnsList()

ansListをmyAppから読み込んでwatch

**Syntax**

```typescript
updateAnsList(): any[]
```

### updateTargetCrop()

targetCropをmyAppから読み込んでwatch

**Syntax**

```typescript
updateTargetCrop(): any[]
```

### updateTargetGroup()

targetGroupをmyAppから読み込んでwatch

**Syntax**

```typescript
updateTargetGroup(): any[]
```

### updateNutrition()

targetGroupの更新に伴い栄養摂取目標を更新

**Syntax**

```typescript
updateNutrition(val: unknown): void
```

### updateScore()

ansListをmyAppから読み込んでscoreに変換

**Syntax**

```typescript
updateScore(): *[]
```

### updateAnsId()

QAのカテゴリとIDをセットにしてArrayに追加（カテゴリ事の集計に用いる）

**Syntax**

```typescript
updateAnsId(): *[]
```

### updateNutritionSupply()

選択された作物から栄養供給量を計算

**Syntax**

```typescript
updateNutritionSupply(crops: unknown): any
```

### updateNutritionDemand()

targetグループから栄養摂取目標を計算

**Syntax**

```typescript
updateNutritionDemand(targetGroup: unknown, dri: unknown): any
```

### updateNutritionRating()

栄養摂取目標と栄養供給量から栄養スコアを計算

**Syntax**

```typescript
updateNutritionRating(nutritionDemand: unknown, nutritionSupply: unknown): unknown
```

### updatePageMemo()

ページメモの更新：

**Syntax**

```typescript
updatePageMemo(newVal: unknown): void
```

### onTargetGroupChanged()

targetGroupの更新をmyAppに組み込んでemitで通知

**Syntax**

```typescript
onTargetGroupChanged(val: unknown): void
```

### onPortionSizeChanged()

portionSizeの更新をmyAppに組み込んでemitで通知

**Syntax**

```typescript
onPortionSizeChanged(val: unknown): void
```

### onItemSelected()

cropの選択の変更をmyAppに組み込んでemitで通知

**Syntax**

```typescript
onItemSelected(value: unknown): void
```

### onAnsChanged()

Ansの更新をmyAppに組み込んでemitで通知

**Syntax**

```typescript
onAnsChanged(dat: unknown): void
```

### showDialogue()

**Syntax**

```typescript
showDialogue(): void
```

### summarizeQA()

カテゴリ毎のスコアを集計して戻す

**Syntax**

```typescript
summarizeQA(keys: unknown, dat: unknown): any[]
```

**Parameters**

- `keys: unknown`<br/>
  カテゴリとQA_idのペア

- `dat: unknown`<br/>
  ansList[pageId]

