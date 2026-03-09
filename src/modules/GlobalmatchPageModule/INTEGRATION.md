# GlobalMatch AI Backend Integration

This directory contains the integration between the frontend GlobalMatch feature and the Boundless backend API.

## Files Structure

### Core Files

- **`api-types.ts`** - TypeScript interfaces for all API requests and responses
- **`api-config.ts`** - Centralized API configuration and endpoint constants
- **`recommendation.service.ts`** - Service layer for recommendation API calls

### Component Files

- **`types.ts`** - Component-specific types for the upload modal
- **`DocumentStep.tsx`** - File upload step
- **`PreferenceStep.tsx`** - User preference selection step
- **`SummaryStep.tsx`** - Review step before submission
- **`ResultStep.tsx`** - Display recommendation results
- **`index.tsx`** - Main modal orchestrator

## Environment Variables

Add the following to your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## API Integration Flow

1. **User uploads files** (DocumentStep)
   - CV file (required)
   - Transcript file (required)
   - Files are stored as File objects in component state

2. **User selects preferences** (PreferenceStep)
   - Regions/continents
   - Countries
   - Fields of study
   - Degree level (required)
   - Languages
   - Budget preferences
   - Scholarship types
   - Start periods
   - Additional preferences (optional)

3. **User reviews submission** (SummaryStep)
   - Can edit preferences
   - Confirms submission

4. **API submission** (handled in UploadModal/index.tsx)
   - Builds FormData with files and preferences
   - Calls `submitRecommendation()` service function
   - Auto-detects mode based on files:
     - Both CV + Transcript → `/recommendations/profile`
     - Transcript only → `/recommendations/transcript`
     - CV only → `/recommendations/cv`
   - Handles loading and error states

5. **Display results** (ResultStep)
   - Student profile summary
   - Top program recommendations
   - Scholarship recommendations
   - Application strategy
   - Final notes

## Service Functions

### `submitRecommendation(data: RecommendationFormData)`

Main function that auto-detects the appropriate endpoint based on files provided.

**Parameters:**
- `data.cv_file` - File object for CV
- `data.transcript_file` - File object for transcript
- `data.continents` - Array of continent preferences
- `data.countries` - Array of country preferences
- `data.fields_of_study` - Array of field preferences
- `data.degree_level` - Degree level (bachelor|master|phd)
- `data.languages` - Array of language preferences
- `data.budget_preferences` - Array of budget preferences
- `data.scholarship_types` - Array of scholarship type preferences
- `data.start_periods` - Array of start period preferences
- `data.additional_preference` - Optional additional text

**Returns:** `Promise<ProfileSubmissionResponse>`

### `getSubmissionDetails(submissionId: string)`

Retrieves details of a previous submission.

**Returns:** `Promise<SubmissionDetails>`

## Error Handling

The service includes a custom `ApiError` class that provides:
- HTTP status code
- Error message
- Original API error response

Errors are caught and displayed in the modal with appropriate messaging.

## Example Usage

```typescript
import { submitRecommendation } from "@/services/recommendation.service";

const result = await submitRecommendation({
  cv_file: cvFileObject,
  transcript_file: transcriptFileObject,
  countries: ["Japan", "Singapore"],
  fields_of_study: ["Computer Science"],
  degree_level: "master",
  languages: ["English"],
  scholarship_types: ["fully-funded"],
  start_periods: ["Fall 2026"],
});

console.log(result.submission_id);
console.log(result.result.top_recommendations);
```

## Testing

To test the integration:

1. Start the backend server on `http://localhost:8080`
2. Start the Next.js dev server
3. Navigate to `/globalmatch`
4. Click "Submit CV & Transkrip untuk Rekomendasi"
5. Upload files and fill preferences
6. Submit and view results

## Notes

- All recommendation endpoints require authentication (add Bearer token in production)
- The `getAuthToken()` function in the service is a placeholder - implement based on your auth system
- File size limit is 10MB per file (enforced by backend)
- Supported file formats: PDF, DOC, DOCX
- Results are cached in component state until modal is closed
