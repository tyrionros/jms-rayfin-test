# todos Service

## Overview
The **todos** service provides CRUD operations for todo items. It handles retrieving, creating, updating, and deleting todos from the Rayfin backend with full type safety and user context awareness.

## Location
`src/services/todos.ts`

## Purpose
- **Data Operations**: CRUD for todo items
- **User Context**: Associate todos with current user
- **Type Safety**: Strong typing with TodoItem interface
- **Backend Integration**: Direct Rayfin client access

## Exports

### `TodoItem` Interface
```typescript
interface TodoItem {
  id: string;              // Unique identifier
  title: string;           // Todo text/description
  isCompleted: boolean;    // Completion status
  createdAt: Date;         // Creation timestamp
}
```

Represents a single todo item in memory and in API responses.

### `getTodos(): Promise<TodoItem[]>`
Fetches all todos for the current user.

**Parameters:** None

**Returns:** `Promise<TodoItem[]>` - Array of todo items

**Query:**
- Selects: id, title, isCompleted, createdAt
- Orders by: createdAt descending (newest first)
- Executes against Rayfin backend

**Usage:**
```typescript
const todos = await getTodos();
console.log(`Found ${todos.length} todos`);
todos.forEach(todo => console.log(todo.title));
```

### `createTodo(title: string): Promise<TodoItem>`
Creates a new todo item.

**Parameters:**
- `title` (string): Todo title/description

**Returns:** `Promise<TodoItem>` - Created todo with ID and metadata

**Validation:**
- Requires authenticated user
- Throws error if user not logged in

**Database Fields Set:**
- `title`: From parameter
- `isCompleted`: false (default)
- `createdAt`: Current timestamp
- `user_id`: Current user's ID

**Usage:**
```typescript
try {
  const newTodo = await createTodo('Buy groceries');
  console.log('Created:', newTodo.id);
} catch (error) {
  console.error('Failed to create:', error.message);
}
```

### `updateTodo(id: string, updates: Partial<Pick<TodoItem, 'title' | 'isCompleted'>>): Promise<TodoItem>`
Updates an existing todo item.

**Parameters:**
- `id` (string): Todo ID to update
- `updates` (object): Fields to update (title and/or isCompleted)

**Returns:** `Promise<TodoItem>` - Updated todo item

**Updatable Fields:**
- `title`: New todo text
- `isCompleted`: Toggle completion status

**Usage:**
```typescript
// Toggle completion
const updated = await updateTodo('todo-123', { isCompleted: true });

// Update title
const renamed = await updateTodo('todo-123', { title: 'New title' });

// Both
const both = await updateTodo('todo-123', {
  title: 'Updated',
  isCompleted: true,
});
```

### `deleteTodo(id: string): Promise<void>`
Deletes a todo item.

**Parameters:**
- `id` (string): Todo ID to delete

**Returns:** `Promise<void>` - Void on success

**Errors:**
- Throws if todo not found
- Throws if permission denied

**Usage:**
```typescript
await deleteTodo('todo-123');
console.log('Todo deleted');
```

## Data Model

### Database Schema
```typescript
table Todo {
  id: string;              // Primary key
  user_id: string;         // Foreign key to User
  title: string;           // Todo text
  isCompleted: boolean;    // Completion flag
  createdAt: Date;         // Created timestamp
}
```

## Data Flow

```
Component or Page
    ↓
Call getTodos() / createTodo() / updateTodo() / deleteTodo()
    ↓
Service function
    ↓
Get Rayfin client
    ↓
Get current user session
    ↓
Validate authentication
    ↓
Build query/mutation
    ↓
Send to Rayfin backend
    ↓
Backend processes
    ↓
Return result
    ↓
Return to caller
```

## Usage Examples

### In HomePage Component
```typescript
import { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo,
  type TodoItem 
} from '@/services/todos';

function HomePage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  // Create new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await createTodo(newTodoTitle);
      setNewTodoTitle('');
      await fetchTodos(); // Refresh list
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  // Toggle completion
  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await updateTodo(id, { isCompleted: !completed });
      await fetchTodos(); // Refresh list
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  // Delete todo
  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      await fetchTodos(); // Refresh list
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    // Component JSX using todos state and handlers
  );
}
```

### Batch Operations
```typescript
import { getTodos, createTodo, updateTodo } from '@/services/todos';

// Create multiple todos
const titles = ['Task 1', 'Task 2', 'Task 3'];
const newTodos = await Promise.all(
  titles.map(title => createTodo(title))
);

// Complete all
await Promise.all(
  newTodos.map(todo => updateTodo(todo.id, { isCompleted: true }))
);
```

### Error Handling
```typescript
import { createTodo } from '@/services/todos';

try {
  const todo = await createTodo('New task');
  console.log('Created:', todo.id);
} catch (error) {
  if (error.message.includes('not authenticated')) {
    console.error('User must sign in');
  } else if (error.message.includes('not initialized')) {
    console.error('App initialization incomplete');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Error Handling

### Not Authenticated
```typescript
// Thrown by createTodo, updateTodo, deleteTodo
Error: 'Cannot create todo: user is not authenticated.'
```

**Solution:** Ensure user is logged in before creating/modifying todos.

### Client Not Initialized
```typescript
// Thrown by all functions
Error: 'Rayfin client not initialized. Call bootstrapAuth() first.'
```

**Solution:** Verify `bootstrapAuth()` called during app startup.

### Database Errors
Various errors from backend:
- Invalid input
- Database constraints
- Network failures

**Solution:** Implement try-catch with user feedback.

## Performance Optimization

### Efficient Queries
```typescript
// Good: Select only needed fields
const todos = await client.data.Todo.select([
  'id', 'title', 'isCompleted', 'createdAt'
]).execute();

// Avoid: Select all fields (if not needed)
const all = await client.data.Todo.execute();
```

### Sorting
```typescript
// Newest first (most useful for todos)
.orderBy({ createdAt: 'desc' })

// Oldest first (alternative)
.orderBy({ createdAt: 'asc' })
```

### Caching Strategy
```typescript
// Current: Refetch after each mutation
// Better: Implement optimistic updates
const newTodos = [...todos, { id: uuid(), title, isCompleted: false }];
setTodos(newTodos);
try {
  await createTodo(title);
  // Success
} catch (error) {
  // Rollback on error
  setTodos(todos);
}
```

## Authentication

### User Association
Each todo automatically associates with current user:
```typescript
const session = client.auth.getSession();
const userId = session.user.id;  // Automatically captured

await client.data.Todo.create({
  title: 'My task',
  isCompleted: false,
  createdAt: new Date(),
  user_id: userId,  // Set automatically
});
```

### User Isolation
- Users can only see their own todos
- Backend enforces row-level security
- No cross-user data visible

## Testing

```typescript
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/services/todos';
import { getRayfinClient } from '@/services/rayfinClient';

jest.mock('@/services/rayfinClient');

beforeEach(() => {
  jest.clearAllMocks();
});

test('getTodos returns array of todos', async () => {
  const mockTodos = [
    { id: '1', title: 'Task 1', isCompleted: false, createdAt: new Date() },
    { id: '2', title: 'Task 2', isCompleted: true, createdAt: new Date() },
  ];

  getRayfinClient.mockReturnValue({
    data: {
      Todo: {
        select: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue(mockTodos),
          }),
        }),
      },
    },
  });

  const todos = await getTodos();
  
  expect(todos).toEqual(mockTodos);
  expect(todos).toHaveLength(2);
});

test('createTodo requires authentication', async () => {
  getRayfinClient.mockReturnValue({
    auth: {
      getSession: () => ({ isAuthenticated: false, user: null }),
    },
  });

  await expect(createTodo('New task')).rejects.toThrow(
    'Cannot create todo: user is not authenticated.'
  );
});

test('updateTodo updates specific fields', async () => {
  const mockUpdated = {
    id: 'todo-123',
    title: 'Updated',
    isCompleted: true,
    createdAt: new Date(),
  };

  getRayfinClient.mockReturnValue({
    data: {
      Todo: {
        update: jest.fn().mockResolvedValue(undefined),
        findById: jest.fn().mockResolvedValue(mockUpdated),
      },
    },
    auth: {
      getSession: () => ({ isAuthenticated: true, user: { id: 'user-1' } }),
    },
  });

  const result = await updateTodo('todo-123', { isCompleted: true });

  expect(result).toEqual(mockUpdated);
});

test('deleteTodo removes todo', async () => {
  const mockDelete = jest.fn().mockResolvedValue(undefined);

  getRayfinClient.mockReturnValue({
    data: {
      Todo: {
        delete: mockDelete,
      },
    },
  });

  await deleteTodo('todo-123');

  expect(mockDelete).toHaveBeenCalledWith({ id: 'todo-123' });
});
```

## Integration Points

### HomePage Component
Primary consumer of todo service
- Displays todo list
- Handles CRUD operations
- Manages loading/error states

### Rayfin Backend
Persistence layer
- Stores todos
- Enforces authentication
- Manages database

### Auth System
User context
- Provides user ID
- Ensures authentication
- Enforces isolation

## Related Services

- [rayfinClient](./rayfinClient.md) - Provides backend access
- [RayfinAuthService](./RayfinAuthService.md) - Authentication

## Related Components

- [HomePage](../pages/HomePage.md) - Main consumer

## Future Enhancements

- [ ] Add filtering (by completion status)
- [ ] Add search functionality
- [ ] Add categories/tags
- [ ] Add due dates
- [ ] Add priority levels
- [ ] Add recurrence
- [ ] Add subtasks
- [ ] Add attachments
- [ ] Add sharing/collaboration
- [ ] Add local caching for offline support

## Best Practices

1. **Check Auth**: Verify user before creating/updating
2. **Handle Errors**: Always wrap in try-catch
3. **Show Feedback**: Display loading/error states to user
4. **Optimize Queries**: Select only needed fields
5. **Batch Updates**: Use Promise.all() for multiple operations
6. **Implement Caching**: Cache results to reduce API calls
7. **Optimistic Updates**: Update UI before confirmation
8. **Log Errors**: Log failures for debugging
9. **Validate Input**: Check title before creating
10. **Clean Up**: Refresh after mutations to ensure sync

## Performance Tips

- Use optimistic updates for better UX
- Implement virtual scrolling for large lists
- Cache todo list in component state
- Debounce search queries
- Use pagination for large datasets
- Batch deletes with Promise.all()

## Troubleshooting

### "user is not authenticated" error
- User must sign in first
- Check auth service is initialized
- Verify session is active

### Todos not appearing
- Check getTodos() is called on mount
- Verify user permission to view todos
- Check network connectivity
- Look for errors in console

### Changes not persisting
- Verify no network errors
- Refresh todo list after changes
- Check backend is running
- Verify Rayfin client initialized

### Slow performance
- Implement caching
- Use pagination
- Select only needed fields
- Batch operations efficiently
