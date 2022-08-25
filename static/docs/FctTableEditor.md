# FctTableEditor

## Props

| Name    | Type    | Description | Default    |
| ------- | ------- | ----------- | ---------- |
| `items` | `Array` |             | `() => []` |

## Data

| Name          | Type      | Description | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `temp`        | `string`  |             | `""`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `fields`      | `array`   |             | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: true, thStyle: {width: "290px"}}, {key: 'En', sortable: true, thStyle: {width: "50px"}}, {key: 'Pr', sortable: true, thStyle: {width: "50px"}}, {key: 'Va', sortable: true, thStyle: {width: "50px"}}, {key: 'Fe', sortable: true, thStyle: {width: "50px"}}, ]`                                                                                             |
| `totalRows`   | `number`  |             | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `currentPage` | `number`  |             | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `perPage`     | `number`  |             | `5`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `pageOptions` | `array`   |             | `[5, 10, 15, {value: 100, text: "Show a lot"}]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `sortBy`      | `string`  |             | `"Name"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `sortDesc`    | `boolean` |             | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `filter`      | `unknown` |             | `null`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `filterOn`    | `array`   |             | `['Group', 'Name']`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `fctItem`     | `object`  |             | `{"id":{"type":"string","value":"","raw":"\"\"","member":false},"Group":{"type":"string","value":"","raw":"\"\"","member":false},"Name":{"type":"string","value":"","raw":"\"\"","member":false},"En":{"type":"string","value":"","raw":"\"\"","member":false},"Pr":{"type":"string","value":"","raw":"\"\"","member":false},"Va":{"type":"string","value":"","raw":"\"\"","member":false},"Fe":{"type":"string","value":"","raw":"\"\"","member":false},"food_grp_id":{"type":"string","value":"","raw":"\"\"","member":false}}` |

## Computed Properties

| Name         | Type      | Description                 |
| ------------ | --------- | --------------------------- |
| `FoodGrp`    | `unknown` | **Dependencies:** `items`   |
| `foodIdMax`  | `unknown` | **Dependencies:** `items`   |
| `stateGroup` | `unknown` | **Dependencies:** `fctItem` |
| `stateName`  | `unknown` | **Dependencies:** `fctItem` |
| `stateEn`    | `unknown` | **Dependencies:** `fctItem` |
| `statePr`    | `unknown` | **Dependencies:** `fctItem` |
| `stateVa`    | `unknown` | **Dependencies:** `fctItem` |
| `stateFe`    | `unknown` | **Dependencies:** `fctItem` |

## Events

| Name           | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:items` | <br/>**Arguments**<br/><ul><li>**`vm.items.map(function (doc) {         if (doc.id === val.id) {           isNewRecord = false           doc.Group = val.Group           doc.Name = val.Name           doc.En = val.En           doc.Pr = val.Pr           doc.Va = val.Va           doc.Fe = val.Fe           doc.id = val.id           doc.food_grp_id = val.food_grp_id         }         return doc       }): unknown`**</li></ul> |

## Methods

### onFiltered()

**Syntax**

```typescript
onFiltered(filteredItems: unknown): void
```

### onInput()

**Syntax**

```typescript
onInput(): void
```

### onFCTclick()

**Syntax**

```typescript
onFCTclick(val: unknown): void
```

### addNewItem()

新規追加する際の初期値

**Syntax**

```typescript
addNewItem(): void
```

### clickOk()

**Syntax**

```typescript
clickOk(val: unknown): void
```

### clickCancel()

**Syntax**

```typescript
clickCancel(): void
```

