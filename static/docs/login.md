# login

## Data

| Name               | Type     | Description | Initial value                                                                                           |
| ------------------ | -------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `user`             | `string` |             | `""`                                                                                                    |
| `pass`             | `string` |             | `""`                                                                                                    |
| `typePass`         | `string` |             | `"password"`                                                                                            |
| `errorMessage`     | `string` |             | `""`                                                                                                    |
| `errorMessageList` | `array`  |             | `[ 'login error: username or password does not match', 'registration error: username already in use' ]` |

## Computed Properties

| Name             | Type      | Description                                |
| ---------------- | --------- | ------------------------------------------ |
| `stateName`      | `unknown` | **Dependencies:** `user`                   |
| `statePass`      | `boolean` | **Dependencies:** `pass`                   |
| `inputValidate`  | `boolean` | **Dependencies:** `statePass`, `stateName` |
| `logOutValidate` | `any`     | **Dependencies:** `$store`                 |

## Methods

### togglePass()

**Syntax**

```typescript
togglePass(): void
```

### register()

**Syntax**

```typescript
async register(): Promise
```

### login()

**Syntax**

```typescript
async login(): Promise
```

### google()

**Syntax**

```typescript
google(): void
```

### anonymous()

**Syntax**

```typescript
anonymous(): void
```

### logOut()

**Syntax**

```typescript
logOut(): void
```

