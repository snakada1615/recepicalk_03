# nutritionBar

## Props

| Name                        | Type      | Description                                                                                    | Default |
| --------------------------- | --------- | ---------------------------------------------------------------------------------------------- | ------- |
| `show-reset`                | `Boolean` | show reset button データを０に戻すためのフラグ                                                               | `false` |
| `show-max-number`           | `Boolean` | show number next to barchart 最大値を表示するかどうかのフラグ                                                  | `true`  |
| `rating` *required*         | `Number`  | actual score shown on barchart (relative value between [0, max]) ratingのための相対値                 | `5`     |
| `max-rating`                | `Number`  | max value of barchart (relative value) ratingの最大値(表示用のアイコンの個数なので、横棒にする場合は     特に意味はない=10に固定する) | `10`    |
| `increment`                 | `Number`  | increment shown on the barchart グラフの最小目盛幅(初期値のままで基本的にはok)                                      | `0.1`   |
| `label` *required*          | `String`  | label shown at left side of barchart 表示名                                                       |         |
| `max-rating-absolute`       | `Number`  | absolute value equivalent to max ratingの最大値(実数)を表示する                                           | `0`     |
| `digit-max-rating-absolute` | `Number`  | maxRatingAbsoluteの桁数設定     10の倍数（1,10,100,0.1,0.01,0.001）で指定                                   | `1`     |
| `col-width-first`           | `Number`  | labelを表示するための列幅                                                                                | `3`     |
| `col-width-second`          | `Number`  | maxRatingAbsoluteを表示するための列幅                                                                    | `2`     |

## Data

| Name     | Type     | Description | Initial value |
| -------- | -------- | ----------- | ------------- |
| `myicon` | `string` |             | `""`          |

## Computed Properties

| Name                        | Type      | Description                                                                 |
| --------------------------- | --------- | --------------------------------------------------------------------------- |
| `maxRatingAbsoluteComputed` | `unknown` | **Dependencies:** `orgRound`, `maxRatingAbsolute`, `digitMaxRatingAbsolute` |

## Methods

### orgRound()

任意の桁で四捨五入する関数

**Syntax**

```typescript
orgRound(value: number, base: number): number
```

**Parameters**

- `value: number`<br/>
  四捨五入する数値

- `base: number`<br/>
  どの桁で四捨五入するか（10→10の位、0.1→小数第１位）

**Return value**

四捨五入した値

### setIcon()

rating表示用のアイコンの設定

**Syntax**

```typescript
setIcon(index: unknown): void
```

