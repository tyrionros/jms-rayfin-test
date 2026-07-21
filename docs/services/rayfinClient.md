# rayfinClient Service

## Overview
The **rayfinClient** service provides a singleton instance of the Rayfin client for type-safe database operations. It initializes and manages the connection to the Rayfin backend using the project's schema.

## Location
`src/services/rayfinClient.ts`

## Purpose
- **Singleton Pattern**: Ensures only one client instance exists
- **Type Safety**: Strongly typed with TodoAppSchema
- **Centralized**: Single point of client management
- **Initialization**: Safe initialization with error handling

## Exports

### `RayfinClientConfig` Interface
```typescript
interface RayfinClientConfig {
  baseUrl: string;          // Rayfin API base URL
  publishableKey: string;   // Publishable API key for client auth
}
```

Configuration object required to initialize the client.

### `initRayfinClient(config: RayfinClientConfig)`
Initializes the Rayfin client with provided configuration.

**Parameters:**
- `config`: Configuration object with baseUrl and publishableKey

**Returns:**
- `RayfinClient<TodoAppSchema>` - Initialized client instance

**Errors:**
- Throws error if client is already initialized (prevents re-initialization)

**Usage:**
```typescript
const config: RayfinClientConfig = {
  baseUrl: 'https://api.rayfin.io',
  publishableKey: 'pk_test_abc123...',
};

const client = initRayfinClient(config);
```

### `getRayfinClient()`
Returns the initialized Rayfin client instance.

**Returns:**
- `RayfinClient<TodoAppSchema>` - The singleton client instance

**Errors:**
- Throws error if client has not been initialized
- Error message: "Rayfin client not initialized. Call bootstrapAuth() first."

**Usage:**
```typescript
const client = getRayfinClient();

// Now use the client for database operations
const todos = await client.data.Todo.select(['id', 'title']).execute();
```

## Schema Integration

### TodoAppSchema
Imported from `../../rayfin/data/schema` - defines:
- Database tables (Todo, Feedback, etc.)
- Entity types and relationships
- Field definitions
- Query/mutation capabilities

## Client Configuration

### Client Options
```typescript
new RayfinClient<TodoAppSchema>({
  baseUrl: config.baseUrl,
  publishableKey: config.publishableKey,
  useProxy: false,           // Direct API calls (no proxy)
  authStorage: true,         // Enable auth token storage
})
```

**Options:**
- `useProxy`: Set to false for direct API access
- `authStorage`: Enable to persist auth tokens in browser storage

## Lifecycle

### 1. Application Startup
```
App.tsx or main.tsx
    ↓
Call bootstrapAuth()
    ↓
initRayfinClient(config)
    ↓
Client initialized and stored
```

### 2. Usage
```
Component needs data
    ↓
Call getRayfinClient()
    ↓
Use client.data.* methods
    ↓
Send queries/mutations to backend
```

### 3. Cleanup
Client persists for application lifetime. Closes on page unload.

## Usage Examples

### In bootstrap.ts
```typescript
import { initRayfinClient } from '@/services/rayfinClient';

export async function bootstrapAuth(): Promise<{
  authService: IAuthService;
  rayfinClient: RayfinClient<TodoAppSchema>;
}> {
  const config = /* ... get from env ... */;
  
  const rayfinClient = initRayfinClient({
    baseUrl: config.rayfin.baseUrl,
    publishableKey: config.rayfin.publishableKey,
  });

  return { authService, rayfinClient };
}
```

### In Data Services
```typescript
import { getRayfinClient } from '@/services/rayfinClient';

export async function getTodos(): Promise<TodoItem[]> {
  const client = getRayfinClient();
  
  const results = await client.data.Todo.select([
    'id',
    'title',
    'isCompleted',
    'createdAt',
  ])
    .orderBy({ createdAt: 'desc' })
    .execute();

  return results as TodoItem[];
}
```

### In Components
```typescript
import { getRayfinClient } from '@/services/rayfinClient';

function MyComponent() {
  const handleCreateItem = async (title: string) => {
    const client = getRayfinClient();
    
    const item = await client.data.Todo.create({
      title,
      isCompleted: false,
      createdAt: new Date(),
      user_id: client.auth.getSession().user.id,
    });

    return item;
  };

  return <button onClick={() => handleCreateItem('New Item')}>Add</button>;
}
```

## Data Access Patterns

### Query Operations
```typescript
const client = getRayfinClient();

// Select specific fields
const todos = await client.data.Todo.select(['id', 'title']).execute();

// With filtering
const completed = await client.data.Todo
  .select(['id', 'title'])
  .where('isCompleted', 'equals', true)
  .execute();

// With ordering
const sorted = await client.data.Todo
  .select(['id', 'title'])
  .orderBy({ createdAt: 'desc' })
  .execute();

// Find by ID
const todo = await client.data.Todo.findById('todo-123');
```

### Mutation Operations
```typescript
const client = getRayfinClient();

// Create
const newTodo = await client.data.Todo.create({
  title: 'New Task',
  isCompleted: false,
  createdAt: new Date(),
  user_id: userId,
});

// Update
await client.data.Todo.update({ id: 'todo-123' }, {
  title: 'Updated Task',
  isCompleted: true,
});

// Delete
await client.data.Todo.delete({ id: 'todo-123' });
```

## Error Handling

### Initialization Error
```typescript
try {
  initRayfinClient(config);
} catch (error) {
  console.error('Failed to initialize Rayfin client:', error);
  // Handle error - show error UI, etc.
}
```

### Access Error (Not Initialized)
```typescript
try {
  const client = getRayfinClient();
} catch (error) {
  console.error('Client not initialized:', error);
  // This means bootstrapAuth() wasn't called
}
```

### Query Errors
```typescript
try {
  const todos = await client.data.Todo.select(['id']).execute();
} catch (error) {
  if (error instanceof AuthError) {
    // Authentication failed
  } else if (error instanceof ValidationError) {
    // Invalid query
  } else {
    // Network or other error
  }
}
```

## Authentication Integration

### Session Management
```typescript
const client = getRayfinClient();
const session = client.auth.getSession();

if (session.isAuthenticated) {
  console.log('Logged in as:', session.user.id);
} else {
  console.log('Not authenticated');
}
```

### Auth Listeners
```typescript
const client = getRayfinClient();

client.auth.onSessionChange((session) => {
  if (session.isAuthenticated) {
    console.log('User logged in');
  } else {
    console.log('User logged out');
  }
});
```

## Type Safety

### Intellisense Support
The client is strongly typed with `TodoAppSchema`, providing:
- Auto-completion for table names
- Auto-completion for field names
- Type checking on queries
- Type checking on mutations

### Schema-Driven
```typescript
// These are type-checked at compile time
const client = getRayfinClient();

// ✅ Correct
await client.data.Todo.select(['id', 'title']).execute();

// ❌ Type error - 'invalidField' doesn't exist
await client.data.Todo.select(['invalidField']).execute();

// ❌ Type error - 'InvalidTable' doesn't exist
await client.data.InvalidTable.select(['id']).execute();
```

## Performance Considerations

### Singleton Pattern
- Only one client instance in memory
- Shared connection/session
- Efficient resource usage

### Connection Reuse
- HTTP/WebSocket connection reused
- Token reused across requests
- No initialization overhead per request

### Query Optimization
- Select only needed fields
- Use pagination for large datasets
- Use filtering to reduce data transfer

## Related Services

- [RayfinAuthService](./RayfinAuthService.md) - Authentication management
- [todos](./todos.md) - Todo-specific data operations
- [feedback](./feedback.md) - Feedback data operations

## Troubleshooting

### "Rayfin client not initialized"
- Ensure `bootstrapAuth()` is called before using client
- Check it's called in `main.tsx` or app startup
- Verify initialization completes before component render

### Type errors on client usage
- Ensure schema is properly defined in `rayfin/data/schema.ts`
- Check field names match schema
- Regenerate types if schema changes

### Network errors
- Verify baseUrl is correct
- Check CORS headers from backend
- Verify publishableKey is valid
- Check network connectivity

### Authentication errors
- Verify user is authenticated via `client.auth.getSession()`
- Check user permissions for data operations
- Verify auth token is valid and not expired

## Migration Guide

### From Direct Instantiation to Singleton
**Before:**
```typescript
const client = new RayfinClient({ /* config */ });
// Client created multiple times
```

**After:**
```typescript
// Initialize once
initRayfinClient(config);

// Use everywhere
const client = getRayfinClient();
```

## Future Enhancements

- [ ] Add client caching layer
- [ ] Add retry logic for failed requests
- [ ] Add request/response interceptors
- [ ] Add offline support with sync queue
- [ ] Add query result caching
- [ ] Add performance monitoring
- [ ] Add error recovery strategies

## Best Practices

1. **Initialize Early**: Call `initRayfinClient()` during app startup
2. **Use Singleton**: Always call `getRayfinClient()` instead of creating new instances
3. **Handle Errors**: Always wrap client calls in try-catch
4. **Optimize Queries**: Select only needed fields
5. **Check Auth**: Verify session before mutations
6. **Log Errors**: Log all errors for debugging
7. **Test Client**: Mock client in tests

## API Reference

See [Rayfin Documentation](../RAYFIN.md) for complete API reference.
