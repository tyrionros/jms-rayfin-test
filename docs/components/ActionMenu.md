# ActionMenu Component

## Overview
The **ActionMenu** is a reusable dropdown menu component that provides a list of actionable items. It displays a button with a title and an animated chevron icon, expanding to show menu items on click with click-outside detection for automatic closure.

## Location
`src/components/ActionMenu.tsx`

## Features

### 1. **Dropdown Menu**
- Click to open/close
- Animated chevron icon rotation
- Smooth transitions

### 2. **Click-Outside Detection**
- Automatically closes when clicking outside
- Event listener cleanup on unmount
- Prevents memory leaks

### 3. **Menu Items**
- Flexible item structure
- Custom click handlers
- Auto-close after selection

### 4. **Accessibility**
- Semantic HTML structure
- Keyboard support ready
- ARIA labels on toggle button

## Props

```typescript
interface MenuItem {
  label: string;
  onClick: () => void;
}

interface ActionMenuProps {
  title: string;
  items: MenuItem[];
}
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Button label and menu title |
| `items` | `MenuItem[]` | Array of menu items with labels and click handlers |

## Component Structure

### Button
- Displays title text
- Shows animated chevron icon
- Rotates 180° when menu open
- Custom styling with hover effects

### Menu Dropdown
- Positioned absolutely below button
- Styled card with border and shadow
- Items rendered as buttons
- Dividers between items (except last)

## State Management

```typescript
const [isOpen, setIsOpen] = useState(false);  // Menu visibility
const menuRef = useRef<HTMLDivElement>(null); // Container reference
```

## Event Handlers

### `handleClickOutside(event: MouseEvent)`
Detects clicks outside menu container and closes menu:
- Checks if click target is outside menu ref
- Sets isOpen to false
- Runs on every mousedown event

### `handleItemClick(callback: () => void)`
Executes menu item action and closes menu:
- Calls provided callback function
- Sets isOpen to false
- Ensures menu closes after selection

## Styling

Uses Tailwind CSS with custom theme colors:
- **Button Text**: Brown (`#C4956A`)
- **Button Hover**: Dark blue background (`#0D2E5C`) with cream text
- **Menu Background**: White
- **Menu Border**: Light gray (`#DDD4C0`)
- **Menu Items**: Navy text (`#021838`)
- **Menu Item Hover**: Tan background (`#F0EAD8`)

### Button Classes
- `relative` - Positioning context for dropdown
- `rounded-lg` - Rounded corners
- `transition-colors` - Smooth color transitions
- `hover:bg-[#0D2E5C]` - Hover background

### Menu Classes
- `absolute right-0 mt-2` - Positioned below button
- `rounded-lg border shadow-lg` - Card styling
- `w-48` - Fixed width for consistency

### Icon Classes
- `h-4 w-4` - Icon dimensions
- `transition-transform` - Smooth rotation animation

## Usage Examples

### Basic Usage
```tsx
import { ActionMenu } from '@/components/ActionMenu';

function MyComponent() {
  return (
    <ActionMenu
      title="Actions"
      items={[
        { label: 'Edit', onClick: () => console.log('Edit') },
        { label: 'Delete', onClick: () => console.log('Delete') },
        { label: 'Share', onClick: () => console.log('Share') },
      ]}
    />
  );
}
```

### With Navigation
```tsx
import { ActionMenu } from '@/components/ActionMenu';

function HomePage({ onNavigate }) {
  return (
    <ActionMenu
      title="My Action"
      items={[
        { label: 'My Action', onClick: () => onNavigate('myaction') },
        { label: 'My Activity', onClick: () => onNavigate('activity') },
        { label: 'Settings', onClick: () => onNavigate('settings') },
      ]}
    />
  );
}
```

### Dynamic Items
```tsx
const [items, setItems] = useState([
  { label: 'Copy', onClick: () => copyToClipboard() },
  { label: 'Download', onClick: () => downloadFile() },
]);

return <ActionMenu title="More Options" items={items} />;
```

## Lifecycle

### Mount
1. Register click-outside event listener
2. Render button and menu ref container

### Click
1. Toggle isOpen state
2. If open, menu renders below button
3. Chevron icon rotates

### Menu Item Click
1. Execute item callback
2. Set isOpen to false
3. Event listener remains active

### Unmount
1. Remove click-outside event listener
2. Cleanup refs
3. Prevent memory leaks

## Accessibility Features

- Semantic HTML: `<div>` and `<button>` elements
- SVG icon with proper viewBox
- Keyboard navigation ready (can be enhanced)
- Clear visual feedback on hover

### Improvements Needed
- Add `aria-expanded` to toggle button
- Add `role="menu"` to dropdown
- Add `role="menuitem"` to items
- Support keyboard navigation (Enter, Escape, Arrow keys)

## Performance Considerations

- Click-outside listener runs on every mousedown
- Could be optimized with event delegation
- Ref-based DOM access is efficient
- No unnecessary re-renders

## Common Use Cases

1. **Header Actions**: Navigation and quick actions
2. **Table Row Actions**: Edit, delete, view options
3. **User Menu**: Profile, settings, logout
4. **Batch Operations**: Apply actions to multiple items

## Customization

### Add Icons
```tsx
interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;  // Add icon support
}
```

### Add Disabled State
```tsx
interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
```

### Add Submenus
```tsx
interface MenuItem {
  label: string;
  onClick: () => void;
  submenu?: MenuItem[];
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Related Components

- [Sidebar](./Sidebar.md) - Main navigation menu
- [FeedbackModal](./FeedbackModal.md) - Modal dialog
- [FloatingFeedbackButton](./FloatingFeedbackButton.md) - Floating action button

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionMenu } from '@/components/ActionMenu';

test('renders menu button with title', () => {
  render(
    <ActionMenu title="Actions" items={[]} />
  );
  expect(screen.getByText('Actions')).toBeInTheDocument();
});

test('opens menu on button click', () => {
  const items = [{ label: 'Item 1', onClick: jest.fn() }];
  render(<ActionMenu title="Actions" items={items} />);
  
  const button = screen.getByText('Actions');
  fireEvent.click(button);
  
  expect(screen.getByText('Item 1')).toBeVisible();
});

test('calls onClick when menu item clicked', () => {
  const onClick = jest.fn();
  const items = [{ label: 'Item 1', onClick }];
  render(<ActionMenu title="Actions" items={items} />);
  
  fireEvent.click(screen.getByText('Actions'));
  fireEvent.click(screen.getByText('Item 1'));
  
  expect(onClick).toHaveBeenCalled();
});

test('closes menu when clicking outside', () => {
  const items = [{ label: 'Item 1', onClick: jest.fn() }];
  render(
    <div>
      <ActionMenu title="Actions" items={items} />
      <button>Outside</button>
    </div>
  );
  
  fireEvent.click(screen.getByText('Actions'));
  fireEvent.mouseDown(screen.getByText('Outside'));
  
  expect(screen.queryByText('Item 1')).not.toBeVisible();
});
```

## Future Enhancements

- [ ] Add keyboard navigation support
- [ ] Add submenu support
- [ ] Add item icons
- [ ] Add item disabled state
- [ ] Add section dividers
- [ ] Add search/filter for large lists
- [ ] Add animation/transitions
- [ ] Add RTL support
