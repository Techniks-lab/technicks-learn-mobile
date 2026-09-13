## org@1.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install org@1.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AuthApi* | [**authControllerChangePasswordV1**](docs/AuthApi.md#authcontrollerchangepasswordv1) | **POST** /api/v1/auth/change-password | Change password (requires current password)
*AuthApi* | [**authControllerCheckUsernameV1**](docs/AuthApi.md#authcontrollercheckusernamev1) | **GET** /api/v1/auth/username/check | Check if a username is available
*AuthApi* | [**authControllerForgotPasswordV1**](docs/AuthApi.md#authcontrollerforgotpasswordv1) | **POST** /api/v1/auth/forgot-password | Request password reset OTP via email
*AuthApi* | [**authControllerLoginV1**](docs/AuthApi.md#authcontrollerloginv1) | **POST** /api/v1/auth/login | Login with email and password
*AuthApi* | [**authControllerLogoutV1**](docs/AuthApi.md#authcontrollerlogoutv1) | **POST** /api/v1/auth/logout | Logout and invalidate session
*AuthApi* | [**authControllerProfileV1**](docs/AuthApi.md#authcontrollerprofilev1) | **GET** /api/v1/auth/profile | Get the authenticated user profile
*AuthApi* | [**authControllerRefreshV1**](docs/AuthApi.md#authcontrollerrefreshv1) | **POST** /api/v1/auth/refresh | Refresh access token using refresh token
*AuthApi* | [**authControllerRegisterV1**](docs/AuthApi.md#authcontrollerregisterv1) | **POST** /api/v1/auth/register | Register a new user
*AuthApi* | [**authControllerResendOtpV1**](docs/AuthApi.md#authcontrollerresendotpv1) | **POST** /api/v1/auth/resend-otp | Resend the email verification OTP for an unverified account
*AuthApi* | [**authControllerResetPasswordV1**](docs/AuthApi.md#authcontrollerresetpasswordv1) | **POST** /api/v1/auth/reset-password | Reset password using OTP
*AuthApi* | [**authControllerSetUsernameV1**](docs/AuthApi.md#authcontrollersetusernamev1) | **POST** /api/v1/auth/username | Create or change the authenticated user username
*AuthApi* | [**authControllerUpdateProfileV1**](docs/AuthApi.md#authcontrollerupdateprofilev1) | **PATCH** /api/v1/auth/profile | Update the authenticated user profile (name/username)
*AuthApi* | [**authControllerVerifyEmailV1**](docs/AuthApi.md#authcontrollerverifyemailv1) | **POST** /api/v1/auth/verify-email | Verify email with the OTP sent at registration


### Documentation For Models

 - [AuthControllerRefreshV1Request](docs/AuthControllerRefreshV1Request.md)
 - [ChangePasswordDto](docs/ChangePasswordDto.md)
 - [CourseCheckInDto](docs/CourseCheckInDto.md)
 - [CreateCategoryDto](docs/CreateCategoryDto.md)
 - [CreateCommentDto](docs/CreateCommentDto.md)
 - [CreateCourseCategoryDto](docs/CreateCourseCategoryDto.md)
 - [CreateCourseDto](docs/CreateCourseDto.md)
 - [CreateLessonBlockDto](docs/CreateLessonBlockDto.md)
 - [CreateLessonDto](docs/CreateLessonDto.md)
 - [CreatePostDto](docs/CreatePostDto.md)
 - [ForgotPasswordDto](docs/ForgotPasswordDto.md)
 - [LoginDto](docs/LoginDto.md)
 - [RegisterDto](docs/RegisterDto.md)
 - [ResendOtpDto](docs/ResendOtpDto.md)
 - [ResetPasswordDto](docs/ResetPasswordDto.md)
 - [SetUsernameDto](docs/SetUsernameDto.md)
 - [UpdateCategoryDto](docs/UpdateCategoryDto.md)
 - [UpdateCourseDto](docs/UpdateCourseDto.md)
 - [UpdateLessonDto](docs/UpdateLessonDto.md)
 - [UpdatePostDto](docs/UpdatePostDto.md)
 - [UpdateProfileDto](docs/UpdateProfileDto.md)
 - [VerifyEmailDto](docs/VerifyEmailDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="access-token"></a>
### access-token

- **Type**: Bearer authentication (JWT)

