# feasibilityQAEditor

## Props

| Name            | Type     | Description |
| --------------- | -------- | ----------- |
| `qa` *required* | `Object` | &nbsp;      |

## Data

| Name              | Type      | Description | Initial value                                                                                                                                                                                                                                                                                                                                         |
| ----------------- | --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `firstLoading`    | `boolean` |             | `false`                                                                                                                                                                                                                                                                                                                                               |
| `QACopy`          | `object`  |             | `{}`                                                                                                                                                                                                                                                                                                                                                  |
| `optionsCategory` | `array`   |             | `[ {value: 'Nutrient balance', text: 'Nutrient balance'}, {value: 'Socioeconomic feasibility', text: 'Socioeconomic feasibility'}, {value: 'Technical feasibility', text: 'Technical feasibility'}, {value: 'Investment', text: 'Investment'}, {value: 'Stability', text: 'Stability'}, {value: 'Market opportunity', text: 'Market opportunity'}, ]` |
| `optionsPoint`    | `array`   |             | `[ {value: 0, text: 0}, {value: 1, text: 1}, {value: 2, text: 2}, {value: 3, text: 3}, ]`                                                                                                                                                                                                                                                             |
| `selected1`       | `string`  |             | `""`                                                                                                                                                                                                                                                                                                                                                  |
| `selected2`       | `string`  |             | `""`                                                                                                                                                                                                                                                                                                                                                  |
| `selected3`       | `string`  |             | `""`                                                                                                                                                                                                                                                                                                                                                  |
| `selected4`       | `string`  |             | `""`                                                                                                                                                                                                                                                                                                                                                  |

## Computed Properties

| Name            | Type      | Description                                   |
| --------------- | --------- | --------------------------------------------- |
| `stateAll`      | `boolean` |                                               |
| `stateCategory` | `unknown` | **Dependencies:** `optionsCategory`, `QACopy` |
| `stateQuestion` | `unknown` | **Dependencies:** `QACopy`                    |
| `stateAnswer1`  | `unknown` | **Dependencies:** `QACopy`                    |
| `stateAnswer2`  | `unknown` | **Dependencies:** `QACopy`                    |
| `stateAnswer3`  | `unknown` | **Dependencies:** `QACopy`                    |
| `stateAnswer4`  | `unknown` | **Dependencies:** `QACopy`                    |
| `stateScore1`   | `unknown` |                                               |
| `stateScore2`   | `unknown` |                                               |
| `stateScore3`   | `unknown` |                                               |
| `stateScore4`   | `unknown` | &nbsp;                                        |

## Events

| Name        | Description                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| `update:Qa` | 更新されたmyAppをemit<br/>**Arguments**<br/><ul><li>**`JSON.parse(JSON.stringify(this.QACopy)): unknown`**</li></ul> |

## Methods

### updateValue()

**Syntax**

```typescript
updateValue(val: unknown, key: unknown): void
```

