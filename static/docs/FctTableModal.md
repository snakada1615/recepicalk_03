# FctTableModal

## Props

| Name                 | Type     | Description |
| -------------------- | -------- | ----------- |
| `my-name` *required* | `String` |             |
| `my-modal-header`    | `String` |             |
| `items`              | `Array`  | &nbsp;      |

## Data

| Name           | Type     | Description | Initial value |
| -------------- | -------- | ----------- | ------------- |
| `selectedItem` | `string` |             | `""`          |

## Events

| Name      | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| `click`   | <br/>**Arguments**<br/><ul><li>**`rec: unknown`**</li></ul>         |
| `modalOk` | <br/>**Arguments**<br/><ul><li>**`selectedItem: string`**</li></ul> |

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

