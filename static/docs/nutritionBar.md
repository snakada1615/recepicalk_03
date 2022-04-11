# nutritionBar

## Props

| Name                    | Type      | Description                                                                                    | Default |
| ----------------------- | --------- | ---------------------------------------------------------------------------------------------- | ------- |
| `show-reset`            | `Boolean` | show reset button データを０に戻すためのフラグ                                                               | `false` |
| `show-max-number`       | `Boolean` | show number next to barchart 最大値を表示するかどうかのフラグ                                                  | `true`  |
| `rating` *required*     | `Number`  | actual score shown on barchart (relative value between [0, max]) ratingのための相対値                 | `5`     |
| `max-rating` *required* | `Number`  | max value of barchart (relative value) ratingの最大値(表示用のアイコンの個数なので、横棒にする場合は     特に意味はない=10に固定する) | `10`    |
| `increment`             | `Number`  | increment shown on the barchart グラフの最小目盛幅(初期値のままで基本的にはok)                                      | `0.1`   |
| `label` *required*      | `String`  | label shown at left side of barchart 表示名                                                       |         |
| `max-rating-absolute`   | `Number`  | absolute value equivalent to max ratingの最大値(実数)を表示する                                           | `0`     |
| `col-width-first`       | `Number`  | labelを表示するための列幅                                                                                | `3`     |
| `col-width-second`      | `Number`  | maxRatingAbsoluteを表示するための列幅                                                                    | `2`     |

## Data

| Name     | Type     | Description | Initial value |
| -------- | -------- | ----------- | ------------- |
| `myicon` | `string` |             | `""`          |

## Methods

### setIcon()

rating表示用のアイコンの設定

**Syntax**

```typescript
setIcon(index: unknown): void
```

