# myBox

## Props

| Name      | Type     | Description | Default  |
| --------- | -------- | ----------- | -------- |
| `x1`      | `Number` |             | `0`      |
| `y1`      | `Number` |             | `0`      |
| `x2`      | `Number` |             | `0`      |
| `y2`      | `Number` |             | `0`      |
| `v-model` | `String` |             |          |
| `color`   | `String` |             | `"#F00"` |

## Data

| Name     | Type     | Description | Initial value                                                                                                                                                                                                                                                       |
| -------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oldBox` | `object` |             | `{"x":{"type":"unknown","value":null,"raw":"null","member":false},"y":{"type":"unknown","value":null,"raw":"null","member":false},"w":{"type":"unknown","value":null,"raw":"null","member":false},"h":{"type":"unknown","value":null,"raw":"null","member":false}}` |

## Computed Properties

| Name            | Type      | Description                                                    |
| --------------- | --------- | -------------------------------------------------------------- |
| `calculatedBox` | `unknown` | **Dependencies:** `provider`, `x1`, `y1`, `x2`, `y2`, `oldBox` |

