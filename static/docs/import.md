# import

## Data

| Name             | Type     | Description               | Initial value                                                                   |
| ---------------- | -------- | ------------------------- | ------------------------------------------------------------------------------- |
| `collectionList` | `array`  |                           | `[ {value: 'dataset', text: 'dataset'}, {value: 'users', text: 'user data'}, ]` |
| `key1`           | `string` |                           | `""`                                                                            |
| `key2`           | `string` |                           | `""`                                                                            |
| `key3`           | `string` |                           | `""`                                                                            |
| `myList`         | `array`  |                           | `[]`                                                                            |
| `dataCsv`        | `string` | csvファイルから読み込んだデータ本体       | `""`                                                                            |
| `collection1`    | `string` | コレクション名(csv登録用)           | `""`                                                                            |
| `dbName1`        | `string` | ドキュメント名(csv登録用)           | `""`                                                                            |
| `collection2`    | `string` | コレクション名(firebaseからの読み込み用) | `""`                                                                            |
| `dbName2`        | `string` | ドキュメント名(firebaseからの読み込み用) | `""`                                                                            |
| `keyCol`         | `string` | キーフィールドの指定                | `""`                                                                            |
| `dataFire`       | `string` | firebaseから読み込んだデータ本体      | `""`                                                                            |
| `collection3`    | `string` | コレクション名(firebaseからの読み込み用) | `""`                                                                            |

## Computed Properties

| Name         | Type      | Description                                               |
| ------------ | --------- | --------------------------------------------------------- |
| `dataJson`   | `unknown` | dataCsvをJsonに変換<br/>**Dependencies:** `dataCsv`, `keyCol` |
| `dataJson2`  | `unknown` | **Dependencies:** `dataCsv`                               |
| `regions1`   | `unknown` | **Dependencies:** `dataJson2`                             |
| `regions2`   | `unknown` | **Dependencies:** `key1`, `key2`, `key3`, `dataJson2`     |
| `regions3`   | `unknown` | **Dependencies:** `key1`, `key2`, `key3`, `dataJson2`     |
| `myListHtml` | `unknown` | **Dependencies:** `myList`                                |

## Methods

### insertData()

dataJsonをfirebaseに登録

**Syntax**

```typescript
async insertData(myCollection: unknown, myDoc: unknown, myDat: unknown): Promise<void>
```

### getData()

collection, dbNameで指定したドキュメントをfirebaseから読み込み

**Syntax**

```typescript
async getData(myCollection: unknown, myDoc: unknown): Promise<void>
```

### getFileList()

**Syntax**

```typescript
async getFileList(myCollection: unknown): Promise
```

