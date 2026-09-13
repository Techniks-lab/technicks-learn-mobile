# ChangePasswordDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**currentPassword** | **string** | Current password | [default to undefined]
**newPassword** | **string** | New password (min 8 chars, must include uppercase, lowercase, number) | [default to undefined]

## Example

```typescript
import { ChangePasswordDto } from 'org';

const instance: ChangePasswordDto = {
    currentPassword,
    newPassword,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
