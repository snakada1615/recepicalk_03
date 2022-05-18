# regionSelect

storeからregion一覧を読み込んでリストボックスで選択し、プロパティとして値を返す

## Props

| Name              | Type     | Description | Default    |
| ----------------- | -------- | ----------- | ---------- |
| `key1` *required* | `String` | 選択された地域1    | `""`       |
| `key2` *required* | `String` | 選択された地域2    | `""`       |
| `key3` *required* | `String` | 選択された地域3    | `""`       |
| `label1`          | `String` | region1のラベル | `"Region"` |
| `label2`          | `String` | region2のラベル | `"Woreda"` |
| `label3`          | `String` | region3のラベル | `"Kebere"` |

## Data

| Name                 | Type      | Description           | Initial value |
| -------------------- | --------- | --------------------- | ------------- |
| `dataCsv`            | `string`  | fireStoreから読み込んだデータ本体 | `""`          |
| `initialFlagRegion2` | `boolean` | 初回読み込み時のRegion2用のフラグ  | `true`        |
| `initialFlagRegion3` | `boolean` | 初回読み込み時のRegion3用のフラグ  | `true`        |

## Computed Properties

| Name        | Type      | Description                                                                                                                               |
| ----------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `regionObj` | `unknown` | dataCsvを配列に変換(Object -> Array of Object)<br/>**Dependencies:** `dataCsv`                                                                  |
| `regions1`  | `unknown` | Regionの最上位の階層リスト（b-form-selectで使う）<br/>**Dependencies:** `regionObj`                                                                      |
| `regions2`  | `unknown` | Regionの2番目の階層（b-form-selectで使う）     プロパティkey2, key3の変更はemitで通知<br/>**Dependencies:** `key1Temp`, `regionObj`, `key2`, `$emit`             |
| `regions3`  | `unknown` | Regionの3番目の階層（b-form-selectで使う）     プロパティkey2, key3の変更はemitで通知<br/>**Dependencies:** `key1Temp`, `key2Temp`, `regionObj`, `$emit`, `key3` |
| `key1Temp`  | `unknown` | プロパティの代替変数<br/>**Dependencies:** `key1`                                                                                                   |
| `key2Temp`  | `unknown` | プロパティの代替変数<br/>**Dependencies:** `key2`                                                                                                   |
| `key3Temp`  | `unknown` | プロパティの代替変数<br/>**Dependencies:** `key3`                                                                                                   |

## Events

| Name          | Description |
| ------------- | ----------- |
| `update:key1` |             |
| `update:key2` |             |
| `update:key3` | &nbsp;      |

