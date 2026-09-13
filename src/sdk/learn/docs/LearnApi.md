# LearnApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**learnControllerCompleteV1**](#learncontrollercompletev1) | **POST** /api/v1/learn/lessons/{slug}/complete | Mark a lesson as completed and award XP|
|[**learnControllerCreateV1**](#learncontrollercreatev1) | **POST** /api/v1/learn/lessons | Create a lesson (admin or instructor)|
|[**learnControllerFindAllV1**](#learncontrollerfindallv1) | **GET** /api/v1/learn/lessons | Get published lessons|
|[**learnControllerFindBySlugV1**](#learncontrollerfindbyslugv1) | **GET** /api/v1/learn/lessons/{slug} | Get a lesson by slug with its content blocks|
|[**learnControllerRemoveV1**](#learncontrollerremovev1) | **DELETE** /api/v1/learn/lessons/{id} | Delete a lesson (admin or instructor)|
|[**learnControllerUpdateV1**](#learncontrollerupdatev1) | **PATCH** /api/v1/learn/lessons/{id} | Update a lesson (admin or instructor)|

# **learnControllerCompleteV1**
> learnControllerCompleteV1()


### Example

```typescript
import {
    LearnApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new LearnApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.learnControllerCompleteV1(
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

[access-token](../README.md#access-token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **learnControllerCreateV1**
> learnControllerCreateV1(createLessonDto)


### Example

```typescript
import {
    LearnApi,
    Configuration,
    CreateLessonDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new LearnApi(configuration);

let createLessonDto: CreateLessonDto; //

const { status, data } = await apiInstance.learnControllerCreateV1(
    createLessonDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createLessonDto** | **CreateLessonDto**|  | |


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

# **learnControllerFindAllV1**
> learnControllerFindAllV1()


### Example

```typescript
import {
    LearnApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new LearnApi(configuration);

const { status, data } = await apiInstance.learnControllerFindAllV1();
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

# **learnControllerFindBySlugV1**
> learnControllerFindBySlugV1()


### Example

```typescript
import {
    LearnApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new LearnApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.learnControllerFindBySlugV1(
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

# **learnControllerRemoveV1**
> learnControllerRemoveV1()


### Example

```typescript
import {
    LearnApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new LearnApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.learnControllerRemoveV1(
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

# **learnControllerUpdateV1**
> learnControllerUpdateV1(updateLessonDto)


### Example

```typescript
import {
    LearnApi,
    Configuration,
    UpdateLessonDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new LearnApi(configuration);

let id: string; // (default to undefined)
let updateLessonDto: UpdateLessonDto; //

const { status, data } = await apiInstance.learnControllerUpdateV1(
    id,
    updateLessonDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateLessonDto** | **UpdateLessonDto**|  | |
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

