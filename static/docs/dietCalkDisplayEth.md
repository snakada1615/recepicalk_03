# dietCalkDisplayEth

6つのコンポーネントを組み合わせて食事評価
1. driSelectModa\
対象グループの選択→栄養必要量の決定
2. FctTableModal\
利用する品目の選択→栄養供給量の決定
3. foodModal\
利用する品目の摂取量決定→栄養供給量の決定
4. recepiTable\
選択された品目一覧を示す
5. nutritionBar\
栄養素の充足状況をバーチャートで示す

## Props

| Name                   | Type     | Description |
| ---------------------- | -------- | ----------- |
| `my-family` *required* | `Object` | &nbsp;      |

## Data

| Name                     | Type     | Description                                                                                               | Initial value                                                                                                                                                      |
| ------------------------ | -------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `myFamilyWatcher`        | `object` | 使用する全変数のobject myFamilyから読み込んでこのページで利用。更新された時にemitを返す                                                     | `{}`                                                                                                                                                               |
| `myDri`                  | `array`  |                                                                                                           | `[]`                                                                                                                                                               |
| `myFct`                  | `array`  |                                                                                                           | `[]`                                                                                                                                                               |
| `myMember`               | `array`  |                                                                                                           | `[]`                                                                                                                                                               |
| `myCrops`                | `array`  |                                                                                                           | `[]`                                                                                                                                                               |
| `nutritionSupplyWatcher` | `object` | menuテーブルから計算される栄養供給量の合計値 menuCases[].menuから読み込んでこのページで利用。参照専用                                             | `{}`                                                                                                                                                               |
| `nutritionDemandWatcher` | `object` | menuテーブルから計算される栄養供給目標の合計値 nutritionDemandから読み込んでこのページで利用。参照専用                                             | `{}`                                                                                                                                                               |
| `rating`                 | `object` | nutritionBar用のレーティング nutritionDemandWatcher または nutritionSupplyWatcher が変化した際に、更新された値に基づいて栄養素ごとのratingを計算 | `{}`                                                                                                                                                               |
| `nutritionLabel`         | `array`  | nutritionBar用のproperty：栄養素表示用のlabel                                                                       | `['En', 'Pr', 'Va', 'Fe']`                                                                                                                                         |
| `maxRating`              | `number` | nutritionBar用のproperty：ratingの最大値                                                                         | `10`                                                                                                                                                               |
| `pfcBalanceStandard`     | `array`  | PFCバランスの推奨値                                                                                               | `[ {val: 35, color: 'green', label: '%'}, {val: 10, color: 'yellow', label: '%'}, {val: 55, color: 'red', label: '%'}, ]`                                          |
| `pfcBalanceCurrent`      | `array`  | PFCバランスの現状                                                                                                | `[ {val: 55, color: 'red', label: '%'}, {val: 35, color: 'green', label: '%'}, {val: 10, color: 'yellow', label: '%'}, {val: 500, color: 'silver', label: '$'}, ]` |

## Computed Properties

| Name              | Type      | Description                                      |
| ----------------- | --------- | ------------------------------------------------ |
| `foodGroup`       | `unknown` | FCTからfood Groupを抽出<br/>**Dependencies:** `myFct` |
| `diversityStatus` | `unknown` | menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定       |

## Methods

### ratingGetter()

nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出

**Syntax**

```typescript
ratingGetter(supply: unknown, demand: unknown): *[]
```

**Return value**

栄養素ごとの充足率

### notifiRecepiEdit()

**Syntax**

```typescript
notifiRecepiEdit(): void
```

