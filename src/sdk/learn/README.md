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
*LearnApi* | [**learnControllerCompleteV1**](docs/LearnApi.md#learncontrollercompletev1) | **POST** /api/v1/learn/lessons/{slug}/complete | Mark a lesson as completed and award XP
*LearnApi* | [**learnControllerCreateV1**](docs/LearnApi.md#learncontrollercreatev1) | **POST** /api/v1/learn/lessons | Create a lesson (admin or instructor)
*LearnApi* | [**learnControllerFindAllV1**](docs/LearnApi.md#learncontrollerfindallv1) | **GET** /api/v1/learn/lessons | Get published lessons
*LearnApi* | [**learnControllerFindBySlugV1**](docs/LearnApi.md#learncontrollerfindbyslugv1) | **GET** /api/v1/learn/lessons/{slug} | Get a lesson by slug with its content blocks
*LearnApi* | [**learnControllerRemoveV1**](docs/LearnApi.md#learncontrollerremovev1) | **DELETE** /api/v1/learn/lessons/{id} | Delete a lesson (admin or instructor)
*LearnApi* | [**learnControllerUpdateV1**](docs/LearnApi.md#learncontrollerupdatev1) | **PATCH** /api/v1/learn/lessons/{id} | Update a lesson (admin or instructor)


### Documentation For Models

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
 - [VerifyEmailDto](docs/VerifyEmailDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="access-token"></a>
### access-token

- **Type**: Bearer authentication (JWT)

