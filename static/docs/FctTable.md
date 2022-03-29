# FctTable

## Props

| Name    | Type    | Description | Default    |
| ------- | ------- | ----------- | ---------- |
| `items` | `Array` |             | `() => []` |

## Data

| Name          | Type      | Description | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------- | --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields`      | `array`   |             | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: true, thStyle: {width: "290px"}}, {key: 'En', sortable: true, thStyle: {width: "50px"}}, {key: 'Pr', sortable: true, thStyle: {width: "50px"}}, {key: 'Va', sortable: true, thStyle: {width: "50px"}}, {key: 'Fe', sortable: true, thStyle: {width: "50px"}}, ]` |
| `colWidth`    | `array`   |             | `[0, 0, 120, 30, 30, 30, 30]`                                                                                                                                                                                                                                                                                                                                                                                                         |
| `totalRows`   | `number`  |             | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `currentPage` | `number`  |             | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `perPage`     | `number`  |             | `5`                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `pageOptions` | `array`   |             | `[5, 10, 15, {value: 100, text: "Show a lot"}]`                                                                                                                                                                                                                                                                                                                                                                                       |
| `sortBy`      | `string`  |             | `"Name"`                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `sortDesc`    | `boolean` |             | `false`                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `filter`      | `unknown` |             | `null`                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `filterOn`    | `array`   |             | `['Group', 'Name']`                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Computed Properties

| Name      | Type      | Description               |
| --------- | --------- | ------------------------- |
| `FoodGrp` | `unknown` | **Dependencies:** `items` |

## Events

| Name       | Description                                                    |
| ---------- | -------------------------------------------------------------- |
| `fctClick` | <br/>**Arguments**<br/><ul><li>**`record: unknown`**</li></ul> |

## Methods

### hello()

**Syntax**

```typescript
hello(): void
```

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

### rowClick()

**Syntax**

```typescript
rowClick(record: unknown): void
```

