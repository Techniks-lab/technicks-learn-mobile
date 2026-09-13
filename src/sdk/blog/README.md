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
*BlogApi* | [**blogControllerCreateCommentV1**](docs/BlogApi.md#blogcontrollercreatecommentv1) | **POST** /api/v1/blogs/{id}/comments | Add a comment to a blog post
*BlogApi* | [**blogControllerCreateV1**](docs/BlogApi.md#blogcontrollercreatev1) | **POST** /api/v1/blogs | Create a blog post
*BlogApi* | [**blogControllerFindAllV1**](docs/BlogApi.md#blogcontrollerfindallv1) | **GET** /api/v1/blogs | Get published blog posts (public)
*BlogApi* | [**blogControllerFindBySlugV1**](docs/BlogApi.md#blogcontrollerfindbyslugv1) | **GET** /api/v1/blogs/{slug} | Get a blog post by slug
*BlogApi* | [**blogControllerFindMineV1**](docs/BlogApi.md#blogcontrollerfindminev1) | **GET** /api/v1/blogs/me | Get the current user\&#39;s blog posts (any status)
*BlogApi* | [**blogControllerGetCommentsV1**](docs/BlogApi.md#blogcontrollergetcommentsv1) | **GET** /api/v1/blogs/{id}/comments | Get comments for a blog post
*BlogApi* | [**blogControllerRemoveCommentV1**](docs/BlogApi.md#blogcontrollerremovecommentv1) | **DELETE** /api/v1/blogs/{postId}/comments/{commentId} | Delete a comment (author or admin)
*BlogApi* | [**blogControllerRemoveV1**](docs/BlogApi.md#blogcontrollerremovev1) | **DELETE** /api/v1/blogs/{id} | Delete a blog post (author or admin)
*BlogApi* | [**blogControllerToggleLikeV1**](docs/BlogApi.md#blogcontrollertogglelikev1) | **POST** /api/v1/blogs/{id}/like | Toggle like on a blog post
*BlogApi* | [**blogControllerUpdateV1**](docs/BlogApi.md#blogcontrollerupdatev1) | **PATCH** /api/v1/blogs/{id} | Update a blog post (author only)


### Documentation For Models

 - [ChangePasswordDto](docs/ChangePasswordDto.md)
 - [CreateCategoryDto](docs/CreateCategoryDto.md)
 - [CreateCommentDto](docs/CreateCommentDto.md)
 - [CreatePostDto](docs/CreatePostDto.md)
 - [ForgotPasswordDto](docs/ForgotPasswordDto.md)
 - [LoginDto](docs/LoginDto.md)
 - [RegisterDto](docs/RegisterDto.md)
 - [ResendOtpDto](docs/ResendOtpDto.md)
 - [ResetPasswordDto](docs/ResetPasswordDto.md)
 - [SetUsernameDto](docs/SetUsernameDto.md)
 - [UpdateCategoryDto](docs/UpdateCategoryDto.md)
 - [UpdatePostDto](docs/UpdatePostDto.md)
 - [VerifyEmailDto](docs/VerifyEmailDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="access-token"></a>
### access-token

- **Type**: Bearer authentication (JWT)

