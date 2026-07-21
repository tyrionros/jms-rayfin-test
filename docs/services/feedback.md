# feedback Service

## Overview
The **feedback** service handles the submission of user feedback to the backend. It captures user ratings, messages, and metadata, storing them in the Rayfin database for later analysis and improvement purposes.

## Location
`src/services/feedback.ts`

## Purpose
- **Feedback Collection**: Capture user ratings and comments
- **Data Persistence**: Store feedback in Rayfin backend
- **User Context**: Track feedback by user and page
- **Error Handling**: Validate and report submission errors

## Exports

### `FeedbackData` Interface
```typescript
interface FeedbackData {
  userEmail: string;      // User's email address
  rating: number;         // Star rating (1-5)
  subject: string;        // Page or feature name
  message: string;        // Optional user comment
}
```

Data structure passed to submit feedback.

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `userEmail` | string | Yes | "user@example.com" |
| `rating` | number | Yes | 5 |
| `subject` | string | Yes | "HomePage" |
| `message` | string | Yes | "Great experience!" |

### `submitFeedback(data: FeedbackData)`
Submits user feedback to the backend.

**Parameters:**
- `data`: FeedbackData object with user feedback

**Returns:**
- `Promise<string>` - Feedback record ID from backend

**Errors:**
- Throws error if:
  - User not authenticated
  - Network error occurs
  - Backend validation fails
  - Database operation fails

**Usage:**
```typescript
const feedbackId = await submitFeedback({
  userEmail: 'user@example.com',
  rating: 5,
  subject: 'HomePage',
  message: 'Love the new design!',
});

console.log('Feedback submitted:', feedbackId);
```

## Data Model

### Feedback Record (Rayfin)
```typescript
{
  id: string;              // Generated ID
  user_id: string;         // User who submitted
  user_email: string;      // User email
  subject: string;         // Page/feature feedback about
  message: string;         // Feedback text
  rating: number;          // 1-5 star rating
  createdAt: Date;         // Submission timestamp
}
```

The record is stored in the Rayfin `Feedback` table.

## Implementation Details

### Authentication Check
```typescript
const session = client.auth.getSession();

if (!session.isAuthenticated || !session.user) {
  throw new Error('Cannot submit feedback: user is not authenticated.');
}
```

Ensures only authenticated users can submit feedback.

### Data Creation
```typescript
const feedback = await client.data.Feedback.create({
  user_id: session.user.id,
  user_email: data.userEmail,
  subject: data.subject,
  message: data.message,
  rating: data.rating,
  createdAt: new Date(),
});
```

Stores complete feedback record with metadata.

## Usage Examples

### In FeedbackModal Component
```typescript
import { submitFeedback } from '@/services/feedback';

async function handleSubmit(feedbackData: FeedbackData) {
  try {
    const feedbackId = await submitFeedback(feedbackData);
    console.log('Feedback received:', feedbackId);
    showSuccessMessage('Thank you for your feedback!');
  } catch (error) {
    showErrorMessage('Failed to submit feedback');
    console.error('Feedback error:', error);
  }
}
```

### With Feedback Modal
```typescript
import { submitFeedback } from '@/services/feedback';

export function FeedbackModal({ onClose }) {
  const handleSubmit = async () => {
    try {
      const id = await submitFeedback({
        userEmail: user.email,
        rating: rating,
        subject: currentPage,
        message: feedbackText,
      });
      
      alert('Thank you for your feedback!');
      onClose();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    // Modal form...
  );
}
```

### Batch Processing
```typescript
import { submitFeedback } from '@/services/feedback';

// Submit multiple feedbacks
const feedbackList = [
  { userEmail: 'user1@example.com', rating: 5, subject: 'Home', message: 'Great!' },
  { userEmail: 'user2@example.com', rating: 4, subject: 'Home', message: 'Good' },
];

const results = await Promise.all(
  feedbackList.map(feedback => submitFeedback(feedback))
);

console.log('Submitted feedbacks:', results);
```

## Error Handling

### User Not Authenticated
```typescript
// Thrown before any submission attempt
Error: 'Cannot submit feedback: user is not authenticated.'
```

**Solution:** Ensure user is logged in before opening feedback modal.

### Network Errors
```typescript
try {
  await submitFeedback(data);
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network issue - feedback not saved');
  }
}
```

**Solution:** Retry submission or show offline message.

### Backend Validation Errors
```typescript
try {
  await submitFeedback({
    rating: 0,  // Invalid (must be 1-5)
    // ...
  });
} catch (error) {
  console.error('Validation failed:', error);
}
```

**Solution:** Client-side validation in FeedbackModal.

## Data Flow

```
User opens Feedback Modal
    ↓
Enters rating (1-5)
    ↓
Optionally enters message
    ↓
Clicks Submit
    ↓
FeedbackModal calls submitFeedback()
    ↓
Service gets Rayfin client
    ↓
Gets current user session
    ↓
Validates user is authenticated
    ↓
Calls client.data.Feedback.create()
    ↓
Backend persists feedback
    ↓
Returns feedback ID
    ↓
Show success message
    ↓
Close modal
```

## Integration Points

### FeedbackModal Component
- Collects feedback data from user
- Calls submitFeedback() on submit
- Displays loading/error states
- Shows success message

### FloatingFeedbackButton
- Triggers FeedbackModal
- Passes user context
- Passes current page name

### Rayfin Backend
- Stores feedback in Feedback table
- Enforces authentication
- Returns record ID

## Validation

### Client-Side (FeedbackModal)
- Rating: 1-5 required
- Message: optional
- Email: passed from user context

### Server-Side (Rayfin)
- User must be authenticated
- All required fields present
- Rating valid range
- Email format valid

## Security Considerations

### User Privacy
- Email is collected but consider privacy implications
- Message may contain sensitive info
- Store securely in backend
- Don't expose feedback publicly

### Authentication
- Requires active session
- User ID tied to feedback
- Server validates on receipt

### Data Validation
- Sanitize message text
- Validate rating bounds
- Check email format
- Prevent injection attacks

## Performance Considerations

### API Call
Single API call per submission:
- Minimal payload size
- Synchronous operation
- Should complete in <1 second

### Database Write
Record persisted immediately:
- Single table write
- No complex joins
- Fast insert operation

### Caching
No caching applied - direct submission.

## Monitoring & Analytics

### Feedback Metrics
Track in backend:
- Total feedback count
- Average rating per page
- Common issues/messages
- User engagement

### Error Tracking
Monitor:
- Submission failures
- Auth errors
- Network errors
- Validation failures

## Testing

```typescript
import { submitFeedback } from '@/services/feedback';
import { getRayfinClient } from '@/services/rayfinClient';

jest.mock('@/services/rayfinClient');

test('submits feedback successfully', async () => {
  const mockCreate = jest.fn().mockResolvedValue({ id: 'fb-123' });
  
  getRayfinClient.mockReturnValue({
    auth: {
      getSession: () => ({
        isAuthenticated: true,
        user: { id: 'user-123' },
      }),
    },
    data: {
      Feedback: {
        create: mockCreate,
      },
    },
  });

  const result = await submitFeedback({
    userEmail: 'user@example.com',
    rating: 5,
    subject: 'HomePage',
    message: 'Great app!',
  });

  expect(result).toBe('fb-123');
  expect(mockCreate).toHaveBeenCalledWith({
    user_id: 'user-123',
    user_email: 'user@example.com',
    rating: 5,
    subject: 'HomePage',
    message: 'Great app!',
    createdAt: expect.any(Date),
  });
});

test('throws error when not authenticated', async () => {
  getRayfinClient.mockReturnValue({
    auth: {
      getSession: () => ({
        isAuthenticated: false,
        user: null,
      }),
    },
  });

  await expect(
    submitFeedback({
      userEmail: 'user@example.com',
      rating: 5,
      subject: 'HomePage',
      message: 'Test',
    })
  ).rejects.toThrow('Cannot submit feedback: user is not authenticated.');
});

test('includes current timestamp', async () => {
  const mockCreate = jest.fn().mockResolvedValue({ id: 'fb-123' });
  
  getRayfinClient.mockReturnValue({
    auth: {
      getSession: () => ({
        isAuthenticated: true,
        user: { id: 'user-123' },
      }),
    },
    data: {
      Feedback: {
        create: mockCreate,
      },
    },
  });

  const beforeTime = new Date();
  await submitFeedback({
    userEmail: 'user@example.com',
    rating: 4,
    subject: 'Test',
    message: 'Good',
  });
  const afterTime = new Date();

  const call = mockCreate.mock.calls[0][0];
  expect(call.createdAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
  expect(call.createdAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
});
```

## Related Services

- [rayfinClient](./rayfinClient.md) - Rayfin client used for data access
- [RayfinAuthService](./RayfinAuthService.md) - Authentication service

## Related Components

- [FeedbackModal](../components/FeedbackModal.md) - Modal that uses this service
- [FloatingFeedbackButton](../components/FloatingFeedbackButton.md) - Button that opens modal

## Future Enhancements

- [ ] Add offline queue for failed submissions
- [ ] Add retry mechanism
- [ ] Add analytics tracking
- [ ] Add attachment support (screenshots)
- [ ] Add category/type selection
- [ ] Add response tracking (admin replies)
- [ ] Add notification when feedback received
- [ ] Add feedback history view

## Best Practices

1. **Check Authentication**: Verify user logged in before submitting
2. **Handle Errors**: Show user-friendly error messages
3. **Validate Client-Side**: Reduce server calls with validation
4. **Log Errors**: Log failures for debugging
5. **Track Success**: Confirm feedback received to user
6. **Rate Limit**: Consider limiting submissions per user
7. **Privacy**: Inform users about data collection
8. **Archive**: Keep feedback for analysis/trends
