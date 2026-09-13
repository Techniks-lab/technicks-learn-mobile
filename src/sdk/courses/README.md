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
*CoursesApi* | [**coursesControllerCheckInV1**](docs/CoursesApi.md#coursescontrollercheckinv1) | **POST** /api/v1/courses/{slug}/check-in | Daily course check-in — starts streak, awards XP
*CoursesApi* | [**coursesControllerCreateCategoryV1**](docs/CoursesApi.md#coursescontrollercreatecategoryv1) | **POST** /api/v1/courses/categories | Create a course category (admin or instructor)
*CoursesApi* | [**coursesControllerCreateV1**](docs/CoursesApi.md#coursescontrollercreatev1) | **POST** /api/v1/courses | Create a course (admin or instructor)
*CoursesApi* | [**coursesControllerDeleteCategoryV1**](docs/CoursesApi.md#coursescontrollerdeletecategoryv1) | **DELETE** /api/v1/courses/categories/{id} | Delete a course category (admin or instructor)
*CoursesApi* | [**coursesControllerEnrollV1**](docs/CoursesApi.md#coursescontrollerenrollv1) | **POST** /api/v1/courses/{slug}/enroll | Enroll in a course (idempotent)
*CoursesApi* | [**coursesControllerFindAllV1**](docs/CoursesApi.md#coursescontrollerfindallv1) | **GET** /api/v1/courses | Browse published courses with enrollment state
*CoursesApi* | [**coursesControllerFindBySlugV1**](docs/CoursesApi.md#coursescontrollerfindbyslugv1) | **GET** /api/v1/courses/{slug} | Course detail with published lessons
*CoursesApi* | [**coursesControllerFindMineV1**](docs/CoursesApi.md#coursescontrollerfindminev1) | **GET** /api/v1/courses/mine | Courses you are enrolled in with streaks
*CoursesApi* | [**coursesControllerListCategoriesV1**](docs/CoursesApi.md#coursescontrollerlistcategoriesv1) | **GET** /api/v1/courses/categories | List all course categories (public)
*CoursesApi* | [**coursesControllerRemoveV1**](docs/CoursesApi.md#coursescontrollerremovev1) | **DELETE** /api/v1/courses/{id} | Delete a course (admin or instructor)
*CoursesApi* | [**coursesControllerUnenrollV1**](docs/CoursesApi.md#coursescontrollerunenrollv1) | **POST** /api/v1/courses/{slug}/unenroll | Unenroll from a course (deletes enrollment + check-ins)
*CoursesApi* | [**coursesControllerUpdateV1**](docs/CoursesApi.md#coursescontrollerupdatev1) | **PATCH** /api/v1/courses/{id} | Update a course (admin or instructor)


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

