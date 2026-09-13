# BlogCategoriesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**categoryControllerCreateV1**](#categorycontrollercreatev1) | **POST** /api/v1/blogs/categories | Create a category (admin only)|
|[**categoryControllerFindAllV1**](#categorycontrollerfindallv1) | **GET** /api/v1/blogs/categories | List all blog categories (public)|
|[**categoryControllerFindOneV1**](#categorycontrollerfindonev1) | **GET** /api/v1/blogs/categories/{identifier} | Get a category by id or slug (public)|
|[**categoryControllerRemoveV1**](#categorycontrollerremovev1) | **DELETE** /api/v1/blogs/categories/{id} | Delete a category (admin only)|
|[**categoryControllerUpdateV1**](#categorycontrollerupdatev1) | **PATCH** /api/v1/blogs/categories/{id} | Update a category (admin only)|

# **categoryControllerCreateV1**
> categoryControllerCreateV1(createCategoryDto)


### Example

```typescript
import {
    BlogCategoriesApi,
    Configuration,
    CreateCategoryDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogCategoriesApi(configuration);

let createCategoryDto: CreateCategoryDto; //

const { status, data } = await apiInstance.categoryControllerCreateV1(
    createCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCategoryDto** | **CreateCategoryDto**|  | |


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

# **categoryControllerFindAllV1**
> categoryControllerFindAllV1()


### Example

```typescript
import {
    BlogCategoriesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogCategoriesApi(configuration);

const { status, data } = await apiInstance.categoryControllerFindAllV1();
```

### Parameters
This endpoint does not have any parameters.


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

# **categoryControllerFindOneV1**
> categoryControllerFindOneV1()


### Example

```typescript
import {
    BlogCategoriesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogCategoriesApi(configuration);

let identifier: string; // (default to undefined)

const { status, data } = await apiInstance.categoryControllerFindOneV1(
    identifier
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identifier** | [**string**] |  | defaults to undefined|


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

# **categoryControllerRemoveV1**
> categoryControllerRemoveV1()


### Example

```typescript
import {
    BlogCategoriesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogCategoriesApi(configuration);

let id: string; // (default to undefined)
let force: boolean; //Detach from all posts before deleting (optional) (default to undefined)

const { status, data } = await apiInstance.categoryControllerRemoveV1(
    id,
    force
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **force** | [**boolean**] | Detach from all posts before deleting | (optional) defaults to undefined|


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

# **categoryControllerUpdateV1**
> categoryControllerUpdateV1(updateCategoryDto)


### Example

```typescript
import {
    BlogCategoriesApi,
    Configuration,
    UpdateCategoryDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new BlogCategoriesApi(configuration);

let id: string; // (default to undefined)
let updateCategoryDto: UpdateCategoryDto; //

const { status, data } = await apiInstance.categoryControllerUpdateV1(
    id,
    updateCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCategoryDto** | **UpdateCategoryDto**|  | |
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

