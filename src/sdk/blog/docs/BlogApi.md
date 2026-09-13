# BlogApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**blogControllerCreateCommentV1**](#blogcontrollercreatecommentv1) | **POST** /api/v1/blogs/{id}/comments | Add a comment to a blog post|
|[**blogControllerCreateV1**](#blogcontrollercreatev1) | **POST** /api/v1/blogs | Create a blog post|
|[**blogControllerFindAllV1**](#blogcontrollerfindallv1) | **GET** /api/v1/blogs | Get published blog posts (public)|
|[**blogControllerFindBySlugV1**](#blogcontrollerfindbyslugv1) | **GET** /api/v1/blogs/{slug} | Get a blog post by slug|
|[**blogControllerFindMineV1**](#blogcontrollerfindminev1) | **GET** /api/v1/blogs/me | Get the current user\&#39;s blog posts (any status)|
|[**blogControllerGetCommentsV1**](#blogcontrollergetcommentsv1) | **GET** /api/v1/blogs/{id}/comments | Get comments for a blog post|
|[**blogControllerRemoveCommentV1**](#blogcontrollerremovecommentv1) | **DELETE** /api/v1/blogs/{postId}/comments/{commentId} | Delete a comment (author or admin)|
|[**blogControllerRemoveV1**](#blogcontrollerremovev1) | **DELETE** /api/v1/blogs/{id} | Delete a blog post (author or admin)|
|[**blogControllerToggleLikeV1**](#blogcontrollertogglelikev1) | **POST** /api/v1/blogs/{id}/like | Toggle like on a blog post|
|[**blogControllerUpdateV1**](#blogcontrollerupdatev1) | **PATCH** /api/v1/blogs/{id} | Update a blog post (author only)|

# **blogControllerCreateCommentV1**
> blogControllerCreateCommentV1(createCommentDto)


### Example

```typescript
import {
    BlogApi,
    Configuration,
    CreateCommentDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let id: string; // (default to undefined)
let createCommentDto: CreateCommentDto; //

const { status, data } = await apiInstance.blogControllerCreateCommentV1(
    id,
    createCommentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCommentDto** | **CreateCommentDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


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
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerCreateV1**
> blogControllerCreateV1(createPostDto)


### Example

```typescript
import {
    BlogApi,
    Configuration,
    CreatePostDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let createPostDto: CreatePostDto; //

const { status, data } = await apiInstance.blogControllerCreateV1(
    createPostDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPostDto** | **CreatePostDto**|  | |


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
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerFindAllV1**
> blogControllerFindAllV1()


### Example

```typescript
import {
    BlogApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let page: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)
let category: string; // (optional) (default to undefined)
let search: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.blogControllerFindAllV1(
    page,
    limit,
    category,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **category** | [**string**] |  | (optional) defaults to undefined|
| **search** | [**string**] |  | (optional) defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerFindBySlugV1**
> blogControllerFindBySlugV1()


### Example

```typescript
import {
    BlogApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.blogControllerFindBySlugV1(
    slug
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **slug** | [**string**] |  | defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerFindMineV1**
> blogControllerFindMineV1()


### Example

```typescript
import {
    BlogApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

const { status, data } = await apiInstance.blogControllerFindMineV1();
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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerGetCommentsV1**
> blogControllerGetCommentsV1()


### Example

```typescript
import {
    BlogApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let id: string; // (default to undefined)
let page: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.blogControllerGetCommentsV1(
    id,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerRemoveCommentV1**
> blogControllerRemoveCommentV1()


### Example

```typescript
import {
    BlogApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let postId: string; // (default to undefined)
let commentId: string; // (default to undefined)

const { status, data } = await apiInstance.blogControllerRemoveCommentV1(
    postId,
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] |  | defaults to undefined|
| **commentId** | [**string**] |  | defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerRemoveV1**
> blogControllerRemoveV1()


### Example

```typescript
import {
    BlogApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.blogControllerRemoveV1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerToggleLikeV1**
> blogControllerToggleLikeV1()


### Example

```typescript
import {
    BlogApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.blogControllerToggleLikeV1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **blogControllerUpdateV1**
> blogControllerUpdateV1(updatePostDto)


### Example

```typescript
import {
    BlogApi,
    Configuration,
    UpdatePostDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogApi(configuration);

let id: string; // (default to undefined)
let updatePostDto: UpdatePostDto; //

const { status, data } = await apiInstance.blogControllerUpdateV1(
    id,
    updatePostDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePostDto** | **UpdatePostDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

