# AGENTS.md - Development Guidelines

## Build, Lint, and Test Commands

| Command                   | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `npm run dev`             | Start Next.js development server                |
| `npm run build`           | Build for production                            |
| `npm run analyze`         | Build with bundle analyzer                      |
| `npm run start`           | Start production server                         |
| `npm run typecheck`       | Run TypeScript type checking (`tsc --noEmit`)   |
| `npm run jest`            | Run Jest tests                                  |
| `npm run jest:watch`      | Run Jest in watch mode                          |
| `npm run prettier:check`  | Check code formatting                           |
| `npm run prettier:write`  | Fix code formatting issues                      |
| `npm run test`            | Run full test suite (prettier, typecheck, jest) |
| `npm run storybook`       | Start Storybook on port 6006                    |
| `npm run storybook:build` | Build Storybook static site                     |
| `npm run server`          | Run custom Express server (server.js)           |

### Running a Single Test

```bash
# Run a single test file
npm run jest -- CardService.test.tsx

# Run tests matching a pattern
npm run jest -- --testNamePattern="Welcome component"

# Run tests in watch mode for a specific file
npm run jest:watch -- CardService.test.tsx
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - All TypeScript strict options are on
- Use explicit types for function parameters and return values
- Use interfaces for object shapes, types for unions/primitives
- Avoid `any` - use `unknown` when type is uncertain
- Use `tsc --noEmit` before committing to catch type errors

### Imports and Path Aliases

The project uses path aliases configured in `tsconfig.json`:

- `@/_components/*` → `app/_components/*`
- `@/_redux/*` → `app/_redux/*`
- `@/_utils/*` → `app/_utils/*`
- `@/_cssModules/*` → `app/_cssModules/*`

```typescript
// Good
import { Button, Text } from "@mantine/core";
import { authApi } from "@/_redux/services/authApi";
import { formatJalaliTimeAgo } from "@/_utils/utils";

// Avoid
import { Button } from "../../../../node_modules/@mantine/core";
```

### Naming Conventions

- **Components**: PascalCase (e.g., `CardService`, `Header`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Modules**: kebab-case (e.g., `card-service.module.css`)
- **Variables/Functions**: camelCase (e.g., `formatNumber`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE or camelCase based on context
- **Redux Slices**: camelCase (e.g., `authSlice`)
- **RTK Query Services**: camelCase (e.g., `cpuApi`)

### Component Structure

```typescript
// Order: Imports → Interfaces → Component → Export
import { Button, Group } from '@mantine/core';
import classes from './component.module.css';

interface ComponentProps {
  title: string;
  onClick: () => void;
}

export function Component({ title, onClick }: ComponentProps) {
  return (
    <div className={classes.container}>
      <Group>
        <Button onClick={onClick}>{title}</Button>
      </Group>
    </div>
  );
}

export default Component;
```

### React/Next.js

- Use `"use client"` directive for client-side components
- Use App Router conventions with `page.tsx`, `layout.tsx`, `route.ts`
- Prefer Server Components unless client interactivity is needed
- Use Mantine components for UI (already integrated with Next.js)
- Use Mantine's styling system (classes prop, style props)

### Redux and State Management

- Use Redux Toolkit (createSlice, createApi)
- Use RTK Query for API calls with proper tag invalidation
- Follow the pattern in `app/_redux/services/api.ts` for base query
- Define types for state slices (see `auth.ts`)

```typescript
// RTK Query endpoint pattern
export const cpuApi = createApi({
  reducerPath: "cpuApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["cpu"],
  endpoints: (builder) => ({
    getCpu: builder.query<CpuResponse, string>({
      query: (id) => `/cpu/${id}`,
      providesTags: (result) =>
        result ? [{ type: "cpu", id: result.id }] : [],
    }),
  }),
});
```

### API Routes (Next.js App Router)

- Use `NextResponse.json()` for responses
- Handle authentication with cookies
- Include proper error handling with try-catch
- Log errors to console for debugging

```typescript
export async function GET(request: Request) {
  const token = cookies().get("authToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/endpoint`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) throw new Error("Failed");
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

### CSS and Styling

- Use CSS Modules (`.module.css`) for component-scoped styles
- Use Mantine theming (`theme.ts`) for colors and design tokens
- SCSS syntax supported with stylelint configured
- Use `@mixin` and variables from Mantine
- Follow patterns in `app/_cssModules/`

```css
.wrapper {
  display: flex;
  align-items: center;

  @media (max-width: $mantine-breakpoint-sm) {
    flex-direction: column;
  }
}
```

### Error Handling

- Wrap async operations in try-catch blocks
- Return appropriate HTTP status codes (400, 401, 500, etc.)
- Log errors with descriptive messages
- Use typed errors when possible
- Never expose sensitive information in error responses

### Testing

- Use Jest with React Testing Library
- Create test files as `<component>.test.tsx` alongside components
- Use `test-utils` for rendering with providers
- Follow the pattern in `CardService.test.tsx`

```typescript
import { render, screen } from '../../../test-utils';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" onClick={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Formatting and Linting

- **Prettier**: Runs on `.ts` and `.tsx` files
- **Stylelint**: Configured for SCSS in `.stylelintrc.json`
- **ESLint**: Implicit via Next.js
- Run `npm run test` before committing (includes prettier and typecheck)

### Utility Functions

- Place in `app/_utils/` directory
- Export named functions
- Use TypeScript types for parameters and returns
- Follow patterns in `utils.ts` (date formatting, number conversion, etc.)

### Environment Variables

- Use `NEXT_PUBLIC_*` prefix for client-side variables
- Never commit `.env` files (gitignored)
- Access via `process.env.NEXT_PUBLIC_*` or `process.env`
- See `.env` file for required variables

### Prettier Config

- `.prettierrc.cjs` exists but is minimal (1 line)
- Default Prettier settings apply
- Run `npm run prettier:write` to auto-format

### Key Dependencies

- **Framework**: Next.js 14.2.3 with App Router
- **UI**: Mantine 7.17.4 (core, hooks, carousel, notifications, etc.)
- **State**: Redux Toolkit + RTK Query
- **Testing**: Jest + React Testing Library
- **Styling**: Mantine + CSS Modules + SCSS
- **Icons**: Tabler Icons, Remix Icons
- **Auth**: next-auth (configured)
- **PWA**: @ducanh2912/next-pwa

### Code Review Checklist

- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Tests pass (`npm run jest`)
- [ ] Prettier formatting applied (`npm run prettier:write`)
- [ ] No console.log statements in production code (except API routes for debugging)
- [ ] Components use path aliases for imports
- [ ] Redux slices have proper types defined
- [ ] API routes handle errors gracefully
- [ ] CSS Modules used for component styling
- [ ] "use client" directive added only where needed
