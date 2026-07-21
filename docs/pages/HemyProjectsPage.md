# HemyProjectsPage

## Overview
The **HemyProjectsPage** embeds a Microsoft Dynamics CRM iframe displaying the projects entity list view. This page provides access to project management data within the Hemy 360 application.

## Location
`src/pages/HemyProjectsPage.tsx`

## Features

### 1. **Dynamics CRM Integration**
- Embeds Dynamics CRM projects view
- Entity type: `msdyn_project` (Dynamics Project Operations)
- Full CRUD operations through CRM interface

### 2. **Loading States**
- Spinner overlay while iframe loads
- Status indicator in header (yellow/green pulse animation)

### 3. **Responsive Layout**
- Full-viewport height iframe
- Sticky header with navigation
- Consistent theming

## Props
No props. This is a route-level page component.

## Component Structure

### Header
- Title: "Hemy Projects" with building icon
- Status indicator (loading/ready state)

### Main Content
- Full-height iframe with CRM projects view
- Loading spinner with overlay
- `onLoad` callback for state management

## State Management

```typescript
const [isLoading, setIsLoading] = useState(true);  // Loading state
```

## Iframe Configuration

```typescript
<iframe
  src="https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=2019ee4f-38bc-ef11-b8e9-000d3ab86138&newWindow=true&pagetype=entitylist&etn=msdyn_project&viewid=7345eda5-8eaa-f011-bbd3-7ced8d754618&viewType=4230"
  className="h-full w-full border-0"
  allow="geolocation; microphone; camera; payment"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
  onLoad={() => setIsLoading(false)}
/>
```

### URL Parameters
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `appid` | `2019ee4f-38bc-ef11-b8e9-000d3ab86138` | Project Operations app ID |
| `newWindow` | `true` | Open in new window context |
| `pagetype` | `entitylist` | Display entity list |
| `etn` | `msdyn_project` | Dynamics Project entity |
| `viewid` | `7345eda5-8eaa-f011-bbd3-7ced8d754618` | Project view ID |
| `viewType` | `4230` | Project-specific view type |

### Sandbox & Permissions
- `allow-same-origin` - Shared origin access
- `allow-scripts` - JavaScript execution
- `allow-forms` - Form operations
- `allow-popups` - Popup windows
- `allow-top-navigation` - Top frame navigation
- Permissions: `geolocation`, `microphone`, `camera`, `payment`

## Styling

Custom theme colors via Tailwind:
- **Primary**: Navy blue (`#021838`)
- **Background**: Cream white (`#FAF8F2`)
- **Accent**: Brown (`#7C4D2F`)
- **Border**: Light gray (`#DDD4C0`)

## Dynamics Project Operations

### Entity Details
- **Entity Name**: `msdyn_project` (Microsoft Project Operations)
- **Purpose**: Project lifecycle management
- **Capabilities**: Scheduling, resource allocation, budgeting

### Features Available in CRM View
- Project creation and management
- Scheduling and timelines
- Resource allocation
- Budget tracking
- Task management
- Risk and issue tracking

## Data Flow

```
Component Mount
    ↓
Initialize loading state
    ↓
Render iframe with CRM URL
    ↓
CRM loads project view
    ↓
onLoad event fires
    ↓
Hide loading spinner
    ↓
Display loaded content
```

## Integration Points

### Authentication
- Inherits parent app authentication
- Uses same session context
- CRM validates user permissions

### Navigation
- Accessed via sidebar menu
- Part of main app routing
- Can link to specific projects via URL parameters

## Usage Example

```tsx
import { HemyProjectsPage } from '@/pages/HemyProjectsPage';

// In routing
<Route path="/projects" element={<HemyProjectsPage />} />

// From sidebar
<SidebarItem onClick={() => navigate('/projects')}>
  Projects
</SidebarItem>
```

## Error Handling

Current implementation lacks error handling for:
- iframe load failures
- network timeouts
- permission denied scenarios
- CRM service unavailability

## Security Considerations

- Iframe sandboxed with minimum required permissions
- Uses same-origin authentication
- No token passing required (session-based)
- CRM enforces row-level security

## Performance Notes

- Full viewport iframe may consume significant memory
- Large project datasets could impact rendering
- No client-side virtualization
- Consider pagination at CRM level

## Known Limitations

- Cannot customize CRM view from React component
- No offline capabilities
- Load time dependent on CRM server response
- No timeout handling implemented

## Future Improvements

- [ ] Add error boundary and fallback UI
- [ ] Implement iframe load timeout
- [ ] Add retry mechanism
- [ ] Cache project data locally
- [ ] Add project quick-filters in React layer
- [ ] Implement keyboard navigation
- [ ] Add accessibility improvements
- [ ] Add analytics for user interactions

## Troubleshooting

### Iframe showing blank page
- Verify CRM URL is accessible
- Check user permissions for `msdyn_project` entity
- Look for CORS errors in console
- Verify organization ID is correct

### Loading spinner stuck
- Check network tab for failed requests
- Verify CRM instance is running
- Check browser developer tools for errors
- Refresh page to retry

### Project operations not visible
- Ensure Project Operations solution is installed
- Verify user has access to project apps
- Check CRM security roles and privileges

## Related Documentation

- See also: [HemyDataPage](./HemyDataPage.md)
- See also: [HemyReportsPage](./HemyReportsPage.md)
- See also: [MyActionPage](./MyActionPage.md)
- See also: [HemyXPage](./HemyXPage.md)
