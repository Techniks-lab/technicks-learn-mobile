# ResetPasswordDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**token** | **string** | 6-digit OTP from email | [default to undefined]
**newPassword** | **string** | New password (min 8 chars, must include uppercase, lowercase, number) | [default to undefined]

## Example

```typescript
import { ResetPasswordDto } from 'org';

const instance: ResetPasswordDto = {
    token,
    newPassword,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
