# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerChangePasswordV1**](#authcontrollerchangepasswordv1) | **POST** /api/v1/auth/change-password | Change password (requires current password)|
|[**authControllerCheckUsernameV1**](#authcontrollercheckusernamev1) | **GET** /api/v1/auth/username/check | Check if a username is available|
|[**authControllerForgotPasswordV1**](#authcontrollerforgotpasswordv1) | **POST** /api/v1/auth/forgot-password | Request password reset OTP via email|
|[**authControllerLoginV1**](#authcontrollerloginv1) | **POST** /api/v1/auth/login | Login with email and password|
|[**authControllerLogoutV1**](#authcontrollerlogoutv1) | **POST** /api/v1/auth/logout | Logout and invalidate session|
|[**authControllerProfileV1**](#authcontrollerprofilev1) | **GET** /api/v1/auth/profile | Get the authenticated user profile|
|[**authControllerRefreshV1**](#authcontrollerrefreshv1) | **POST** /api/v1/auth/refresh | Refresh access token using refresh token|
|[**authControllerRegisterV1**](#authcontrollerregisterv1) | **POST** /api/v1/auth/register | Register a new user|
|[**authControllerResendOtpV1**](#authcontrollerresendotpv1) | **POST** /api/v1/auth/resend-otp | Resend the email verification OTP for an unverified account|
|[**authControllerResetPasswordV1**](#authcontrollerresetpasswordv1) | **POST** /api/v1/auth/reset-password | Reset password using OTP|
|[**authControllerSetUsernameV1**](#authcontrollersetusernamev1) | **POST** /api/v1/auth/username | Create or change the authenticated user username|
|[**authControllerVerifyEmailV1**](#authcontrollerverifyemailv1) | **POST** /api/v1/auth/verify-email | Verify email with the OTP sent at registration|

# **authControllerChangePasswordV1**
> authControllerChangePasswordV1(changePasswordDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    ChangePasswordDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let changePasswordDto: ChangePasswordDto; //

const { status, data } = await apiInstance.authControllerChangePasswordV1(
    changePasswordDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePasswordDto** | **ChangePasswordDto**|  | |


### Return type

void (empty response body)

### Authorization

[access-token](../README.md#access-token)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Password changed successfully |  -  |
|**401** | Current password is incorrect |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerCheckUsernameV1**
> authControllerCheckUsernameV1()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let username: string; // (default to undefined)

const { status, data } = await apiInstance.authControllerCheckUsernameV1(
    username
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **username** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Availability check result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerForgotPasswordV1**
> authControllerForgotPasswordV1(forgotPasswordDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    ForgotPasswordDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let forgotPasswordDto: ForgotPasswordDto; //

const { status, data } = await apiInstance.authControllerForgotPasswordV1(
    forgotPasswordDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **forgotPasswordDto** | **ForgotPasswordDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OTP sent if account exists |  -  |
|**429** | Too many OTP requests |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLoginV1**
> authControllerLoginV1(loginDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    LoginDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let loginDto: LoginDto; //

const { status, data } = await apiInstance.authControllerLoginV1(
    loginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginDto** | **LoginDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful, returns tokens |  -  |
|**401** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogoutV1**
> authControllerLogoutV1()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authControllerLogoutV1();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[access-token](../README.md#access-token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Logged out successfully |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerProfileV1**
> authControllerProfileV1()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authControllerProfileV1();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[access-token](../README.md#access-token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Profile retrieved successfully |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRefreshV1**
> authControllerRefreshV1(authControllerRefreshV1Request)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthControllerRefreshV1Request
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authControllerRefreshV1Request: AuthControllerRefreshV1Request; //

const { status, data } = await apiInstance.authControllerRefreshV1(
    authControllerRefreshV1Request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authControllerRefreshV1Request** | **AuthControllerRefreshV1Request**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | New tokens returned |  -  |
|**401** | Invalid refresh token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRegisterV1**
> authControllerRegisterV1(registerDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    RegisterDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let registerDto: RegisterDto; //

const { status, data } = await apiInstance.authControllerRegisterV1(
    registerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerDto** | **RegisterDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | User registered (or OTP re-sent to an unverified account) successfully |  -  |
|**409** | Email or username already exists |  -  |
|**429** | Too many registration attempts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerResendOtpV1**
> authControllerResendOtpV1(resendOtpDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    ResendOtpDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let resendOtpDto: ResendOtpDto; //

const { status, data } = await apiInstance.authControllerResendOtpV1(
    resendOtpDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resendOtpDto** | **ResendOtpDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OTP re-sent if the email is pending verification |  -  |
|**429** | Too many OTP requests |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerResetPasswordV1**
> authControllerResetPasswordV1(resetPasswordDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    ResetPasswordDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let resetPasswordDto: ResetPasswordDto; //

const { status, data } = await apiInstance.authControllerResetPasswordV1(
    resetPasswordDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetPasswordDto** | **ResetPasswordDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Password reset successfully |  -  |
|**400** | Invalid or expired OTP |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerSetUsernameV1**
> authControllerSetUsernameV1(setUsernameDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    SetUsernameDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let setUsernameDto: SetUsernameDto; //

const { status, data } = await apiInstance.authControllerSetUsernameV1(
    setUsernameDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setUsernameDto** | **SetUsernameDto**|  | |


### Return type

void (empty response body)

### Authorization

[access-token](../README.md#access-token)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Username set (created: true) or changed (created: false) |  -  |
|**401** | Unauthorized |  -  |
|**409** | Username already taken |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerifyEmailV1**
> authControllerVerifyEmailV1(verifyEmailDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    VerifyEmailDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let verifyEmailDto: VerifyEmailDto; //

const { status, data } = await apiInstance.authControllerVerifyEmailV1(
    verifyEmailDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyEmailDto** | **VerifyEmailDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Email verified successfully |  -  |
|**400** | Invalid or expired OTP |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

