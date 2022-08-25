# dietCalkCompEth

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

| Name                    | Type      | Description                        | Default                                  |
| ----------------------- | --------- | ---------------------------------- | ---------------------------------------- |
| `my-family` *required*  | `Object`  |                                    |                                          |
| `my-dri` *required*     | `Array`   |                                    |                                          |
| `my-fct` *required*     | `Array`   |                                    |                                          |
| `my-portion` *required* | `Array`   |                                    |                                          |
| `page-id` *required*    | `Number`  | 複数インスタンスを作成する場合のindex              |                                          |
| `max-page` *required*   | `Number`  | 作成するページ数                           |                                          |
| `use-common-target`     | `Boolean` | 共通のDRIを使うか、ケース毎に異なるDRIを設定するか決めるフラグ | `true`                                   |
| `disabled-option`       | `Array`   | 最初のページを表示しないためのフラグ                 | `function() {         return []       }` |

## Data

| Name                     | Type      | Description                                                                                               | Initial value                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pfcBalanceCurrent`      | `array`   |                                                                                                           | `[]`                                                                                                                                                                                                                                                                                                                                                                          |
| `chartBaseHeight`        | `object`  |                                                                                                           | `window.innerHeight / 4`                                                                                                                                                                                                                                                                                                                                                      |
| `chartBaseWidth`         | `object`  |                                                                                                           | `window.innerHeight / 4`                                                                                                                                                                                                                                                                                                                                                      |
| `currentMenu`            | `array`   |                                                                                                           | `[]`                                                                                                                                                                                                                                                                                                                                                                          |
| `myChartOptions`         | `object`  |                                                                                                           | `{"maintainAspectRatio":{"type":"boolean","value":false,"raw":"false","member":false},"responsive":{"type":"boolean","value":true,"raw":"true","member":false}}`                                                                                                                                                                                                              |
| `myCommunityWatcher`     | `object`  | 使用する全変数のobject myFamilyから読み込んでこのページで利用。更新された時にemitを返す                                                     | `{}`                                                                                                                                                                                                                                                                                                                                                                          |
| `nutritionSupplyWatcher` | `array`   | menuテーブルから計算される栄養供給量の合計値 menuCases[].menuから読み込んでこのページで利用。参照専用                                             | `[]`                                                                                                                                                                                                                                                                                                                                                                          |
| `nutritionDemandWatcher` | `object`  | menuテーブルから計算される栄養供給目標の合計値 nutritionDemandから読み込んでこのページで利用。参照専用                                             | `{}`                                                                                                                                                                                                                                                                                                                                                                          |
| `rating`                 | `array`   | nutritionBar用のレーティング nutritionDemandWatcher または nutritionSupplyWatcher が変化した際に、更新された値に基づいて栄養素ごとのratingを計算 | `[]`                                                                                                                                                                                                                                                                                                                                                                          |
| `nutritionLabel`         | `array`   | nutritionBar用のproperty：栄養素表示用のlabel                                                                       | `['En', 'Pr', 'Va', 'Fe']`                                                                                                                                                                                                                                                                                                                                                    |
| `maxRating`              | `number`  | nutritionBar用のproperty：ratingの最大値                                                                         | `10`                                                                                                                                                                                                                                                                                                                                                                          |
| `maxPopulation`          | `number`  | ターゲットの1グループあたり設定人数の最大値                                                                                    | `10000`                                                                                                                                                                                                                                                                                                                                                                       |
| `driSwitch`              | `boolean` | nutritionBarで評価するmenuを１日分で評価するか、一食分で評価するか判定                                                               | `true`                                                                                                                                                                                                                                                                                                                                                                        |
| `items_modal`            | `array`   | 作物情報を表すobject：作物摂取量の設定ダイアログに渡すproperty                                                                    | `[]`                                                                                                                                                                                                                                                                                                                                                                          |
| `value_model`            | `number`  | 作物摂取量を表す値：作物摂取量の設定ダイアログに渡すproperty                                                                        | `0`                                                                                                                                                                                                                                                                                                                                                                           |
| `menuName_modal`         | `string`  | 当該作物がどのメニュに含まれるかを示す変数                                                                                     | `""`                                                                                                                                                                                                                                                                                                                                                                          |
| `showDriSelect`          | `boolean` | driSelectAll表示用のフラグ                                                                                       | `false`                                                                                                                                                                                                                                                                                                                                                                       |
| `showFct`                | `boolean` | fctTableModal表示用のフラグ                                                                                      | `false`                                                                                                                                                                                                                                                                                                                                                                       |
| `showModal`              | `boolean` | modal表示用のフラグ                                                                                              | `false`                                                                                                                                                                                                                                                                                                                                                                       |
| `pageMemo`               | `array`   | 各ページの捕捉情報                                                                                                 | `[]`                                                                                                                                                                                                                                                                                                                                                                          |
| `pfcStandard`            | `object`  | PFCバランスの推奨値                                                                                               | `{"labels":{"type":"array","value":"['protein', 'fat', 'carbo.']","raw":"['protein', 'fat', 'carbo.']","member":false},"datasets":{"type":"array","value":"[ { label: 'Data One', backgroundColor: ['green', 'yellow', 'red'], data: [35, 10, 55], } ]","raw":"[ { label: 'Data One', backgroundColor: ['green', 'yellow', 'red'], data: [35, 10, 55], } ]","member":false}}` |
| `pfcScale`               | `array`   | currentとrecommendを比較した場合のエネルギー量の充足度 rating[].Enの値を1.5と0.5で足切りしたもの                                         | `[]`                                                                                                                                                                                                                                                                                                                                                                          |

## Computed Properties

| Name                    | Type      | Description                                                                                     |
| ----------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `myChartStyles`         | `object`  | **Dependencies:** `chartBaseHeight`, `pfcScale`, `pageIdComputed`                               |
| `myChartStylesOriginal` | `object`  | **Dependencies:** `chartBaseHeight`                                                             |
| `pageIdComputed`        | `unknown` | 現在のページ番号<br/>**Dependencies:** `pageId`                                                         |
| `pageOptions`           | `unknown` | ページ一覧：リストからページ選択するためのarray option<br/>**Dependencies:** `maxPage`, `pageMemo`, `disabledOption` |
| `foodGroup`             | `unknown` | FCTからfood Groupを抽出<br/>**Dependencies:** `myFct`                                                |
| `diversityStatus`       | `unknown` | menuCasesに含まれるfood Groupから、何種類の食品群が含まれるか判定                                                      |
| `noteInputState`        | `object`  | noteの記入状態<br/>**Dependencies:** `pageMemo`, `pageIdComputed`                                    |

## Events

| Name              | Description                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `update:pageId`   | <br/>**Arguments**<br/><ul><li>**`newVal: unknown`**</li></ul>                                                             |
| `update:myFamily` | 更新されたmyAppをemit<br/>**Arguments**<br/><ul><li>**`JSON.parse(JSON.stringify(this.myCommunityWatcher)): unknown`**</li></ul> |

## Methods

### enlargeChart()

**Syntax**

```typescript
enlargeChart(): void
```

### updatePageMemo()

ページメモの更新：

**Syntax**

```typescript
updatePageMemo(newVal: unknown): void
```

### ratingGetter()

nutritionSupplyとnutritionDemandの値に基づいて栄養素の充足率を算出

**Syntax**

```typescript
ratingGetter(supplyCases: unknown, demandCases: unknown): *[]
```

**Return value**

栄養素ごとの充足率

### updateSupply()

ユーザーによりmenuCasesが変更された際に、myApp全体を更新してemit

**Syntax**

```typescript
updateSupply(val: unknown, index: unknown): void
```

### updateDemand()

ユーザーによりtergetが変更された際に、栄養素必要量合計を再計算してemit

**Syntax**

```typescript
updateDemand(val: unknown, index: unknown): void
```

**Parameters**

- `val: unknown`<br/>
  更新されたグループ構成

- `index: unknown`

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

### notifiRecepiEdit()

**Syntax**

```typescript
notifiRecepiEdit(): void
```

