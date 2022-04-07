# driSelectSingle

## Props

| Name               | Type    | Description             | Default                     |
| ------------------ | ------- | ----------------------- | --------------------------- |
| `target`           | `Array` | value: null,            | `() => [{id: 0, count: 1}]` |
| `items` *required* | `Array` | list of DRI information | &nbsp;                      |

## Data

| Name      | Type    | Description | Initial value                                                          |
| --------- | ------- | ----------- | ---------------------------------------------------------------------- |
| `fields1` | `array` |             | `[ {key: 'Item', sortable: false}, {key: 'Value', sortable: false}, ]` |

## Computed Properties

| Name         | Type      | Description                                   |
| ------------ | --------- | --------------------------------------------- |
| `targetComp` | `unknown` | **Dependencies:** `target`                    |
| `total`      | `unknown` | **Dependencies:** `target`, `setDRI`, `$emit` |
| `options`    | `unknown` | **Dependencies:** `items`                     |

## Events

| Name            | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `update:target` | <br/>**Arguments**<br/><ul><li>**`[{id: val, count:1}]: array`**</li></ul> |

## Methods

### formatNumber()

**Syntax**

```typescript
formatNumber(val: unknown, index: unknown): unknown
```

### setDRI()

**Syntax**

```typescript
setDRI(selectedId: unknown): void
```

