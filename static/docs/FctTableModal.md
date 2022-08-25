# FctTableModal

FctTableをModal化したもの
1. propsでFCTテーブルを受け取り表示
2. 特定行をclickすると品目情報をfoodModalに転送して開く
3. foodModalで重量を決定し、FctTableに戻す
4. Okクリックで選択された品目と重量をemit

## Props

| Name                         | Type      | Description  | Default |
| ---------------------------- | --------- | ------------ | ------- |
| `my-name` *required*         | `String`  | モーダル表示用のID   |         |
| `my-modal-header` *required* | `String`  | モーダルのタイトル    |         |
| `items` *required*           | `Array`   | FCTテーブル用のデータ |         |
| `show-modal` *required*      | `Boolean` | モーダルの表示用トリガー | `false` |

## Data

| Name           | Type     | Description       | Initial value |
| -------------- | -------- | ----------------- | ------------- |
| `selectedItem` | `string` | 選択された行のデータを代入する変数 | `""`          |

## Computed Properties

| Name                | Type      | Description                                   |
| ------------------- | --------- | --------------------------------------------- |
| `showModalComputed` | `unknown` | モーダル表示用のフラグ<br/>**Dependencies:** `showModal` |

## Events

| Name               | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `update:showModal` | <br/>**Arguments**<br/><ul><li>**`val: unknown`**</li></ul>         |
| `click`            | <br/>**Arguments**<br/><ul><li>**`rec: unknown`**</li></ul>         |
| `modalOk`          | <br/>**Arguments**<br/><ul><li>**`selectedItem: string`**</li></ul> |

## Methods

### onFctClick()

行をクリックされた場合にその内容をemitする

**Syntax**

```typescript
onFctClick(rec: unknown): void
```

### onFctDblClick()

行をクリックされた場合にその内容をemitして
食品の摂取量の設定用の別のmodal（foodModal）を開く

**Syntax**

```typescript
onFctDblClick(rec: unknown): void
```

### clickOk()

選択されたfood item（onFctClick）と摂取量(foodModal)の両方をemitする

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

