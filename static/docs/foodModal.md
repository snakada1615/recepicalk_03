# foodModal

## Props

| Name                    | Type     | Description | Default    |
| ----------------------- | -------- | ----------- | ---------- |
| `items`                 | `Array`  |             | `() => []` |
| `v-model`               | `Number` |             | `0`        |
| `my-name` *required*    | `String` |             |            |
| `my-modal-header`       | `String` |             |            |
| `max-weight` *required* | `Number` |             |            |
| `my-type`               | `String` |             | &nbsp;     |

## Data

| Name     | Type    | Description | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields` | `array` |             | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: true, thStyle: {width: "290px"}}, {key: 'Group', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'En', sortable: true, thStyle: {width: "50px"}}, {key: 'Pr', sortable: true, thStyle: {width: "50px"}}, {key: 'Va', sortable: true, thStyle: {width: "50px"}}, {key: 'Fe', sortable: true, thStyle: {width: "50px"}}, ]` |

## Computed Properties

| Name         | Type      | Description                            |
| ------------ | --------- | -------------------------------------- |
| `inputName`  | `object`  | **Dependencies:** `myName`             |
| `inputState` | `boolean` | **Dependencies:** `value`, `maxWeight` |

## Events

| Name      | Description                                                |
| --------- | ---------------------------------------------------------- |
| `modalOk` | <br/>**Arguments**<br/><ul><li>**`{}: unknown`**</li></ul> |
| `input`   | &nbsp;                                                     |

## Methods

### setDigit()

...

**Syntax**

```typescript
setDigit(item: unknown, unitKey: unknown): unknown
```

### clickOk()

**Syntax**

```typescript
clickOk(): void
```

### clickCancel()

**Syntax**

```typescript
clickCancel(): void
```

