# CreateCourseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [default to undefined]
**slug** | **string** | URL slug; defaults to a slugified title | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**coverImage** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to StatusEnum_Draft]
**sortOrder** | **number** |  | [optional] [default to 0]

## Example

```typescript
import { CreateCourseDto } from 'org';

const instance: CreateCourseDto = {
    title,
    slug,
    description,
    coverImage,
    status,
    sortOrder,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
