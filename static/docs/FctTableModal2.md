# FctTableModal2

FctTableをModal化したもの
1. propsでFCTテーブルを受け取り表示
2. 特定行をclickすると品目情報をfoodModalに転送して開く
3. foodModalで重量を決定し、FctTableに戻す
4. Okクリックで選択された品目と重量をemit

## Props

| Name                       | Type      | Description    | Default      |
| -------------------------- | --------- | -------------- | ------------ |
| `my-name` *required*       | `String`  | モーダル表示用のID     |              |
| `my-modal-header`          | `String`  | モーダルのタイトル      | `"my modal"` |
| `items` *required*         | `Array`   | FCTテーブル用のデータ   |              |
| `menu-cases` *required*    | `Array`   | menuテーブル用のデータ  |              |
| `portion-units` *required* | `Array`   | portion換算用の変換表 |              |
| `show-modal` *required*    | `Boolean` | モーダルの表示用トリガー   | `false`      |

## Data

| Name             | Type      | Description               | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `portionCount`   | `number`  | 食材の重さの入力値:portion数        | `0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `portionSize`    | `number`  | 食材の重さの入力値:portionの単位量     | `0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `foodName`       | `string`  | 食事のメニュー名                  | `""`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `showModalInput` | `boolean` | 入力用のModalを開くためのフラグ        | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `selectedItem`   | `string`  | 選択された行のデータを代入する変数         | `""`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `fieldsSelected` | `array`   | 選択された作物(selectedItem)の表示用 | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'}, {key: 'menuName', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Name', sortable: true}, {key: 'En', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Pr', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Va', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Fe', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Wt', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, ]` |
| `typicalMenu`    | `array`   |                           | `[ '1st meal', '2nd meal', '3rd meal', '4th meal', '1st snack', '2nd snack', '3rd snack', ]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Computed Properties

| Name                | Type      | Description                                                                    |
| ------------------- | --------- | ------------------------------------------------------------------------------ |
| `foodVolume`        | `object`  | 食材の重さの入力値<br/>**Dependencies:** `portionCount`, `portionSize`                  |
| `portionList`       | `unknown` | 重量計算用のportion一覧表<br/>**Dependencies:** `portionUnits`                          |
| `stateFoodVolume`   | `boolean` | ダイアログで食材の量が入力されているかどうかのフラグ<br/>**Dependencies:** `portionCount`, `portionSize` |
| `stateFoodName`     | `object`  | ダイアログで食事の名称が入力されているかどうかのフラグ<br/>**Dependencies:** `foodName`                   |
| `stateSelectedItem` | `object`  | FCTで食材が選択されているかどうかのフラグ<br/>**Dependencies:** `selectedItem`                    |
| `selectedItemArray` | `array`   | 選択されたFCT行を配列に変換<br/>**Dependencies:** `selectedItem`                           |
| `showModalComputed` | `unknown` | モーダル表示用のフラグ<br/>**Dependencies:** `showModal`                                  |

## Events

| Name               | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:showModal` | <br/>**Arguments**<br/><ul><li>**`val: unknown`**</li></ul>                                                                                                                                                                                                                                                                                                                                                    |
| `modalOk`          | <br/>**Arguments**<br/><ul><li>**`menuCases: unknown`**</li></ul>                                                                                                                                                                                                                                                                                                                                              |
| `update:menuCases` | 更新した値をemit<br/>**Arguments**<br/><ul><li>**`vm.menuCases.map((item) => {         // もし既存データとidおよび食事名が一致した場合には追加ではなく既存の値を変更         if ((item.id === vm.selectedItem.id) && (item.menuName === vm.selectedItem.menuName)) {           item.Wt = Number(vm.selectedItem.Wt)           item.menuName = vm.selectedItem.menuName           addNew = false         }         return item       }): any`**</li></ul> |

## Methods

### setDigit()

各栄養素の値の表示用に、桁数を調整

**Syntax**

```typescript
setDigit(item: unknown, unitKey: unknown): string
```

### onFctClick()

行をクリックされた場合にその内容をselectedItemにコピー

**Syntax**

```typescript
onFctClick(rec: unknown): void
```

### clickOk()

最終結果(menuCases)をemit

**Syntax**

```typescript
clickOk(): void
```

### clickCancel()

捜査内容を破棄して戻る

**Syntax**

```typescript
clickCancel(): void
```

### addItem()

入力ダイアログの内容をselectedItemに追記して、menuCasesの配列に追加後、更新のためemit

**Syntax**

```typescript
addItem(): void
```

### deleteSupply()

recepiTableの削除ボタンをクリックした際に
削除後の値をemitしてmenuCasesを更新

**Syntax**

```typescript
deleteSupply(val: unknown): void
```

### onRecepiClicked()

recepiTableの行をクリックした場合に、その行の内容を
selectedItem, foodName, foodVolumeにコピーした上で
編集用ダイアログを開く

**Syntax**

```typescript
onRecepiClicked(val: unknown): void
```

