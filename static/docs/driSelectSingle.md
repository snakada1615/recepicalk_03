# driSelectSingle

## Props

| Name                | Type    | Description             | Default                     |
| ------------------- | ------- | ----------------------- | --------------------------- |
| `target` *required* | `Array` | value: null,            | `() => [{id: 0, count: 1}]` |
| `items` *required*  | `Array` | list of DRI information | &nbsp;                      |

## Data

| Name      | Type    | Description | Initial value                                                          |
| --------- | ------- | ----------- | ---------------------------------------------------------------------- |
| `fields1` | `array` |             | `[ {key: 'Item', sortable: false}, {key: 'Value', sortable: false}, ]` |

## Computed Properties

| Name         | Type      | Description                                                 |
| ------------ | --------- | ----------------------------------------------------------- |
| `targetComp` | `unknown` | **Dependencies:** `target`                                  |
| `total`      | `unknown` | **Dependencies:** `target`, `setDRI`, `targetComp`, `$emit` |
| `options`    | `unknown` | **Dependencies:** `items`                                   |

## Events

| Name            | Description                                                                                                                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:target` | <br/>**Arguments**<br/><ul><li>**`this.items.map(function(dat){           let count = 0           if (Number(dat.id) === Number(val)){             count = 1           }           return {id: dat.id, count: count}         }): unknown`**</li></ul> |

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

