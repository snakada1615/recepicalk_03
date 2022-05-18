# driSelectModal

driSelectAllをモーダル化したもの

## Props

| Name                         | Type      | Description                          | Default |
| ---------------------------- | --------- | ------------------------------------ | ------- |
| `show-modal` *required*      | `Boolean` | モーダルの表示用トリガー                         | `false` |
| `my-name` *required*         | `String`  | モーダル表示用のID                           |         |
| `my-modal-header` *required* | `String`  | モーダルのヘッダー用テキスト                       |         |
| `dri-items` *required*       | `Array`   | dri表示用のデータ                           |         |
| `dri-populations` *required* | `Array`   | 対象者を表すArray（グループ毎の人数）                |         |
| `max` *required*             | `Number`  | 一グループあたり設定できる人数の最大値                  |         |
| `target-switch` *required*   | `Boolean` | driSelectAllとdriSelectMultiの切り替え用フラグ | &nbsp;  |

## Computed Properties

| Name                | Type      | Description                                                      |
| ------------------- | --------- | ---------------------------------------------------------------- |
| `showModalComputed` | `unknown` | モーダル表示用のフラグを扱うためのComputed Prop<br/>**Dependencies:** `showModal` |

## Events

| Name                   | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `update:showModal`     | <br/>**Arguments**<br/><ul><li>**`val: unknown`**</li></ul> |
| `update:target`        |                                                             |
| `changeNutritionValue` | &nbsp;                                                      |

## Methods

### clickOk()

**Syntax**

```typescript
clickOk(): void
```

