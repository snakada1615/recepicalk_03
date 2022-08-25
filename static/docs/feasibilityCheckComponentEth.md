# feasibilityCheckComponentEth

3つのコンポーネントを組み合わせて特定の品目のfeasibility scoreを算出する
1. FctTableModal - 作物を選択した場合、これに応じた栄養素供給量を返す
2. driSelectSingle - 対象グループを選択した場合、これに応じた栄養素必要量を返す
3. nutritionBar - 上記2つから、栄養素の銃速度をバーチャートで示す

## Props

| Name                        | Type     | Description                        | Default |
| --------------------------- | -------- | ---------------------------------- | ------- |
| `my-family` *required*      | `Object` | データ本体。myFamilyWatcherで読み込んでページ内で利用 |         |
| `my-dri` *required*         | `Array`  |                                    |         |
| `my-fct` *required*         | `Array`  |                                    |         |
| `my-questions` *required*   | `Array`  |                                    |         |
| `page-id`                   | `Number` | 現在のページ番号                           | `1`     |
| `max-page` *required*       | `Number` | 作成するページ数                           |         |
| `current-family` *required* | `String` | 現在の家族名                             | &nbsp;  |

## Data

| Name                 | Type      | Description                                           | Initial value                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | --------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `myFamilyWatcher`    | `object`  | 使用する全変数のobject myFamilyから読み込んでこのページで利用。更新された時にemitを返す | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `ansId`              | `array`   | (カテゴリ、質問ID)の一蘭                                        | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `qaScore`            | `array`   | 質問への回答のカテゴリごとの合計                                      | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `ansListWatcher`     | `array`   | 質問への回答一覧                                              | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `targetGroup`        | `array`   | 対象グループ                                                | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `targetCrop`         | `array`   | 選択された作物                                               | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `cropName`           | `array`   | 選択された作物名                                              | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `itemsFct`           | `array`   | fctの一覧                                                | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `itemsDRI`           | `array`   | driの一覧                                                | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `nutritionDemand`    | `array`   | 栄養摂取目標                                                | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `nutritionSupply`    | `array`   | 栄養供給量                                                 | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `nutritionRatingSet` | `array`   | 栄養素の充足率                                               | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `productionTarget`   | `array`   | 生産量目標Wt                                               | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `pageMemo`           | `string`  | ページメモ                                                 | `""`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `showFct`            | `boolean` | fctTableModal表示用のフラグ                                  | `false`                                                                                                                                                                                                                                                                                                                                                                                                              |
| `share`              | `number`  | 選択された栄養素の充足率（share)                                   | `100`                                                                                                                                                                                                                                                                                                                                                                                                                |
| `qaListDataFrame`    | `array`   | qaListのデータ構造                                          | `[ { categoryID: 1, categoryText: 'Nutrient balance', itemsQA: [] }, { categoryID: 2, categoryText: 'Socioeconomic feasibility', itemsQA: [] }, { categoryID: 3, categoryText: 'Technical feasibility', itemsQA: [] }, { categoryID: 4, categoryText: 'Investment', itemsQA: [] }, { categoryID: 5, categoryText: 'Stability', itemsQA: [] }, { categoryID: 6, categoryText: 'Market opportunity', itemsQA: [] }, ]` |
| `qaList`             | `array`   | 質問と回答一覧                                               | `[]`                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Computed Properties

| Name              | Type      | Description                                                  |
| ----------------- | --------- | ------------------------------------------------------------ |
| `currentCrop`     | `object`  | **Dependencies:** `cropName`, `pageIdComputed`               |
| `qaCategoryCount` | `unknown` | QAリストのカテゴリ数<br/>**Dependencies:** `ansId`                    |
| `pageIdComputed`  | `unknown` | 現在のページ番号<br/>**Dependencies:** `pageId`                      |
| `pageOptions`     | `unknown` | 全ページ数<br/>**Dependencies:** `maxPage`, `cropName`            |
| `noteInputState`  | `object`  | noteの記入状態<br/>**Dependencies:** `pageMemo`, `pageIdComputed` |

## Events

| Name              | Description                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `update:myFamily` | 更新されたmyFamilyをemit<br/>**Arguments**<br/><ul><li>**`JSON.parse(JSON.stringify(this.myFamilyWatcher)): unknown`**</li></ul> |
| `update:pageId`   | <br/>**Arguments**<br/><ul><li>**`newVal: unknown`**</li></ul>                                                             |

## Methods

### setDigit()

数字の桁数を３桁に自動調整し、単位を追記して返す

**Syntax**

```typescript
setDigit(val: unknown, unitKey: unknown): string
```

### updateAnsList()

ansListをmyFamilyから読み込んでwatch

**Syntax**

```typescript
updateAnsList(): any[]
```

### updateTargetCrop()

targetCropをmyFamilyから読み込んでwatch

**Syntax**

```typescript
updateTargetCrop(myFamily: unknown): any[]
```

### updateTargetGroup()

targetGroupをmyFamilyから読み込んでwatch

**Syntax**

```typescript
updateTargetGroup(member: unknown, maxPage: unknown): any[]
```

### updateScore()

ansListをmyFamilyから読み込んでscoreに変換

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

### updateNutritionRating()

栄養摂取目標と栄養供給量から栄養スコアを計算

**Syntax**

```typescript
updateNutritionRating(nutritionDemand: unknown, nutritionSupply: unknown, weight: unknown): [{name: string, rating: (number | number), nameId: string, supply: (number | number), target: (number | number)},{name: string, rating: (number | number), nameId: string, supply: (number | number), target: (number | number)},{name: string, rating: (number | number), nameId: string, supply: (number | number), target: (number | number)},{name: string, rating: (number | number), nameId: string, supply: (number | number), target: (number | number)}]
```

### updatePageMemo()

ページメモの更新：

**Syntax**

```typescript
updatePageMemo(newVal: unknown): void
```

### updateProductionTarget()

demand, supply, share, indexからターゲット生産量を計算して返す

**Syntax**

```typescript
updateProductionTarget(share: unknown, demand: unknown, supply: unknown, target: unknown): unknown
```

**Return value**

{{share: number, Wt365: number, Wt: number}|{share, Wt365: number, Wt: *}}

### updateShare()

shareの更新をmyFamilyに組み込んでemitで通知
栄養素充足目標（share）の更新：

**Syntax**

```typescript
updateShare(newVal: unknown, index: unknown): void
```

### onItemSelected()

cropの選択の変更をmyFamilyに組み込んでemitで通知

**Syntax**

```typescript
async onItemSelected(value: unknown): Promise
```

### onAnsChanged()

Ansの更新をmyFamilyに組み込んでemitで通知

**Syntax**

```typescript
onAnsChanged(dat: unknown): void
```

### showDialogue()

fctダイアログのトリガー

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

