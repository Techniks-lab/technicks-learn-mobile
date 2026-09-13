# CoursesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**coursesControllerCheckInV1**](#coursescontrollercheckinv1) | **POST** /api/v1/courses/{slug}/check-in | Daily course check-in — starts streak, awards XP|
|[**coursesControllerCreateCategoryV1**](#coursescontrollercreatecategoryv1) | **POST** /api/v1/courses/categories | Create a course category (admin or instructor)|
|[**coursesControllerCreateV1**](#coursescontrollercreatev1) | **POST** /api/v1/courses | Create a course (admin or instructor)|
|[**coursesControllerDeleteCategoryV1**](#coursescontrollerdeletecategoryv1) | **DELETE** /api/v1/courses/categories/{id} | Delete a course category (admin or instructor)|
|[**coursesControllerEnrollV1**](#coursescontrollerenrollv1) | **POST** /api/v1/courses/{slug}/enroll | Enroll in a course (idempotent)|
|[**coursesControllerFindAllV1**](#coursescontrollerfindallv1) | **GET** /api/v1/courses | Browse published courses with enrollment state|
|[**coursesControllerFindBySlugV1**](#coursescontrollerfindbyslugv1) | **GET** /api/v1/courses/{slug} | Course detail with published lessons|
|[**coursesControllerFindMineV1**](#coursescontrollerfindminev1) | **GET** /api/v1/courses/mine | Courses you are enrolled in with streaks|
|[**coursesControllerListCategoriesV1**](#coursescontrollerlistcategoriesv1) | **GET** /api/v1/courses/categories | List all course categories (public)|
|[**coursesControllerRemoveV1**](#coursescontrollerremovev1) | **DELETE** /api/v1/courses/{id} | Delete a course (admin or instructor)|
|[**coursesControllerUnenrollV1**](#coursescontrollerunenrollv1) | **POST** /api/v1/courses/{slug}/unenroll | Unenroll from a course (deletes enrollment + check-ins)|
|[**coursesControllerUpdateV1**](#coursescontrollerupdatev1) | **PATCH** /api/v1/courses/{id} | Update a course (admin or instructor)|

# **coursesControllerCheckInV1**
> coursesControllerCheckInV1(courseCheckInDto)


### Example

```typescript
import {
    CoursesApi,
    Configuration,
    CourseCheckInDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let slug: string; // (default to undefined)
let courseCheckInDto: CourseCheckInDto; //

const { status, data } = await apiInstance.coursesControllerCheckInV1(
    slug,
    courseCheckInDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseCheckInDto** | **CourseCheckInDto**|  | |
| **slug** | [**string**] |  | defaults to undefined|


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

# **coursesControllerCreateCategoryV1**
> coursesControllerCreateCategoryV1(createCourseCategoryDto)


### Example

```typescript
import {
    CoursesApi,
    Configuration,
    CreateCourseCategoryDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let createCourseCategoryDto: CreateCourseCategoryDto; //

const { status, data } = await apiInstance.coursesControllerCreateCategoryV1(
    createCourseCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCourseCategoryDto** | **CreateCourseCategoryDto**|  | |


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

# **coursesControllerCreateV1**
> coursesControllerCreateV1(createCourseDto)


### Example

```typescript
import {
    CoursesApi,
    Configuration,
    CreateCourseDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let createCourseDto: CreateCourseDto; //

const { status, data } = await apiInstance.coursesControllerCreateV1(
    createCourseDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCourseDto** | **CreateCourseDto**|  | |


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

# **coursesControllerDeleteCategoryV1**
> coursesControllerDeleteCategoryV1()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let id: string; // (default to undefined)
let force: boolean; //Detach from all courses before deleting (optional) (default to undefined)

const { status, data } = await apiInstance.coursesControllerDeleteCategoryV1(
    id,
    force
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **force** | [**boolean**] | Detach from all courses before deleting | (optional) defaults to undefined|


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

# **coursesControllerEnrollV1**
> coursesControllerEnrollV1()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.coursesControllerEnrollV1(
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

# **coursesControllerFindAllV1**
> coursesControllerFindAllV1()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let search: string; // (optional) (default to undefined)
let category: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.coursesControllerFindAllV1(
    search,
    category
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] |  | (optional) defaults to undefined|
| **category** | [**string**] |  | (optional) defaults to undefined|


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

# **coursesControllerFindBySlugV1**
> coursesControllerFindBySlugV1()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.coursesControllerFindBySlugV1(
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

# **coursesControllerFindMineV1**
> coursesControllerFindMineV1()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

const { status, data } = await apiInstance.coursesControllerFindMineV1();
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

# **coursesControllerListCategoriesV1**
> coursesControllerListCategoriesV1()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

const { status, data } = await apiInstance.coursesControllerListCategoriesV1();
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

# **coursesControllerRemoveV1**
> coursesControllerRemoveV1()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.coursesControllerRemoveV1(
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

# **coursesControllerUnenrollV1**
> coursesControllerUnenrollV1()


### Example

```typescript
import {
    CoursesApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.coursesControllerUnenrollV1(
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

# **coursesControllerUpdateV1**
> coursesControllerUpdateV1(updateCourseDto)


### Example

```typescript
import {
    CoursesApi,
    Configuration,
    UpdateCourseDto
} from 'org';

const configuration = new Configuration();
const apiInstance = new CoursesApi(configuration);

let id: string; // (default to undefined)
let updateCourseDto: UpdateCourseDto; //

const { status, data } = await apiInstance.coursesControllerUpdateV1(
    id,
    updateCourseDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCourseDto** | **UpdateCourseDto**|  | |
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

