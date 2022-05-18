# test04

## Data

| Name         | Type     | Description | Initial value                                                                                                                                                                                                                                                                                      |
| ------------ | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selected`   | `string` |             | `"first"`                                                                                                                                                                                                                                                                                          |
| `options`    | `array`  |             | `[ { text: 'driSelectAll', value: 1 }, { text: 'driSelectMulti', value: 2 }, { text: 'driSelectSingle', value: 3 }, { text: 'fctTable', value: 4 }, { text: 'fctTableModal', value: 5 }, { text: 'foodModal', value: 6 }, { text: 'nutritionBar', value: 7 }, { text: 'recepiTable', value: 8 } ]` |
| `content`    | `array`  |             | `[]`                                                                                                                                                                                                                                                                                               |
| `myMarkDown` | `array`  |             | `[ '../docs/driSelectAll.md', '../docs/driSelectMulti.md', '../docs/driSelectSingle.md', '../docs/fctTable.md', '../docs/fctTableModal.md', '../docs/foodModal.md', '../docs/nutritionBar.md', '../docs/recepiTable.md' ]`                                                                         |

## Computed Properties

| Name    | Type      | Description                  |
| ------- | --------- | ---------------------------- |
| `link1` | `unknown` | **Dependencies:** `selected` |
| `link2` | `unknown` | **Dependencies:** `selected` |
| `link3` | `unknown` | **Dependencies:** `selected` |
| `link4` | `unknown` | **Dependencies:** `selected` |
| `link5` | `unknown` | **Dependencies:** `selected` |
| `link6` | `unknown` | **Dependencies:** `selected` |
| `link7` | `unknown` | **Dependencies:** `selected` |
| `link8` | `unknown` | **Dependencies:** `selected` |

## Methods

### getAxios()

**Syntax**

```typescript
async getAxios(val: unknown): Promise<unknown>
```

