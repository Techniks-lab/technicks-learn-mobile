# CreatePostDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [default to undefined]
**slug** | **string** |  | [optional] [default to undefined]
**excerpt** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [default to undefined]
**coverImage** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to StatusEnum_Draft]
**categoryIds** | **Array&lt;string&gt;** | Array of category IDs | [optional] [default to undefined]

## Example

```typescript
import { CreatePostDto } from 'org';

const instance: CreatePostDto = {
    title,
    slug,
    excerpt,
    content,
    coverImage,
    status,
    categoryIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
