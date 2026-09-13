# GamificationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**gamificationControllerGetMeV1**](#gamificationcontrollergetmev1) | **GET** /api/v1/gamification/me | Get your total XP|
|[**gamificationControllerLeaderboardV1**](#gamificationcontrollerleaderboardv1) | **GET** /api/v1/gamification/leaderboard | Get the current week\&#39;s leaderboard with tiers|

# **gamificationControllerGetMeV1**
> gamificationControllerGetMeV1()


### Example

```typescript
import {
    GamificationApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

const { status, data } = await apiInstance.gamificationControllerGetMeV1();
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

# **gamificationControllerLeaderboardV1**
> gamificationControllerLeaderboardV1()


### Example

```typescript
import {
    GamificationApi,
    Configuration
} from 'org';

const configuration = new Configuration();
const apiInstance = new GamificationApi(configuration);

let limit: number; // (optional) (default to undefined)
let offset: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.gamificationControllerLeaderboardV1(
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **offset** | [**number**] |  | (optional) defaults to undefined|


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

