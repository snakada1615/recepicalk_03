# importFct

## Data

| Name             | Type     | Description                                 | Initial value                                                                   |
| ---------------- | -------- | ------------------------------------------- | ------------------------------------------------------------------------------- |
| `collectionList` | `array`  | アプリで利用するデータベースのcollection一覧（form-selectで利用） | `[ {value: 'dataset', text: 'dataset'}, {value: 'users', text: 'user data'}, ]` |
| `myList`         | `array`  | collectionの下に登録されたdocumentの一覧               | `[]`                                                                            |
| `dataCsv`        | `string` | csvファイルから読み込んだデータ本体                         | `""`                                                                            |
| `collection1`    | `string` | コレクション名(csv登録用)                             | `""`                                                                            |
| `dbName1`        | `string` | ドキュメント名(csv登録用)                             | `""`                                                                            |
| `collection2`    | `string` | コレクション名(firebaseからの読み込み用)                   | `""`                                                                            |
| `dbName2`        | `string` | ドキュメント名(firebaseからの読み込み用)                   | `""`                                                                            |
| `keyCol`         | `string` | キーフィールドの指定                                  | `""`                                                                            |
| `dataFire`       | `string` | firebaseから読み込んだデータ本体                        | `""`                                                                            |
| `collection3`    | `string` | コレクション名(firebaseからの読み込み用)                   | `""`                                                                            |

## Computed Properties

| Name          | Type      | Description                                                                                        |
| ------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `dataJson`    | `unknown` | dataCsvをJsonに変換<br/>**Dependencies:** `dataCsv`, `keyCol`                                          |
| `myListHtml`  | `unknown` | myListをhtmlに変換<br/>**Dependencies:** `myList`                                                      |
| `fctValidate` | `unknown` | 読み込んだCSVがFCTの構造に必要なフィールドを含んでいるか検証<br/>**Dependencies:** `dataCsv`                                  |
| `importOk`    | `unknown` | csvをfirebaseに読み込めるかどうかのフラグ<br/>**Dependencies:** `fctValidate`, `collection1`, `dbName1`, `keyCol` |

## Methods

### setNewFct()

fctを別のファイルに切り替えて初期化

**Syntax**

```typescript
async setNewFct(fctName: unknown): Promise<void>
```

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

指定するコレクションに含まれるドキュメントの一覧を抽出

**Syntax**

```typescript
async getFileList(myCollection: unknown): Promise<void>
```

