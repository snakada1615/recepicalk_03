# summaryDietEth

## Props

| Name                | Type     | Description |
| ------------------- | -------- | ----------- |
| `my-app` *required* | `Object` | &nbsp;      |

## Data

| Name                 | Type     | Description                         | Initial value                                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | -------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `myChartOptions`     | `object` | pie-chartのオプション                     | `{"maintainAspectRatio":{"type":"boolean","value":false,"raw":"false","member":false},"responsive":{"type":"boolean","value":true,"raw":"true","member":false}}`                                                                                                                                                                                                            |
| `chartHeight`        | `object` | チャートの基本の高さ                          | `window.innerHeight / 4`                                                                                                                                                                                                                                                                                                                                                    |
| `chartWidth`         | `object` | チャートの基本の幅                           | `window.innerHeight / 4`                                                                                                                                                                                                                                                                                                                                                    |
| `pfcStandard`        | `object` | PFCバランスの推奨値                         | `{"labels":{"type":"array","value":"['protein', 'fat', 'carbo.']","raw":"['protein', 'fat', 'carbo.']","member":false},"datasets":{"type":"array","value":"[ { label: 'Data One', backgroundColor: ['green', 'yellow', 'red'], data: [35, 10, 55] } ]","raw":"[ { label: 'Data One', backgroundColor: ['green', 'yellow', 'red'], data: [35, 10, 55] } ]","member":false}}` |
| `selectedCaseId`     | `number` | 選択されたfeasibilityCase                | `-1`                                                                                                                                                                                                                                                                                                                                                                        |
| `nutritionLabel`     | `array`  | nutritionBar用のproperty：栄養素表示用のlabel | `['En', 'Pr', 'Va', 'Fe']`                                                                                                                                                                                                                                                                                                                                                  |
| `maxRating`          | `number` | nutritionBar用のproperty：ratingの最大値   | `10`                                                                                                                                                                                                                                                                                                                                                                        |
| `pfcBalanceStandard` | `array`  | PFCバランスの推奨値                         | `[ {val: 35, color: 'green', label: '%'}, {val: 10, color: 'yellow', label: '%'}, {val: 55, color: 'red', label: '%'}, ]`                                                                                                                                                                                                                                                   |

## Computed Properties

| Name                      | Type      | Description                                                                                                                           |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `myAppComputed`           | `unknown` | **Dependencies:** `myApp`                                                                                                             |
| `myChartStyles`           | `unknown` | **Dependencies:** `pfcScale`, `chartHeight`                                                                                           |
| `myChartStylesOriginal`   | `object`  | **Dependencies:** `chartHeight`                                                                                                       |
| `pfcScale`                | `unknown` | currentとrecommendを比較した場合のエネルギー量の充足度 rating[].Enの値を1.5と0.5で足切りしたもの<br/>**Dependencies:** `ratingGetter`, `getPfcScale`                 |
| `selectedCase`            | `unknown` | 同一グループのidリスト<br/>**Dependencies:** `selectedCaseId`, `noteList`                                                                       |
| `noteList`                | `unknown` | 表示するfeasibilityCaseを選択するためのリスト<br/>**Dependencies:** `sceneCount`, `myAppComputed`                                                    |
| `sceneCount`              | `unknown` | **Dependencies:** `myAppComputed`                                                                                                     |
| `foodGroup`               | `unknown` | FCTからfood Groupを抽出<br/>**Dependencies:** `myAppComputed`                                                                              |
| `targetGroup`             | `unknown` | **Dependencies:** `myAppComputed`                                                                                                     |
| `fieldsFoodGroup`         | `unknown` |                                                                                                                                       |
| `diversityStatusFiltered` | `unknown` | **Dependencies:** `diversityStatus`, `selectedCase`                                                                                   |
| `diversityStatus`         | `unknown` | menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定<br/>**Dependencies:** `myAppComputed`                                                      |
| `nutritionDemandGetter`   | `unknown` | myAppComputed.menuCases.targetの値を集計してnutritionDemandWatcherに代入するための関数                                                                 |
| `nutritionSupplyGetter`   | `unknown` | myAppComputed.menuCases.menuの値を集計してnutritionSupplyWatcherに代入するための関数                                                                   |
| `rating`                  | `unknown` | **Dependencies:** `ratingGetter`                                                                                                      |
| `ratingGetter`            | `unknown` | nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出<br/>**Dependencies:** `sceneCount`, `nutritionSupplyGetter`, `nutritionDemandGetter` |
| `pfcBalanceCurrent`       | `unknown` | **Dependencies:** `nutritionSupplyGetter`                                                                                             |

## Methods

### getPfcScale()

**Syntax**

```typescript
getPfcScale(rating: unknown): unknown
```

