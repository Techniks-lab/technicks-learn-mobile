# RegisterDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | User email address | [default to undefined]
**password** | **string** | Password (min 8 chars, must include uppercase, lowercase, number) | [default to undefined]
**fullName** | **string** | Full legal name | [optional] [default to undefined]

## Example

```typescript
import { RegisterDto } from 'org';

const instance: RegisterDto = {
    email,
    password,
    fullName,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
