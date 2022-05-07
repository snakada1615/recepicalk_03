# driSelectModal

## Props

| Name                         | Type      | Description  | Default |
| ---------------------------- | --------- | ------------ | ------- |
| `show-modal` *required*      | `Boolean` | モーダルの表示用トリガー | `false` |
| `my-name` *required*         | `String`  |              |         |
| `my-modal-header` *required* | `String`  |              |         |
| `dri-items` *required*       | `Array`   |              |         |
| `dri-populations` *required* | `Array`   |              |         |
| `max` *required*             | `Number`  |              |         |
| `target-switch` *required*   | `Boolean` |              | &nbsp;  |

## Data

| Name           | Type     | Description | Initial value |
| -------------- | -------- | ----------- | ------------- |
| `selectedItem` | `string` |             | `""`          |

## Computed Properties

| Name                | Type      | Description                   |
| ------------------- | --------- | ----------------------------- |
| `showModalComputed` | `unknown` | **Dependencies:** `showModal` |

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

