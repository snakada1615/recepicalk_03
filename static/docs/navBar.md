# navBar

## Computed Properties

| Name                 | Type     | Description                                                                      |
| -------------------- | -------- | -------------------------------------------------------------------------------- |
| `hasDocumentChanged` | `object` | データ更新の有無($store.state.fire.hasDocumentChanged)を確認<br/>**Dependencies:** `$store` |
| `isLoggedIn`         | `object` | **Dependencies:** `$store`                                                       |

## Methods

### beforeUnloadListener()

ページの遷移前にユーザーに確認し、

**Syntax**

```typescript
beforeUnloadListener(event: unknown): string
```

### fireSaveAppdata()

myAppをfireStoreに保存

**Syntax**

```typescript
fireSaveAppdata(): void
```

### resetData()

**Syntax**

```typescript
resetData(): void
```

