# CLAUDE.md - AI Assistant Guide for Bimbelio Frontend

> **Project**: Bimbelio - AI-powered learning platform for Indonesian college entrance exam preparation (SNBT/UTBK, Kedinasan exams)
> **Repository**: bimbelio-frontend
> **Last Updated**: January 2026

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server (with Turbopack)
pnpm dev

# Build for production
pnpm build

# Run quality checks
pnpm check          # Runs both lint and typecheck
pnpm lint           # ESLint only
pnpm typecheck      # TypeScript only
pnpm format         # Prettier formatting
```

## Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript 5.9.2 (strict mode) |
| **UI** | React 19.2.3, Tailwind CSS 4, Radix UI, shadcn/ui |
| **State Management** | Zustand 5.0.7 |
| **Data Fetching** | Axios 1.12.2 |
| **Real-time** | Socket.IO Client 4.8.1 |
| **Forms** | React Hook Form + Zod validation |
| **Rich Text** | BlockNote 0.35.0 |
| **Math Rendering** | KaTeX, remark-math |
| **Package Manager** | pnpm 10.28.0 |
| **Auth** | JWT + Google OAuth via Supabase |
| **Storage** | Supabase buckets |

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (guest)/                  # Public routes (unauthenticated)
│   │   ├── (landing-page)/       # Homepage
│   │   ├── price/                # Pricing
│   │   ├── blog/, about/, etc.
│   ├── (main)/                   # Protected user routes
│   │   └── [web_sub_category]/   # Dynamic category routes
│   ├── (link)/                   # Link/share routes
│   └── api/                      # API routes (OG images, etc.)
│
├── components/
│   ├── _shared/                  # Cross-feature shared components
│   │   ├── auth/                 # Authentication UI
│   │   ├── navbar/, footer/      # Layout components
│   │   ├── homepage/             # Landing page sections
│   │   ├── payment/, subs/       # Payment & subscription UI
│   │   └── notification/         # Notification system
│   ├── workspace/                # Main learning workspace
│   │   ├── chat/                 # AI chat feature
│   │   ├── editor/               # Content editor
│   │   └── quiz/                 # Quiz interface
│   ├── ui/                       # Base UI components (shadcn-style)
│   ├── layout/                   # Layout wrappers
│   └── provider/                 # Context providers
│
├── lib/
│   ├── axios/                    # Axios instances & interceptors
│   ├── fetch-helper/             # Data fetching utilities
│   ├── socket/                   # Socket.IO setup
│   ├── utils/                    # Domain-specific utilities
│   ├── tracking/, pixel/         # Analytics
│   ├── utils.ts                  # Global utility functions
│   └── store.ts                  # Zustand stores
│
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── config/                       # Site configuration
├── styles/                       # Global CSS
└── _assets/                      # Static images & icons
```

## Key Architectural Patterns

### Route Groups (App Router)
- `(guest)` - Public pages without authentication
- `(main)` - Protected user pages requiring auth
- `(link)` - Link/sharing functionality

### State Management
- **Zustand** for global state (editor, chat)
- **Context Providers** for auth, notifications, theming
- **React Hook Form** for form state

### Data Fetching Pattern
```typescript
// Use these helpers from lib/fetch-helper/
import { getGeneral, mutateGeneral, deleteGeneral } from '@/lib/fetch-helper/fetch-helper';

// GET request
getGeneral(url, { setData, setLoading, onSuccess, onError });

// POST/PUT/DELETE
mutateGeneral(url, { payload, type: 'post', onSuccess });
```

### Component Conventions
```typescript
// Components use shadcn/ui style
import { cn } from '@/lib/utils';

export function MyComponent({ className, ...props }) {
  return (
    <div className={cn('base-classes', className)} {...props}>
      {/* content */}
    </div>
  );
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `HeroSection`, `ProviderSessionAuth` |
| Functions/Hooks | camelCase | `useBlocknoteEditorStore`, `getGeneral` |
| Constants | SCREAMING_SNAKE_CASE | `PATH_HEADER_KEYS` |
| Files | kebab-case | `provider-session-auth.tsx` |
| Directories | kebab-case | `fetch-helper`, `web-category` |

## Important Conventions for AI Assistants

### Language & Documentation
- **Use Indonesian** for code comments, explanations, and documentation
- Consolidate documentation - one markdown file per feature/task

### Development Rules

1. **Never generate code without understanding existing architecture**
   - Audit project structure before proposing solutions
   - Check for reusable components/functions first

2. **No new files without confirmation**
   - Prioritize using existing components
   - Discuss before adding new modules/files

3. **Database & Data Safety**
   - Never reset database without explicit instruction
   - Never generate mock data unless specifically requested

4. **Path Management**
   - Always use full paths in terminal commands
   - Format: `cd /path/to/project && command`

5. **Step-by-step execution**
   - Complete one phase before moving to next
   - Document progress and test each change

### Workflow Phases

1. **Analysis** - Understand request, audit structure, identify dependencies
2. **Planning** - Choose approach consistent with architecture, plan testing
3. **Implementation** - Step-by-step with testing at each change
4. **Validation** - Review, end-to-end test, update documentation

### Required Confirmations

Always ask before:
- Adding new files/modules/functions
- Changing database schema
- Modifying API contracts
- Changes affecting multiple components

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_API_URL              # Backend API URL
NEXT_PUBLIC_SOCKET_URL           # WebSocket server URL
NEXT_PUBLIC_SUPABASE_URL         # Supabase instance
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Supabase public key
NEXT_PUBLIC_SUPABASE_SECRET_KEY  # Supabase secret key
NEXT_PUBLIC_GOOGLE_CLIENT_ID     # Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET # Google OAuth secret
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/env.mjs` | Type-safe environment variables (Zod) |
| `src/proxy.ts` | Auth middleware, role-based redirects |
| `src/lib/utils.ts` | Global utilities (cn, formatCurrency, etc.) |
| `src/lib/store.ts` | Zustand stores |
| `src/supabaseClient.ts` | Supabase client & storage |
| `components.json` | shadcn/ui configuration |

## UI Components

This project uses **shadcn/ui** with **Radix UI** primitives. Before creating new UI:

1. Check `src/components/ui/` for existing components
2. Components available: button, card, dialog, form, input, select, tabs, tooltip, dropdown-menu, accordion, alert-dialog, checkbox, slider, and more
3. Use `cn()` from `@/lib/utils` for className merging

## Path Aliases

```typescript
// Use @ alias for imports
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSocket } from '@/lib/socket/useSocket';
```

## Quality Standards

- **ESLint** - Code linting (flat config)
- **Prettier** - Code formatting (with Tailwind class sorting)
- **TypeScript** - Strict mode enabled
- **No automated tests** - Manual testing required

Run before committing:
```bash
pnpm check   # Runs lint + typecheck
pnpm format  # Format code
```

## Performance Considerations

- Use `next/dynamic` for heavy components (code splitting)
- Images use modern formats (AVIF, WebP) via CDN
- Static assets have 1-year cache headers
- Turbopack enabled for fast development builds

## Common Tasks

### Adding a New Component
1. Check if similar component exists in `src/components/ui/`
2. If not, create in appropriate directory following naming conventions
3. Use TypeScript, Tailwind, and cn() utility

### Adding API Integration
1. Use `getGeneral`/`mutateGeneral` from `@/lib/fetch-helper/`
2. Axios instance auto-injects auth token and website category

### Working with Forms
1. Use React Hook Form + Zod for validation
2. Import form components from `@/components/ui/form`

### Real-time Features
1. Use Socket.IO via `@/lib/socket/`
2. Connect to `NEXT_PUBLIC_SOCKET_URL`

## Do Not

- Generate mock data without explicit request
- Reset or modify database directly
- Add files without checking for reusability first
- Skip the analysis phase
- Make changes that could break existing functionality
- Use short paths in terminal commands
- Create separate scattered documentation files

## Additional Resources

- See `.github/instructions/BASIC.instructions.md` for detailed Indonesian development guidelines
- Check `package.json` for available scripts and dependencies
- Refer to `next.config.ts` for build configuration
