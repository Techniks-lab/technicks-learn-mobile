# UpdateLessonDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [optional] [default to undefined]
**courseId** | **string** |  | [optional] [default to undefined]
**slug** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**sortOrder** | **number** |  | [optional] [default to undefined]
**blocks** | [**Array&lt;CreateLessonBlockDto&gt;**](CreateLessonBlockDto.md) | Replaces all blocks when provided | [optional] [default to undefined]

## Example

```typescript
import { UpdateLessonDto } from 'org';

const instance: UpdateLessonDto = {
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
