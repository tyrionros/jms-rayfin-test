# Documentation Index

Welcome to the Hemy 360 project documentation. This comprehensive guide covers all pages, components, services, and hooks in the application.

## Quick Start

1. **New to the project?** Start with the [README.md](../README.md)
2. **Understanding the architecture?** See [Architecture Overview](#architecture-overview) below
3. **Looking for specific component?** Use the sections below to navigate

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    React Application                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │           Pages (Route Components)            │ │
│  │  - HomePage (Todo Management)                │ │
│  │  - CRM Pages (HemyX, Reports, Projects, etc) │ │
│  │  - WebRTC Viewer                             │ │
│  └───────────────────────────────────────────────┘ │
│                        ↓                           │
│  ┌───────────────────────────────────────────────┐ │
│  │         Components (Reusable UI)              │ │
│  │  - ActionMenu (Dropdown)                     │ │
│  │  - FeedbackModal (Modal Dialog)              │ │
│  │  - FloatingFeedbackButton (FAB)              │ │
│  │  - Sidebar, AuthPage, etc                    │ │
│  └───────────────────────────────────────────────┘ │
│                        ↓                           │
│  ┌───────────────────────────────────────────────┐ │
│  │       Services (Business Logic)               │ │
│  │  - todos (CRUD operations)                   │ │
│  │  - feedback (Submit feedback)                │ │
│  │  - rayfinClient (Backend access)             │ │
│  │  - fabricTokenService (Token acquisition)    │ │
│  │  - Auth services (MSAL, Rayfin)              │ │
│  └───────────────────────────────────────────────┘ │
│                        ↓                           │
│  ┌───────────────────────────────────────────────┐ │
│  │     Rayfin Backend (Database & Auth)          │ │
│  │  - Todo table                                │ │
│  │  - Feedback table                            │ │
│  │  - User authentication                       │ │
│  └───────────────────────────────────────────────┘ │
│                        ↓                           │
│  ┌───────────────────────────────────────────────┐ │
│  │     External APIs & Services                  │ │
│  │  - Microsoft Fabric (Dashboards)             │ │
│  │  - Dynamics CRM (Data, Projects, Reports)    │ │
│  │  - MSAL (Azure AD Authentication)            │ │
│  │  - Omniverse WebRTC (Video Streaming)        │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Pages

Pages are route-level components that display full screens/views.

### Core Pages

| Page | File | Purpose |
|------|------|---------|
| **HomePage** | [docs/pages/HomePage.md](./pages/HomePage.md) | Todo management dashboard |
| **MyActionPage** | [docs/pages/MyActionPage.md](./pages/MyActionPage.md) | User action dashboard |

### Dynamics CRM Pages

| Page | File | Purpose |
|------|------|---------|
| **HemyXPage** | [docs/pages/HemyXPage.md](./pages/HemyXPage.md) | Main CRM application |
| **HemyDataPage** | [docs/pages/HemyDataPage.md](./pages/HemyDataPage.md) | Data entity view |
| **HemyProjectsPage** | [docs/pages/HemyProjectsPage.md](./pages/HemyProjectsPage.md) | Project management |
| **HemyReportsPage** | [docs/pages/HemyReportsPage.md](./pages/HemyReportsPage.md) | Reports view |

### Integration Pages

| Page | File | Purpose |
|------|------|---------|
| **WebRTCStreamPage** | [docs/pages/WebRTCStreamPage.md](./pages/WebRTCStreamPage.md) | Video streaming viewer |

## Components

Reusable UI components used across pages.

### Navigation & Menu

| Component | File | Purpose |
|-----------|------|---------|
| **Sidebar** | See README | Main navigation sidebar |
| **ActionMenu** | [docs/components/ActionMenu.md](./components/ActionMenu.md) | Dropdown menu |

### Authentication

| Component | File | Purpose |
|-----------|------|---------|
| **AuthPage** | See README | Sign-in UI |
| **MsalAuthWrapper** | See README | Route protection |

### Feedback

| Component | File | Purpose |
|-----------|------|---------|
| **FeedbackModal** | [docs/components/FeedbackModal.md](./components/FeedbackModal.md) | Feedback form modal |
| **FloatingFeedbackButton** | [docs/components/FloatingFeedbackButton.md](./components/FloatingFeedbackButton.md) | Floating action button |

## Services

Services contain business logic for data operations and external integrations.

### Data & Backend

| Service | File | Purpose |
|---------|------|---------|
| **todos** | [docs/services/todos.md](./services/todos.md) | Todo CRUD operations |
| **feedback** | [docs/services/feedback.md](./services/feedback.md) | Feedback submission |
| **rayfinClient** | [docs/services/rayfinClient.md](./services/rayfinClient.md) | Rayfin backend access |

### Authentication

| Service | File | Purpose |
|---------|------|---------|
| **RayfinAuthService** | See README | Rayfin authentication |
| **msalConfig** | See README | MSAL configuration |
| **bootstrap** | See README | App initialization |

### External APIs

| Service | File | Purpose |
|---------|------|---------|
| **fabricTokenService** | [docs/services/fabricTokenService.md](./services/fabricTokenService.md) | Fabric API tokens |

## Hooks

Custom React hooks for state management and context.

| Hook | File | Purpose |
|------|------|---------|
| **AuthContext** | See README | Authentication context |

## Common Workflows

### 1. Creating a Todo
```
User enters title in HomePage
    ↓
Clicks "Add" button
    ↓
handleAddTodo() validates input
    ↓
Calls todos.createTodo(title)
    ↓
Service gets Rayfin client
    ↓
Creates todo with user_id
    ↓
Backend persists
    ↓
Component refreshes todo list
    ↓
UI updates with new todo
```

### 2. Submitting Feedback
```
User clicks floating button
    ↓
FloatingFeedbackButton opens FeedbackModal
    ↓
User rates and writes message
    ↓
Clicks Submit
    ↓
FeedbackModal validates rating
    ↓
Calls feedback.submitFeedback()
    ↓
Service stores in backend
    ↓
Show success message
    ↓
Modal closes
```

### 3. Loading CRM Dashboard
```
User navigates to HemyXPage
    ↓
Component loads
    ↓
Sets loading state
    ↓
iframe loads CRM URL
    ↓
CRM loads in iframe
    ↓
iframe.onLoad fires
    ↓
Loading state cleared
    ↓
Dashboard visible
```

### 4. Streaming Video
```
User opens WebRTCStreamPage
    ↓
Enters server URL
    ↓
Clicks Connect
    ↓
handleConnect creates RTCPeerConnection
    ↓
Creates WebRTC offer
    ↓
Sends to server
    ↓
Receives answer
    ↓
Sets remote description
    ↓
ontrack: receives video stream
    ↓
Creates video element
    ↓
Renders to container
    ↓
Video displays
```

## Data Models

### Todo
```typescript
{
  id: string;              // Unique identifier
  title: string;           // Todo text
  isCompleted: boolean;    // Completion status
  createdAt: Date;         // Created timestamp
  user_id: string;         // User who created
}
```

### Feedback
```typescript
{
  id: string;              // Unique identifier
  user_id: string;         // User who submitted
  user_email: string;      // User email
  subject: string;         // Page/feature
  message: string;         // Feedback text
  rating: number;          // 1-5 star rating
  createdAt: Date;         // Submission timestamp
}
```

## Theme Colors

The application uses a custom navy, cream, and brown color scheme:

- **Primary**: Navy Blue (`#021838`)
- **Background**: Cream White (`#FAF8F2`)
- **Accent**: Brown (`#7C4D2F`)
- **Border**: Light Gray (`#DDD4C0`)
- **Secondary Text**: Tan (`#C4956A`)

All colors are applied via Tailwind CSS custom color palette.

## Authentication Flow

1. **Initial Load**: App checks if user authenticated via Rayfin
2. **Not Authenticated**: Redirect to AuthPage (MSAL login)
3. **MSAL Login**: User signs in with Microsoft/Azure AD
4. **Post-Login**: Redirect back with auth token
5. **Rayfin Bootstrap**: Initialize Rayfin client with auth
6. **App Ready**: User can access all pages

## File Structure

```
src/
├── pages/
│   ├── HomePage.tsx
│   ├── HemyLiveDataPage.tsx
│   ├── HemyDataPage.tsx
│   ├── HemyProjectsPage.tsx
│   ├── HemyReportsPage.tsx
│   ├── HemyXPage.tsx
│   ├── MyActionPage.tsx
│   └── WebRTCStreamPage.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── AuthPage.tsx
│   ├── MsalAuthWrapper.tsx
│   ├── ActionMenu.tsx
│   ├── FeedbackModal.tsx
│   ├── FloatingFeedbackButton.tsx
│   └── ... others
├── services/
│   ├── rayfinClient.ts
│   ├── fabricTokenService.ts
│   ├── todos.ts
│   ├── feedback.ts
│   ├── RayfinAuthService.ts
│   ├── IAuthService.ts
│   ├── msalConfig.ts
│   └── bootstrap.ts
├── hooks/
│   └── AuthContext.tsx
├── App.tsx
└── main.tsx

docs/
├── pages/
│   ├── HomePage.md
│   ├── HemyDataPage.md
│   ├── HemyProjectsPage.md
│   ├── HemyReportsPage.md
│   ├── HemyXPage.md
│   ├── MyActionPage.md
│   └── WebRTCStreamPage.md
├── components/
│   ├── ActionMenu.md
│   ├── FeedbackModal.md
│   └── FloatingFeedbackButton.md
├── services/
│   ├── rayfinClient.md
│   ├── fabricTokenService.md
│   ├── feedback.md
│   └── todos.md
└── INDEX.md (this file)
```

## Getting Started

### For New Developers

1. Read [README.md](../README.md) for project overview
2. Understand authentication by reading [RayfinAuthService](../docs/services/RayfinAuthService.md)
3. Review [HomePage.md](./pages/HomePage.md) as main app example
4. Pick a feature and read its documentation

### For Adding New Features

1. Identify pages affected
2. Check if components exist or need to be created
3. Implement service layer for data operations
4. Use existing components/services where possible
5. Document new files following this structure

### For Fixing Bugs

1. Find relevant page/component/service documentation
2. Understand current implementation
3. Reproduce issue
4. Make surgical changes
5. Update documentation if behavior changes

## Common Tasks

### Add New Page
1. Create file in `src/pages/`
2. Create documentation in `docs/pages/`
3. Add route in `App.tsx`
4. Add sidebar menu item
5. Follow existing page structure

### Add New Component
1. Create file in `src/components/`
2. Create documentation in `docs/components/`
3. Document props and usage
4. Add examples
5. List in README

### Add New Service
1. Create file in `src/services/`
2. Create documentation in `docs/services/`
3. Export clear API functions
4. Handle errors properly
5. Document integration points

## Testing

Each component and service should have tests. Examples provided in respective documentation files.

## Best Practices

1. **Follow Conventions**: Match existing code style
2. **Document Changes**: Update docs when changing code
3. **Handle Errors**: Always provide user feedback
4. **Type Everything**: Use TypeScript for safety
5. **Test Thoroughly**: Include test cases
6. **Keep It Simple**: Avoid over-engineering
7. **Reuse Components**: Don't duplicate code
8. **Optimize Performance**: Profile before optimizing

## Links & Resources

- [README.md](../README.md) - Project overview
- [AGENTS.md](../AGENTS.md) - Rayfin agent context
- [Rayfin Docs](../rayfin/data/schema.ts) - Data schema

## Troubleshooting Guide

### Common Issues

**"Client not initialized"**
- Ensure `bootstrapAuth()` runs before component render

**"User not authenticated"**
- Check auth service initialized
- Verify MSAL login completed
- Look for auth context usage

**"CRM iframe not loading"**
- Check CRM URL is correct
- Verify user permissions
- Check sandbox attributes

**"WebRTC connection fails"**
- Verify server URL is reachable
- Check network connectivity
- Review firewall settings

For more details, see individual component troubleshooting sections.

## Contributing

When adding to documentation:

1. Match existing format and structure
2. Include code examples
3. Document all parameters
4. Explain error handling
5. Link to related docs
6. Add to this index

## Updates & Maintenance

Documentation is version-controlled with code. Keep in sync:

- Update docs when code changes
- Add docs for new files
- Remove docs for deleted files
- Keep examples up-to-date
- Fix broken links

---

**Last Updated**: 2026-07-21  
**Documentation Version**: 1.0  
**Project Version**: See package.json
