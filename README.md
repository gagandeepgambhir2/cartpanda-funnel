# Cartpanda – Upsell Funnel Builder

This project is a **visual drag-and-drop upsell funnel builder** created as part of the Cartpanda Frontend Engineer.
It focuses on building a clean and usable **visual editor only**, without any backend or authentication.

---

## What it does

- Drag and drop funnel pages onto a canvas  
- Connect pages visually (Sales → Order → Upsell → Downsell → Thank You)
- Supported page types:
  - Sales Page
  - Order Page
  - Upsell
  - Downsell
  - Thank You
- Undo / Redo actions
- Delete selected nodes
- Clear the canvas
- Import funnel from JSON
- Export funnel as JSON

---

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Flow

---

## Running the project locally

Make sure you have Node.js installed.

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/gagandeepgambhir2/cartpanda-funnel

# Step 2: Navigate to the project directory.
cd cartpanda-funnel

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

```
---

## Dashboard Architecture


Admin Dashboard Architecture

The following section documents how I would architect a scalable admin dashboard supporting funnels, orders, customers, subscriptions, analytics, disputes, settings, and permissions.

The core goals are:

High performance

Consistent UI/UX

Accessibility by default

Easy scaling with multiple engineers working in parallel

---

# 1. Architecture

High-level structure

I would use a feature-based architecture instead of grouping files by type.

```sh

src/

  app/            

  features/

    funnels/

    orders/

    customers/

    analytics/

    settings/

  shared/

    ui/             

    hooks/

    utils/

    types/

```

Each feature owns:

- Its routes
- Its data queries
- Its feature-specific components

This avoids cross-feature coupling and prevents the codebase from becoming difficult to maintain as it grows.

Routing

- A central router defines top-level routes
- Each feature exports its own route configuration
- Nested routes for pages like /funnels/:id/edit

This allows teams to work independently without constantly modifying a single global router file.

# 2. Design System
Component strategy

I would build on top of a proven UI foundation rather than creating everything from scratch.

- Base primitives: Radix UI (accessibility-first)
- Styling: Tailwind CSS
- Custom design system: shared/ui

This gives:

- WCAG-compliant components by default
- Full visual control
- No vendor lock-in

Consistency enforcement

- Design tokens for colors, spacing, and typography
- No raw colors or spacing values outside tokens
- Shared components only (buttons, inputs, tables)

Components would be documented using Storybook, including accessibility notes and usage guidelines.

# 3. Data Fetching & State Management
Server vs client state

- TanStack Query for all server state(funnels, orders, analytics, etc.)

- Local React state only for UI state(modals, selected rows, open panels)

This avoids duplicated logic and keeps data consistent across the application.

Loading, error & empty states

Every query must define:

- Loading skeleton
- Error message with retry
- Empty state (not just “no data”)

These patterns are shared to ensure consistent behavior.

Tables (filters, sorting, pagination)

- Server-driven pagination and filtering
- Query keys include filters and sorting state
- URL synced with table state for shareable links

# 4. Performance
Rendering optimizations

- Route-based code splitting
- Feature-level lazy loading
- Memoized heavy components
- Virtualized tables for large datasets

Measuring performance
- Web Vitals
- Page-level timing metrics
- Interaction timing (e.g., table load, filter application)

# 5. Developer Experience & Team Scaling
Onboarding
- Clear folder structure
- README per feature explaining patterns

Enforced conventions
- ESLint + Prettier
- Strict TypeScript
- Path aliases
- Component and hook naming rules

Preventing one-off UI

- No inline styles
- No custom buttons outside the design system
- PRs blocked if shared components are bypassed

This ensures UI consistency even as the team grows.

# 6. Testing Strategy
What to test
- Unit tests: utilities, hooks, complex logic
- Integration tests: key flows (create funnel, place order)
- E2E tests: critical paths only

Minimum bar to move fast

- Feature logic must be tested
- At least one integration test per major feature
- E2E reserved for business-critical flows

This balances speed with confidence.

# 7. Release & Quality
Safe shipping
- Feature flags for risky changes
- Gradual rollouts
- Error tracking and performance monitoring

Handling failures
- Fast rollback
- Clear error boundaries
- User-friendly error states

The goal is to ship quickly without breaking trust.

