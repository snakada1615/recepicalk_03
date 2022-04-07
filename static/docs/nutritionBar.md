# nutritionBar

## Props

| Name                   | Type      | Description                                                      | Default |
| ---------------------- | --------- | ---------------------------------------------------------------- | ------- |
| `show-reset`           | `Boolean` | show reset button                                                | `false` |
| `show-dri`             | `Boolean` | show number next to barchart                                     | `true`  |
| `rating`               | `Number`  | actual score shown on barchart (relative value between [0, max]) | `5`     |
| `max`                  | `Number`  | max value of barchart (relative value)                           | `10`    |
| `increment`            | `Number`  | increment shown on the barchart                                  | `0.1`   |
| `icon-num`             | `Number`  | icon ID used for barchart renderig                               | `1`     |
| `crop-name` *required* | `String`  | label shown at left side of barchart                             |         |
| `nutrition-target`     | `Number`  | absolute value equivalent to max                                 | `0`     |
| `col-width-first`      | `Number`  |                                                                  | `3`     |
| `col-width-second`     | `Number`  |                                                                  | `2`     |

## Data

| Name     | Type     | Description | Initial value |
| -------- | -------- | ----------- | ------------- |
| `myicon` | `string` |             | `""`          |

## Methods

### setIcon()

**Syntax**

```typescript
setIcon(index: unknown): void
```

