# countryNames

fireStoreから国一覧のリストを読み込んでform-selectで表示

## Props

| Name              | Type     | Description | Default |
| ----------------- | -------- | ----------- | ------- |
| `key1` *required* | `String` | 選択された地域     | `""`    |

## Data

| Name      | Type     | Description           | Initial value |
| --------- | -------- | --------------------- | ------------- |
| `dataObj` | `string` | fireStoreから読み込んだデータ本体 | `""`          |

## Computed Properties

| Name        | Type      | Description                                              |
| ----------- | --------- | -------------------------------------------------------- |
| `key1Temp`  | `object`  | **Dependencies:** `key1`                                 |
| `countries` | `unknown` | dataObjをリストに変換(リストボックス用)<br/>**Dependencies:** `dataObj` |

## Events

| Name          | Description |
| ------------- | ----------- |
| `update:key1` | &nbsp;      |

