# userInfo

## Data

| Name      | Type     | Description                | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------- | -------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`    | `object` | state.fire.myApp.userのクローン | `{"displayName":{"type":"string","value":"","raw":"\"\"","member":false},"country":{"type":"string","value":"","raw":"\"\"","member":false},"organization":{"type":"string","value":"","raw":"\"\"","member":false},"title":{"type":"string","value":"","raw":"\"\"","member":false},"uid":{"type":"string","value":"","raw":"\"\"","member":false},"phoneNumber":{"type":"string","value":"","raw":"\"\"","member":false},"subnational1":{"type":"string","value":"","raw":"\"\"","member":false},"subnational2":{"type":"string","value":"","raw":"\"\"","member":false},"subnational3":{"type":"string","value":"","raw":"\"\"","member":false}}` |
| `dataCsv` | `string` | csvファイルから読み込んだデータ本体        | `""`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Methods

### updateUserInfo()

**Syntax**

```typescript
async updateUserInfo(): Promise
```

