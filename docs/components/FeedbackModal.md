# FeedbackModal Component

## Overview
The **FeedbackModal** is a modal dialog component that collects user feedback with a 5-star rating system, optional message, and form validation. It handles submission to the backend and displays loading/error states.

## Location
`src/components/FeedbackModal.tsx`

## Features

### 1. **Star Rating System**
- Interactive 5-star rating
- Hover preview of rating
- Persistent selected rating
- Visual feedback (filled/empty stars)

### 2. **Text Input**
- Optional message field
- Rich placeholder text
- Textarea for longer messages
- Responsive sizing

### 3. **Form Validation**
- Requires rating selection
- Optional message
- Client-side validation
- Alert on missing rating

### 4. **Submission Handling**
- Loading state during submission
- Error display and handling
- Success feedback
- State cleanup after submit

### 5. **Modal UX**
- Backdrop overlay with blur
- Close button
- Cancel and Submit buttons
- Smooth animations

## Props

```typescript
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  currentPageName?: string;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Whether modal is visible |
| `onClose` | `() => void` | - | Callback when modal closes |
| `userEmail` | `string` | `'user@example.com'` | User's email for feedback |
| `currentPageName` | `string` | `'App'` | Page where feedback was submitted from |

## Component Structure

### Header
- Title: "Share Your Feedback"
- Close button (X icon)
- Styled with navy text

### Star Rating Section
- Question: "How would you rate us?"
- 5 interactive stars
- Hover state preview
- Filled/empty star styling

### Message Section
- Label: "Tell us more (optional)"
- Textarea input
- Placeholder: "What can we improve?"
- Max-width 100% of modal

### Error Display
- Red error box if submission fails
- Error message text

### Actions
- Cancel button (secondary)
- Submit button (primary)
- Disabled during submission
- Button labels update during loading

## State Management

```typescript
const [rating, setRating] = useState(0);                    // Star rating (1-5)
const [message, setMessage] = useState('');                // User message
const [hoveredStar, setHoveredStar] = useState(0);         // Hover preview
const [isSubmitting, setIsSubmitting] = useState(false);    // Submission state
const [submitError, setSubmitError] = useState<string | null>(null);  // Error message
```

## Event Handlers

### Star Interactions
```typescript
onMouseEnter={() => setHoveredStar(star)}
onMouseLeave={() => setHoveredStar(0)}
onClick={() => setRating(star)}
```

### Form Submission
```typescript
const handleSubmit = async () => {
  if (rating === 0) {
    alert('Please select a rating');
    return;
  }
  
  setIsSubmitting(true);
  setSubmitError(null);
  
  try {
    await submitFeedback({
      userEmail,
      rating,
      subject: currentPageName,
      message,
    });
    alert('Thank you for your feedback!');
    setRating(0);
    setMessage('');
    onClose();
  } catch (error) {
    setSubmitError(/* error message */);
  } finally {
    setIsSubmitting(false);
  }
};
```

## Styling

Uses Tailwind CSS with custom theme:
- **Background**: White
- **Text**: Navy blue (`#021838`)
- **Accents**: Brown (`#7C4D2F`)
- **Borders**: Light gray (`#DDD4C0`)
- **Overlay**: Black with 40% opacity and blur effect
- **Stars**: Brown when filled, light gray when empty
- **Error**: Red background and text

### Key Classes
- `fixed inset-0 z-50` - Full-screen overlay
- `backdrop-blur-sm` - Blurred background
- `rounded-2xl` - Modal card radius
- `w-full max-w-md` - Responsive width

## Conditional Rendering

Only renders when `isOpen` is true:
```typescript
if (!isOpen) return null;
```

## Data Flow

```
User clicks Feedback Button
    ↓
Set isOpen = true
    ↓
Modal appears with form
    ↓
User selects rating (1-5)
    ↓
User optionally writes message
    ↓
User clicks Submit
    ↓
Validate rating (required)
    ↓
Submit to backend via submitFeedback()
    ├─ Success: Show success alert → Close modal → Reset form
    └─ Error: Display error message → Keep modal open
```

## Integration with Services

### `submitFeedback()` Service
- Called on form submission
- Passes rating, message, email, subject
- Returns feedback ID on success
- Throws error on failure

```typescript
const feedbackId = await submitFeedback({
  userEmail,
  rating,
  subject: currentPageName,
  message,
});
```

## Usage Example

### Basic Usage
```tsx
import { FeedbackModal } from '@/components/FeedbackModal';
import { useState } from 'react';

function App() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsFeedbackOpen(true)}>
        Send Feedback
      </button>
      
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        userEmail="user@example.com"
        currentPageName="Dashboard"
      />
    </>
  );
}
```

### With Floating Button
```tsx
import { FloatingFeedbackButton } from '@/components/FloatingFeedbackButton';

function App({ user }) {
  return <FloatingFeedbackButton user={user} currentPageName="Home" />;
}
```

## Accessibility Features

- Semantic HTML: `<form>`, `<input>`, `<button>`
- Proper heading hierarchy
- Button aria-labels possible
- Close button easily accessible
- Focus management within modal

### Improvements Needed
- Add `role="dialog"` to modal
- Add `aria-modal="true"`
- Add `aria-labelledby` to modal
- Trap focus within modal
- Close on Escape key

## Validation

### Client-Side
- Rating must be 1-5 (alerts if 0)
- Message is optional
- Email from props (required)
- Subject from props (required)

### Server-Side
- Rating bounds validation
- Message length limits
- Email format validation
- Authentication check

## Error Handling

### Client Errors
- Missing rating → Alert dialog
- Submission error → Display error message in red box
- Network error → Caught and displayed

### Server Errors
- Mapped to user-friendly error message
- Original error logged to console
- Error state preserved for retry

## Performance Considerations

- Modal only renders when `isOpen` is true
- No expensive computations
- Submission handled asynchronously
- Loading states prevent duplicate submissions

## Loading & Disabled States

### Disabled During Submission
- Cancel button disabled
- Submit button disabled
- Server URL input disabled (in related page)

### Button Label Changes
- Submit: "Sending..." (during submission)
- Submit: "Submit" (normal state)

## Star Rating Details

### Visual Feedback
- Empty stars: Light gray (`#DDD4C0`)
- Filled stars: Brown (`#7C4D2F`)
- Hover effect: Scale animation (`hover:scale-110`)
- Smooth color transitions

### Rating Values
1. ⭐ Poor
2. ⭐⭐ Fair
3. ⭐⭐⭐ Good
4. ⭐⭐⭐⭐ Very Good
5. ⭐⭐⭐⭐⭐ Excellent

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Related Components

- [FloatingFeedbackButton](./FloatingFeedbackButton.md) - Opens this modal
- [ActionMenu](./ActionMenu.md) - Similar modal interaction pattern

## Testing

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedbackModal } from '@/components/FeedbackModal';

test('renders when isOpen is true', () => {
  render(
    <FeedbackModal isOpen={true} onClose={jest.fn()} />
  );
  expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
});

test('does not render when isOpen is false', () => {
  render(
    <FeedbackModal isOpen={false} onClose={jest.fn()} />
  );
  expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
});

test('allows star rating selection', () => {
  render(
    <FeedbackModal isOpen={true} onClose={jest.fn()} />
  );
  const stars = screen.getAllByRole('button').slice(0, 5);
  fireEvent.click(stars[3]); // Click 4th star
  // Verify 4 stars are filled
});

test('alerts if submit without rating', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
  render(
    <FeedbackModal isOpen={true} onClose={jest.fn()} />
  );
  fireEvent.click(screen.getByText('Submit'));
  expect(alertSpy).toHaveBeenCalledWith('Please select a rating');
  alertSpy.mockRestore();
});

test('calls onClose when cancel clicked', () => {
  const onClose = jest.fn();
  render(
    <FeedbackModal isOpen={true} onClose={onClose} />
  );
  fireEvent.click(screen.getByText('Cancel'));
  expect(onClose).toHaveBeenCalled();
});
```

## Future Enhancements

- [ ] Add emoji rating alternative
- [ ] Add attachment support (screenshot)
- [ ] Add category/topic selection
- [ ] Add priority level selector
- [ ] Add keyboard shortcuts
- [ ] Add analytics integration
- [ ] Add A/B testing variants
- [ ] Add thank you message customization
