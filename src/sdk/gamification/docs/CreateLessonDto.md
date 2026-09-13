# CreateLessonDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [default to undefined]
**courseId** | **string** |  | [default to undefined]
**slug** | **string** | URL slug; defaults to a slugified title | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to StatusEnum_Draft]
**sortOrder** | **number** |  | [optional] [default to 0]
**blocks** | [**Array&lt;CreateLessonBlockDto&gt;**](CreateLessonBlockDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CreateLessonDto } from 'org';

const instance: CreateLessonDto = {
    title,
    courseId,
    slug,
    description,
    status,
    sortOrder,
    blocks,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
