# csvImport

- **disc** - csvファイルをjsonに変換して返す

## Props

| Name        | Type      | Description                 | Default |
| ----------- | --------- | --------------------------- | ------- |
| `show-data` | `Boolean` | 取得後のCSVファイルを表示するかどうか判定するフラグ | `true`  |

## Data

| Name   | Type    | Description    | Initial value |
| ------ | ------- | -------------- | ------------- |
| `data` | `array` | 読み込んだCSVを配列に保存 | `[]`          |

## Events

| Name     | Description                                                                               |
| -------- | ----------------------------------------------------------------------------------------- |
| `getCsv` | CSV読み込み完了後にgetCsvで親コンポーネントに値を返す<br/>**Arguments**<br/><ul><li>**`data: array`**</li></ul> |

## Methods

### handle()

ファイルが選択された際にトリガー
eventからファイル内容を受け取り、splitで分割して配列に返す

**Syntax**

```typescript
handle(event: unknown): void
```

**Parameters**

- `event: unknown`<br/>
  formから入力されたfile

