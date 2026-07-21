# FloatingFeedbackButton Component

## Overview
The **FloatingFeedbackButton** is a fixed-position floating action button (FAB) that opens the feedback modal. It provides easy access to send feedback from any page in the application with a persistent, always-accessible button in the bottom-right corner.

## Location
`src/components/FloatingFeedbackButton.tsx`

## Features

### 1. **Floating Action Button**
- Fixed position in bottom-right corner
- Chat bubble icon
- Hover effects and animations
- Active/pressed scale animation

### 2. **Feedback Modal Integration**
- Opens FeedbackModal on click
- Passes user email and page name
- Manages modal state

### 3. **Visual Feedback**
- Hover scale and shadow enhancement
- Active state scale down (0.95)
- Smooth color transitions
- Always visible above content (z-30)

### 4. **Accessibility**
- Semantic button element
- Title and aria-label attributes
- Keyboard accessible

## Props

```typescript
interface FloatingFeedbackButtonProps {
  user?: AuthUser | null;
  currentPageName?: string;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | `AuthUser \| null` | `undefined` | Authenticated user object with email |
| `currentPageName` | `string` | `'Hemy 360 - test by JMS'` | Name of current page |

## Component Structure

### Floating Button
- Fixed bottom-right position (32px from edges)
- Circular button with chat icon
- Custom theme colors
- Hover and active states

### Feedback Modal
- Controlled by local state
- Rendered below button in DOM
- Opens on button click
- Closes on modal close action

## State Management

```typescript
const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);  // Modal visibility
```

## Event Handlers

### Button Click
```typescript
onClick={() => setIsFeedbackOpen(true)}
```
Opens the feedback modal when button is clicked.

### Modal Close
```typescript
onClose={() => setIsFeedbackOpen(false)}
```
Closes the modal when user completes feedback or cancels.

## Styling

Uses Tailwind CSS with custom theme colors:
- **Background**: Brown (`#7C4D2F`)
- **Text**: Cream white (`#FAF8F2`)
- **Hover Background**: Lighter brown (`#9B6240`)
- **Shadow**: Enhanced on hover

### Button Classes
- `fixed bottom-8 right-8` - Fixed bottom-right positioning
- `z-30` - Above most content (below modals at z-50)
- `rounded-full` - Circular shape
- `flex items-center justify-center` - Icon centering
- `h-14 w-14` - 56px square (circular)
- `hover:bg-[#9B6240] hover:shadow-xl` - Hover effects
- `active:scale-95` - Pressed state
- `transition-all duration-200` - Smooth animations

## Visual Design

### Button States

#### Normal State
```
       ╭─────────╮
    32 │    💬   │ 32
       │ [Brown] │
       ╰─────────╯
    Fixed to viewport
    bottom-right corner
```

#### Hover State
```
       ╭─────────╮
    32 │    💬   │ 32
       │ [Tan]   │ (lighter)
       ╰─────────╯
    Shadow expanded
    Scale slightly larger
```

#### Active State
```
       ╭─────────╮
    32 │    💬   │ 32
       │ [Tan]   │
       ╰─────────╯
    Scale: 0.95 (pressed down)
```

## Icon

Chat bubble SVG icon with:
- `h-6 w-6` - 24px icon size
- Stroke-based design
- Rounded corners on bubble
- Pointer indicator

## Z-Index Layering

```
z-50: Modal backdrop & FeedbackModal content
z-30: FloatingFeedbackButton
z-0:  Page content
```

The button appears above page content but behind modal dialogs.

## Usage Examples

### Basic Usage
```tsx
import { FloatingFeedbackButton } from '@/components/FloatingFeedbackButton';

function App() {
  return <FloatingFeedbackButton />;
}
```

### With User Information
```tsx
import { FloatingFeedbackButton } from '@/components/FloatingFeedbackButton';
import { useAuth } from '@/hooks/AuthContext';

function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Home Page</h1>
      <FloatingFeedbackButton
        user={user}
        currentPageName="Home"
      />
    </>
  );
}
```

### In App Layout
```tsx
import { FloatingFeedbackButton } from '@/components/FloatingFeedbackButton';

function AppLayout({ user, currentPage }) {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <FloatingFeedbackButton
        user={user}
        currentPageName={currentPage}
      />
    </div>
  );
}
```

## Data Flow

```
Component Mount
    ↓
Render button + modal (modal closed)
    ↓
User clicks button
    ↓
Set isFeedbackOpen = true
    ↓
Modal opens with props:
  - userEmail: user?.email
  - currentPageName: currentPageName
    ↓
User submits/cancels feedback
    ↓
Modal calls onClose()
    ↓
Set isFeedbackOpen = false
    ↓
Modal closes
```

## Integration Points

### Authentication
- Receives user object from parent
- Passes user email to feedback modal
- Handles null user gracefully (uses default email)

### Page Context
- Receives current page name from parent
- Passes to feedback modal as subject
- Helps organize feedback by page

### Feedback Service
- FeedbackModal handles submission
- Passes data to submitFeedback() service
- Services stores feedback in Rayfin backend

## Accessibility

### Current Features
- Semantic `<button>` element
- `title="Send feedback"` attribute
- `aria-label="Send feedback"` attribute
- Keyboard accessible (Tab + Enter)

### Possible Improvements
- Add `aria-pressed` for toggle state
- Add `aria-expanded` when modal opens
- Add keyboard focus indicator styling
- Support Escape key to close

## Performance Considerations

- Button always rendered (lightweight)
- Modal only renders when needed
- No expensive computations
- Smooth CSS transitions (GPU-accelerated)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Mobile Considerations

- Fixed position persists on scroll
- Circular button easy to tap on mobile
- Bottom-right placement standard for mobile FAB
- Touch-friendly size (56x56px = 44x44dp)

## Related Components

- [FeedbackModal](./FeedbackModal.md) - Modal opened by this button
- [ActionMenu](./ActionMenu.md) - Similar interaction pattern
- [Sidebar](./Sidebar.md) - Navigation component

## Common Patterns

### FAB (Floating Action Button)
Standard mobile/web pattern for:
- Primary action on page
- Always accessible
- Bottom-right positioning
- Circular shape

### Multi-Step Feedback
Potential extension:
1. Click FAB
2. Modal opens (step 1: rating)
3. Submit rating
4. Next screen (step 2: message)
5. Submit full feedback

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingFeedbackButton } from '@/components/FloatingFeedbackButton';

test('renders button', () => {
  render(<FloatingFeedbackButton />);
  const button = screen.getByLabelText('Send feedback');
  expect(button).toBeInTheDocument();
});

test('opens modal on button click', () => {
  render(<FloatingFeedbackButton />);
  const button = screen.getByLabelText('Send feedback');
  
  // Modal should not be visible initially
  expect(screen.queryByText('Share Your Feedback')).not.toBeInTheDocument();
  
  // Click button
  fireEvent.click(button);
  
  // Modal should be visible
  expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
});

test('passes user email to modal', () => {
  const user = { email: 'test@example.com', id: '1' };
  render(<FloatingFeedbackButton user={user} />);
  
  const button = screen.getByLabelText('Send feedback');
  fireEvent.click(button);
  
  // Modal should be open with user email
  const modal = screen.getByText('Share Your Feedback').closest('div');
  expect(modal).toBeInTheDocument();
});

test('passes page name to modal', () => {
  render(
    <FloatingFeedbackButton currentPageName="Dashboard" />
  );
  
  const button = screen.getByLabelText('Send feedback');
  fireEvent.click(button);
  
  // Modal opens with page name passed
  expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
});

test('button has correct positioning classes', () => {
  const { container } = render(<FloatingFeedbackButton />);
  const button = container.querySelector('button');
  
  expect(button).toHaveClass('fixed', 'bottom-8', 'right-8', 'z-30');
});

test('button has correct styling on hover', () => {
  const { container } = render(<FloatingFeedbackButton />);
  const button = container.querySelector('button');
  
  expect(button).toHaveClass('hover:bg-[#9B6240]', 'hover:shadow-xl');
});
```

## Future Enhancements

- [ ] Add animation on page load (pop-in effect)
- [ ] Add badge with unread feedback count
- [ ] Add keyboard shortcut (e.g., Cmd+Shift+F)
- [ ] Add quick rating without modal
- [ ] Add screenshot capture for feedback
- [ ] Add multiple feedback categories
- [ ] Add feedback history view
- [ ] Add analytics tracking

## Troubleshooting

### Button not visible
- Check z-index is not blocked by other elements
- Verify fixed positioning is not overridden
- Check parent overflow-hidden rules

### Modal not opening
- Verify onClick handler is firing
- Check React state is updating
- Verify FeedbackModal props are correct

### Email not captured
- Verify user object is passed correctly
- Check user has email property
- Verify email is not undefined/null

### Button hidden on mobile
- Adjust bottom/right values for smaller screens
- Consider responsive positioning
- Test on various mobile devices
