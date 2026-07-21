# HomePage

## Overview
The **HomePage** is the main landing page of the Hemy 360 application that serves as a task management dashboard. It displays a todo list with the ability to create, update, and delete tasks. Users can organize their tasks into "To do" and "Completed" sections with a visual progress indicator.

## Location
`src/pages/HomePage.tsx`

## Features

### 1. **Task Management**
- **Create todos**: Form input to add new tasks
- **Toggle completion**: Mark tasks as complete/incomplete with visual feedback
- **Delete todos**: Remove tasks with hover-to-reveal action
- **Progress tracking**: Visual progress bar showing completion percentage

### 2. **UI Components**
- **Header**: Navigation bar with branding and action menu
- **Todo Form**: Input field with add button
- **Todo Sections**: Organized "To do" and "Completed" sections with count badges
- **Empty State**: Helpful message when no todos exist
- **Loading State**: Skeleton loaders while fetching data

### 3. **Data Management**
- Fetches todos from Rayfin backend on page load
- Real-time updates after create/update/delete operations
- Separates pending and completed todos for better organization

## Props

```typescript
interface HomePageProps {
  onNavigate?: (pageId: string) => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `onNavigate` | `(pageId: string) => void` | Optional callback to navigate to other pages. Used to trigger navigation to "myaction" page |

## Component Structure

### Main Sections
1. **Header** - Sticky navigation with branding and action menu
2. **Page Heading** - Title with task count and progress bar
3. **Add Task Form** - Input field with add button
4. **Todo Sections** - Conditional rendering of "To do" and "Completed" sections
5. **Empty State** - Displayed when no tasks exist

### Sub-Components
- **TodoSection**: Container for grouped todos (To do or Completed)
- **TodoRow**: Individual todo item with toggle and delete actions
- **EmptyState**: Placeholder UI when no todos exist
- **Hemy360Icon**: Branded icon component
- **CheckIcon**: Checkmark icon for completed state

## State Management

```typescript
const [todos, setTodos] = useState<TodoItem[]>([]);           // All todos
const [newTodoTitle, setNewTodoTitle] = useState('');         // Input field value
const [loading, setLoading] = useState(true);                 // Loading state
```

## Key Functions

### `fetchTodos()`
Fetches all todos from the backend and updates component state. Called on component mount.

### `handleAddTodo(e: React.FormEvent)`
- Validates input
- Calls `createTodo()` service
- Refreshes todo list
- Clears input field

### `handleToggle(id: string, isCompleted: boolean)`
Toggles the completion status of a todo and refreshes the list.

### `handleDelete(id: string)`
Deletes a todo and refreshes the list.

## Styling

The component uses Tailwind CSS with the custom theme colors:
- **Background**: Cream white (`#FAF8F2`)
- **Text**: Navy blue (`#021838`)
- **Accents**: Brown (`#7C4D2F`)
- **Borders**: Light gray (`#DDD4C0`)

### Key Classes
- `sticky top-0 z-40` - Sticky header positioning
- `rounded-xl` - Rounded border radius on inputs and buttons
- `hover:shadow-md` - Hover effects on todo items
- `animate-pulse` - Loading skeleton animation

## Data Flow

```
Component Mount
    ↓
Fetch todos from backend
    ↓
Set todos state
    ↓
User interaction (add/toggle/delete)
    ↓
Call service function
    ↓
Refresh todos list
    ↓
Update UI
```

## Integration Points

### Services Used
- `getTodos()` - Fetch all todos
- `createTodo(title)` - Create new todo
- `updateTodo(id, updates)` - Toggle completion status
- `deleteTodo(id)` - Delete todo

### Components Used
- `ActionMenu` - Dropdown menu in header
- `FloatingFeedbackButton` - Feedback submission (via parent)

## Accessibility

- Semantic HTML with `<form>`, `<section>`, `<ul>`, `<li>` tags
- ARIA labels on interactive elements
- Keyboard accessible form and buttons
- Clear visual feedback for button states

## Performance Considerations

- Todo list fetched once on component mount
- Re-fetches entire list after each mutation (can be optimized with optimistic updates)
- Loading skeleton prevents UI jump
- Empty state prevents unnecessary rendering

## Usage Example

```tsx
import { HomePage } from '@/pages/HomePage';

function App() {
  const handleNavigate = (pageId: string) => {
    // Navigate to page
  };

  return <HomePage onNavigate={handleNavigate} />;
}
```

## Error Handling

The component relies on service-level error handling. Errors from backend calls are currently not displayed to the user but are logged. Consider adding error boundaries or error toast notifications.

## Future Enhancements

- [ ] Add search/filter functionality
- [ ] Add todo categories or tags
- [ ] Add due dates to todos
- [ ] Implement drag-and-drop reordering
- [ ] Add keyboard shortcuts (e.g., Cmd+K for add)
- [ ] Implement optimistic updates
- [ ] Add error toast notifications
- [ ] Add todo editing inline
