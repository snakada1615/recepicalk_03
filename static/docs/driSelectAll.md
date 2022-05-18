# driSelectAll

driSelectAll
driSelectSingleとdriSelectMultiを組み合わせて切り替え可能なコンポーネントにしたもの
1. driSelectSingle\
対象者を1名に限定した場合
2. driSelectMult\
対象者を各グループから複数名選択可能。家族構成等を入力可能

## Props

| Name                         | Type      | Description                                                                                                                                                                                                                | Default |
| ---------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `target-switch`              | `Boolean` | driPopulationsの切替スイッチ（singleモード/multiモード）                                                                                                                                                                                  | `true`  |
| `max`                        | `Number`  | driPopulations.countの上限値                                                                                                                                                                                                   | `1000`  |
| `dri-populations` *required* | `Array`   | ターゲットグループの構成：v-modelで使用  [{ id: 1, count: 1}, { id: 2, count: 5}, { id: 3, count: 0}]                                                                                                                                      |         |
| `dri-items` *required*       | `Array`   | driのデータセット   ex.          [{            En: "1088.0",            Fe: "5.8",            max_vol: "900",            Name: "child 6-23 month",            Pr: "11.65",            Va: "400.0",            id: 0           }], | &nbsp;  |

## Events

| Name                   | Description                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `changeNutritionValue` | <br/>**Arguments**<br/><ul><li>**`JSON.parse(JSON.stringify(val.total)): unknown`**</li></ul> |
| `update:targetSwitch`  |                                                                                               |
| `update:target`        |                                                                                               |
| `update:target`        | &nbsp;                                                                                        |

## Methods

### updateNutrition()

driPopulationsの更新時に値を親コンポーネントに通知

**Syntax**

```typescript
updateNutrition(val: array): void
```

**Parameters**

- `val: array`<br/>
  更新された栄養必要量

