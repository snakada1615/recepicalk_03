# dietCalkComp

## Props

| Name                 | Type     | Description                     | Default |
| -------------------- | -------- | ------------------------------- | ------- |
| `my-app` *required*  | `Object` | データ本体。myAppWatcherで読み込んでページ内で利用 |         |
| `page-id` *required* | `Number` | 複数インスタンスを作成する場合のindex           | `0`     |

## Data

| Name             | Type      | Description                                        | Initial value                                                                                                                                                                                                        |
| ---------------- | --------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `myAppWatcher`   | `object`  | 使用する全変数のobject myAppから読み込んでこのページで利用。更新された時にemitを返す | `{"type":{"type":"unknown","value":"Object","raw":"Object","member":false},"required":{"type":"boolean","value":true,"raw":"true","member":false},"default":{"type":"object","value":{},"raw":"{}","member":false}}` |
| `max`            | `number`  | ターゲットの1グループあたり設定人数の最大値                             | `10000`                                                                                                                                                                                                              |
| `firstLoadFlag`  | `boolean` | 初回読み込み時のチェック用フラグ                                   | `true`                                                                                                                                                                                                               |
| `items_modal`    | `array`   | 作物情報を表すobject：作物摂取量の設定ダイアログに渡すproperty             | `[]`                                                                                                                                                                                                                 |
| `value_model`    | `number`  | 作物摂取量を表す値：作物摂取量の設定ダイアログに渡すproperty                 | `0`                                                                                                                                                                                                                  |
| `maxRating`      | `number`  | nutritionBar用のproperty：ratingの最大値                  | `10`                                                                                                                                                                                                                 |
| `driSwitch`      | `boolean` | nutritionBarで評価するmenuを１日分で評価するか、一食分で評価するか判定        | `true`                                                                                                                                                                                                               |
| `nutritionLabel` | `array`   | nutritionBar用のproperty：栄養素表示用のlabel                | `['En', 'Pr', 'Va', 'Fe']`                                                                                                                                                                                           |
| `nutritionSum`   | `object`  | menuテーブルから計算される栄養供給量の合計値                           | `{}`                                                                                                                                                                                                                 |
| `totalDri`       | `object`  | driテーブルから計算される栄養必要量の合計値                            | `{}`                                                                                                                                                                                                                 |
| `showFct`        | `boolean` | FctTable表示用のフラグ                                    | `false`                                                                                                                                                                                                              |
| `showDri`        | `boolean` | driSelectAll表示用のフラグ                                | `false`                                                                                                                                                                                                              |
| `showModal`      | `boolean` | modal表示用のフラグ                                       | `false`                                                                                                                                                                                                              |

## Computed Properties

| Name                  | Type      | Description                                                                                                                                                                          |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `myAppWatcherMonitor` | `unknown` | ネストしたオブジェクトの場合、watchするとnewValue=oldValueとなってしまうため、     computed valueをwatchする     （https://qiita.com/HorikawaTokiya/items/6c500f8e62bfcba3ca70）<br/>**Dependencies:** `myAppWatcher` |
| `rating`              | `object`  | totalDri または nutritionSum が変化した際に、更新された値に基づいて栄養素ごとのratingを計算<br/>**Dependencies:** `totalDri`, `nutritionSum`, `driRange`                                                            |
| `driRange`            | `unknown` | ratingを計算するにあたって、同一メニューを一日3回食べると仮定した場合の評価、     (recepiTableの値×3)、または1回分が一日の栄養素に与える影響の評価を     切り替える<br/>**Dependencies:** `driSwitch`                                                 |

## Methods

### test()

**Syntax**

```typescript
test(val: unknown): void
```

### onDriChanged()

**Syntax**

```typescript
onDriChanged(val: unknown): void
```

### onNutritionSumChanged()

**Syntax**

```typescript
onNutritionSumChanged(val: unknown): void
```

### onFoodModalOk()

**Syntax**

```typescript
onFoodModalOk(val: unknown): void
```

### onFctClick()

**Syntax**

```typescript
onFctClick(val: unknown): void
```

### updateTarget()

**Syntax**

```typescript
updateTarget(val: unknown): void
```

### save()

**Syntax**

```typescript
save(): void
```

