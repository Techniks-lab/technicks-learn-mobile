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
*GamificationApi* | [**gamificationControllerGetMeV1**](docs/GamificationApi.md#gamificationcontrollergetmev1) | **GET** /api/v1/gamification/me | Get your total XP
*GamificationApi* | [**gamificationControllerLeaderboardV1**](docs/GamificationApi.md#gamificationcontrollerleaderboardv1) | **GET** /api/v1/gamification/leaderboard | Get the current week\&#39;s leaderboard with tiers


### Documentation For Models

 - [ChangePasswordDto](docs/ChangePasswordDto.md)
 - [CourseCheckInDto](docs/CourseCheckInDto.md)
 - [CreateCategoryDto](docs/CreateCategoryDto.md)
 - [CreateCommentDto](docs/CreateCommentDto.md)
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
 - [VerifyEmailDto](docs/VerifyEmailDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="access-token"></a>
### access-token

- **Type**: Bearer authentication (JWT)

