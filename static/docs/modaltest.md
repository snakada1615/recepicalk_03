# modaltest

## Props

| Name               | Type      | Description | Default    |
| ------------------ | --------- | ----------- | ---------- |
| `show`             | `Boolean` |             | `false`    |
| `items` *required* | `Array`   |             | `() => []` |

## Data

| Name     | Type    | Description | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields` | `array` |             | `[ {key: 'id', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'Name', sortable: true, thStyle: {width: "290px"}}, {key: 'Group', sortable: false, tdClass: 'd-none', thClass: 'd-none'}, {key: 'En', sortable: true, thStyle: {width: "50px"}}, {key: 'Pr', sortable: true, thStyle: {width: "50px"}}, {key: 'Va', sortable: true, thStyle: {width: "50px"}}, {key: 'Fe', sortable: true, thStyle: {width: "50px"}}, ]` |

## Computed Properties

| Name           | Type      | Description              |
| -------------- | --------- | ------------------------ |
| `showComputed` | `unknown` | **Dependencies:** `show` |

## Events

| Name          | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| `update:show` | <br/>**Arguments**<br/><ul><li>**`val: unknown`**</li></ul> |

