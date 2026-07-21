# Hemy 360 (prototype)

A sophisticated Fabric-authenticated data dashboard built on React + Vite and Rayfin,
featuring Microsoft Fabric KQL Dashboard embedding with real-time capacity metrics.
The app uses a custom **navy blue, cream white, and brown** theme with sidebar navigation
and seamless MSAL-based token authentication for Fabric API access.

> This is a Rayfin + Fabricator app: builds and auto-deploys to Fabric with the Fabricator agent,
> using MSAL for Azure AD authentication and the Fabric Embed SDK for interactive dashboard embedding.

## Getting started

In Fabricator, the app is automatically built and deployed. To build locally or deploy from the CLI:

```bash
npm run build      # Local production build
npm run rayfin:up  # Deploy to Fabric (runs automatic build + deploy)
```

## Project structure

```text
├── rayfin/
│   ├── rayfin.yml          # Fabric service configuration
│   └── data/
│       └── schema.ts       # Rayfin data schema
├── src/
│   ├── main.tsx            # Entry point + Rayfin + MSAL bootstrap
│   ├── App.tsx             # Routes and auth gate
│   ├── main.css            # Tailwind + custom theme (navy/cream/brown)
│   ├── hooks/
│   │   └── AuthContext.tsx # React context wrapping Rayfin auth
│   ├── components/
│   │   ├── AuthPage.tsx    # Sign-in UI with MSAL
│   │   ├── Sidebar.tsx     # Responsive sidebar nav with menu items
│   │   ├── ActionMenu.tsx  # Dropdown menu for user actions
│   │   └── MsalAuthWrapper.tsx # Route-level MSAL redirect handler
│   ├── pages/
│   │   ├── HemyLiveDataPage.tsx  # Fabric KQL Dashboard embed + MSAL token provider
|   |   ├── HemyXPage.tsx         # Dynamics 365 CRM Page in iframe
|   |   ├── HemyDataPage.tsx      # Dummy page for Dynamics 365 Hemy Data page in iframe
|   |   ├── HemyProjectsPage.tsx  # Dynamics 365 Projects page in iframe
|   |   ├── HomePage.tsx          # Default Home page from the ToDo app rayfin template
|   |   ├── MyActionPage.tsx      # Hemy Action dashboard page in iframe
|   |   ├── WebRTCStreamPage.tsx  # Streamer page for testing of Omniverse streaming site
|   |   ├── HemyReportsPage.tsx   # Hemy Reports Dynamics 365 page in iframe
│   └── services/
│       ├── IAuthService.ts        # Auth service contract
│       ├── RayfinAuthService.ts   # Fabric brokered auth
│       ├── msalConfig.ts          # MSAL PublicClientApplication setup
│       ├── rayfinClient.ts        # Typed Rayfin client singleton
│       └── bootstrap.ts           # Reads env, builds auth service
└── package.json
```

## Features

### 🎨 Custom Theme
- **Navy blue** (#021838) primary color
- **Cream white** (#FAF8F2) background
- **Brown** (#7C4D2F) accents
- Tailwind CSS with custom color palette

### 🧭 Navigation
- **Sidebar menu** with collapsible navigation (responsive to screen size)
- Menu items: Home, Explore, Messages, Resources, Starred, Settings, Log Out
- **Action dropdown** in header for user actions
- Mobile-aware layout with breakpoints

### 📊 Fabric KQL Dashboard
- **HemyLiveDataPage** embeds a Microsoft Fabric KQL Dashboard
- Real-time capacity metrics and live data queries
- Custom theme applied to embedded dashboard

### 🔐 Authentication
- **MSAL** (Azure AD) integration via `@azure/msal-browser` and `@azure/msal-react`
- **Automatic token acquisition** with Fabric API scope (`https://api.fabric.microsoft.com/.default`)
- **Token refresh button** in header to clear cache and request new token
- Silent token acquisition with redirect fallback
- Secure redirect URI handling for post-login callback

### 🚀 Token Management
- Tokens acquired with correct Fabric scope (fixed from Report.Read.All)
- Token provider callback for Fabric SDK (`accessTokenProvider`)
- Silent token refresh on dashboard interaction
- Error handling with user-facing feedback

## Recent Updates

- ✅ Fixed MSAL token scope: switched from `Report.Read.All` to `https://api.fabric.microsoft.com/.default`
- ✅ Added reload button in header to clear MSAL cache and request fresh token
- ✅ Implemented proper error handling for token acquisition failures
- ✅ Secured MSAL initialization with await guarantees
- ✅ Removed PII (email) from MSAL login hints
- ✅ Custom theme fully applied (navy/cream/brown color scheme)
- ✅ Sidebar menu with responsive icons from box-icons library

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build with Vite |
| `npm run rayfin:up` | Build + deploy to Fabric workspace |
| `npm run preview` | Headless visual validation (charts against live data) |
| `npm run lint` | Lint with ESLint |

## Authentication Flow

1. **Initial Load**: Check if user is authenticated via Rayfin
2. **Sign-In**: Redirect to Azure AD login page (MSAL)
3. **Post-Redirect**: `HemyLiveDataPage` initializes MSAL and handles redirect callback
4. **Token Acquisition**: Silent token acquisition using Fabric API scope
5. **Dashboard Load**: Fabric SDK embeds dashboard with token provider callback
6. **Token Refresh**: Click reload button in header to clear cache and request new token

## Troubleshooting

### 401 Unauthorized errors
- Ensure MSAL token scope is `https://api.fabric.microsoft.com/.default` (not `Report.Read.All`)
- Click the reload button (⟲) to clear the token cache and acquire a fresh token

### MSAL initialization errors
- Verify Azure AD app registration has the correct Redirect URI (should match Fabric app URL)
- Check console logs for `[HemyLiveDataPage]` entries to trace initialization flow
- Ensure MSAL configuration in `src/services/msalConfig.ts` includes all required settings
