# recepiTable

## Props

| Name               | Type    | Description | Default                                                                                                                                                                                                                                                   |
| ------------------ | ------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items` *required* | `Array` |             | `() => [ {id: "1", Group: "grain", Name: "taro", En: "25", Pr: "5", Va: "109", Fe: "13", Wt: "196"}, {id: "2", Group: "meat", Name: "pork", En: "15", Pr: "9", Va: "58", Fe: "31", Wt: "208"} ]`                                                          |
| `food-grp`         | `Array` |             | `() => [ {name: 'Grains, roots and tubers'}, {name: 'Legumes and nuts'}, {name: 'Vitamin A rich fruits and Vegetable'}, {name: 'Other fruits and vegetables'}, {name: 'Flesh foods'}, {name: 'Dairy products'}, {name: 'Eggs'}, {name: 'non-category'} ]` |

## Data

| Name               | Type     | Description | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nutritionSum`     | `object` |             | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `showNutritionSum` | `object` |             | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `fields`           | `array`  |             | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Group', sortable: true, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: true}, {key: 'En', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Pr', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Va', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Fe', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, {key: 'Wt', sortable: true, tdClass: 'text-center', thClass: 'text-center'}, ]` |

## Events

| Name           | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `totalChanged` | <br/>**Arguments**<br/><ul><li>**`nutritionSum: object`**</li></ul> |
| `rowClick`     | <br/>**Arguments**<br/><ul><li>**`record: unknown`**</li></ul>      |
| `itemDeleted`  | <br/>**Arguments**<br/><ul><li>**`[]: array`**</li></ul>            |

## Methods

### setDigit()

**Syntax**

```typescript
setDigit(item: unknown, unitKey: unknown): unknown
```

### updateSum()

**Syntax**

```typescript
updateSum(array: unknown): unknown
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

### delClick()

**Syntax**

```typescript
delClick(id: unknown): void
```

