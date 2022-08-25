# macroNutrientBar

3つの数値（PFCエネルギー供給量）から、それぞれのシェアを
横棒グラフで表すコンポーネント

## Props

| Name                      | Type    | Description                       |
| ------------------------- | ------- | --------------------------------- |
| `chart-values` *required* | `Array` | 3つの数値(PFC値)＋色をまとめたArray of Object |

## Methods

### chartDataSet()

chartValueの値を描画用の座標へ変換するための関数

**Syntax**

```typescript
chartDataSet(dat: unknown): unknown
```

**Return value**

{[{color, x1: number, x2: number},{color, x1: number, x2: number},{color, x1:
number, x2: number}]}

