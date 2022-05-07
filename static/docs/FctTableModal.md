# FctTableModal

## Props

| Name                         | Type      | Description  | Default |
| ---------------------------- | --------- | ------------ | ------- |
| `my-name` *required*         | `String`  |              |         |
| `my-modal-header` *required* | `String`  |              |         |
| `items` *required*           | `Array`   |              |         |
| `show-modal` *required*      | `Boolean` | モーダルの表示用トリガー | `false` |

## Data

| Name           | Type     | Description | Initial value |
| -------------- | -------- | ----------- | ------------- |
| `selectedItem` | `string` |             | `""`          |

## Computed Properties

| Name                | Type      | Description                   |
| ------------------- | --------- | ----------------------------- |
| `showModalComputed` | `unknown` | **Dependencies:** `showModal` |

## Events

| Name               | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| `update:showModal` | <br/>**Arguments**<br/><ul><li>**`val: unknown`**</li></ul>         |
| `click`            | <br/>**Arguments**<br/><ul><li>**`rec: unknown`**</li></ul>         |
| `modalOk`          | <br/>**Arguments**<br/><ul><li>**`selectedItem: string`**</li></ul> |

## Methods

### onFctClick()

**Syntax**

```typescript
onFctClick(rec: unknown): void
```

### clickOk()

...

**Syntax**

```typescript
clickOk(): void
```

### clickCancel()

**Syntax**

```typescript
clickCancel(): void
```

