# HemyReportsPage

## Overview
The **HemyReportsPage** embeds a Microsoft Dynamics CRM iframe displaying the Hemy reports entity list. This page integrates CRM reporting functionality directly into the Hemy 360 dashboard.

## Location
`src/pages/HemyReportsPage.tsx`

## Features

### 1. **Dynamics CRM Integration**
- Embeds CRM reports view for `new_hemyreports` entity
- Supports report creation, viewing, and management
- Inherits CRM permissions and access controls

### 2. **Loading State Management**
- Shows animated spinner during iframe load
- Status indicator in header (yellow when loading, green when ready)

### 3. **Responsive UI**
- Full-height iframe container
- Sticky header with page title and icon
- Consistent application theme

## Props
No props. This is a route-level page component.

## Component Structure

### Header Section
- Page title: "Hemy Reports"
- Document/reports icon
- Status indicator (animated pulse)

### Content Area
- Full-viewport iframe with CRM embedded
- Loading overlay with spinner
- Hides after iframe loads

## State Management

```typescript
const [isLoading, setIsLoading] = useState(true);  // Loading state
```

## Iframe Configuration

```typescript
<iframe
  src="https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entitylist&etn=new_hemyreports&viewid=c8d0f12a-4ec9-4c46-98b5-631ddd68c890&viewType=1039&navbar=off"
  className="h-full w-full border-0"
  allow="geolocation; microphone; camera; payment"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
  onLoad={() => setIsLoading(false)}
/>
```

### URL Parameters
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `appid` | `b86bd27b-2e83-ec11-8d21-000d3a64cba3` | CRM app ID |
| `pagetype` | `entitylist` | Display as list view |
| `etn` | `new_hemyreports` | Custom reports entity |
| `viewid` | `c8d0f12a-4ec9-4c46-98b5-631ddd68c890` | Reports view ID |
| `viewType` | `1039` | List view type |
| `navbar` | `off` | Hide CRM navigation |

### Security Configuration
- **Sandbox**: `allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation`
- **Permissions**: `geolocation microphone camera payment`
- **Border**: `none` (full integration)

## Styling

Uses Tailwind CSS with custom theme:
- **Primary**: Navy blue (`#021838`)
- **Background**: Cream white (`#FAF8F2`)
- **Accent**: Brown (`#7C4D2F`)
- **Border**: Light gray (`#DDD4C0`)

### Key CSS Classes
- `sticky top-0 z-40` - Fixed header positioning
- `h-[calc(100vh-80px)]` - Full viewport minus header
- `animate-pulse` - Status indicator animation
- `animate-spin` - Loading spinner animation

## Hemy Reports Entity

### Entity Overview
- **Technical Name**: `new_hemyreports` (custom CRM entity)
- **Purpose**: Store and manage custom reports
- **Access**: List view displays all accessible reports

### Typical Operations
- Create new reports
- Edit existing reports
- View report details
- Delete reports
- Share reports with team members
- Generate report data

## Data Flow

```
Component Mount
    ↓
Set loading = true
    ↓
Render iframe
    ↓
CRM loads reports view
    ↓
iframe onLoad event
    ↓
Set loading = false
    ↓
Hide loading indicator
    ↓
Display report list
```

## Integration Points

### Authentication
- Inherits session authentication from parent app
- Uses shared cookies/auth context
- CRM validates permissions per user role

### Sidebar Navigation
- Accessible via main navigation menu
- Part of dashboard routing
- Can be linked with specific report ID

### Feedback System
- FloatingFeedbackButton available on page
- Users can provide feedback on reports

## Usage Example

```tsx
import { HemyReportsPage } from '@/pages/HemyReportsPage';

// In routes
<Route path="/reports" element={<HemyReportsPage />} />

// Navigation
<SidebarItem icon={DocumentIcon} onClick={() => navigate('/reports')}>
  Hemy Reports
</SidebarItem>
```

## Error Handling

Current implementation does not handle:
- iframe load failures
- network errors
- timeout scenarios
- CRM permission errors

## Security Considerations

### Iframe Sandbox
- Restricts capabilities to minimum required
- `allow-same-origin` enables session sharing
- `allow-scripts` enables CRM interactivity
- `allow-forms` allows report submission
- `allow-popups` enables popup reports

### Authentication
- No explicit token passing
- Session-based authentication
- CRM enforces row-level security

## Performance

- Full iframe height (`100vh - 80px`) may impact performance
- Large report datasets could slow rendering
- No virtualization implemented
- Load time depends on CRM server

## Limitations

- Cannot customize view from React component
- No offline support
- No timeout handling
- Cannot filter reports from React layer
- No caching of report data

## Future Enhancements

- [ ] Add error boundary for load failures
- [ ] Implement timeout with retry
- [ ] Add client-side report filtering
- [ ] Add quick report shortcuts
- [ ] Implement report caching
- [ ] Add report export options
- [ ] Add keyboard shortcuts
- [ ] Improve accessibility

## Troubleshooting

### Blank iframe
- Check network tab for CRM request status
- Verify user has view permissions
- Check browser console for errors
- Verify CRM instance URL is correct

### Stuck loading spinner
- Refresh the page
- Check CRM server status
- Look for network timeouts
- Check user permissions

### Cannot interact with reports
- Verify CRM permissions
- Check sandbox allow attributes
- Ensure user role has necessary privileges
- Verify entity permissions

## Related Pages

- [HemyDataPage](./HemyDataPage.md) - Data entity view
- [HemyProjectsPage](./HemyProjectsPage.md) - Project management
- [MyActionPage](./MyActionPage.md) - Dashboard view
- [HemyXPage](./HemyXPage.md) - CRM main app
