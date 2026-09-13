# CreateLessonBlockDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**blockIndex** | **number** | Order of the block inside the lesson | [optional] [default to undefined]
**kind** | **string** |  | [default to undefined]
**text** | **string** | Markdown/plain content for HEADING and TEXT blocks | [optional] [default to undefined]
**url** | **string** | Remote URL for IMAGE and VIDEO blocks | [optional] [default to undefined]
**caption** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CreateLessonBlockDto } from 'org';

const instance: CreateLessonBlockDto = {
    blockIndex,
    kind,
    text,
    url,
    caption,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
