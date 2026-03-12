Refactor performed: removed shadcn/ui and Radix-based UI components and replaced them with Tailwind-only components.

What I changed:
- Deleted entire folder src/frontend/components/ui (shadcn/radix components).
- Replaced usages of Input/Button/Card/Toaster/Tooltip with local Tailwind implementations:
  - src/frontend/components/Input.tsx (new)
  - src/frontend/components/Button.tsx (new)
  - Reworked WeatherCard to use divs instead of Card/CardContent
  - Replaced Toaster/TooltipProvider with no-op components in src/frontend/App.tsx
  - Adjusted Autocomplete imports to use the new Input component

Notes / Next steps:
- Run the dev server and fix any remaining import paths that point to '@/components/ui' from other areas.
- Optionally implement a global Toaster UI that renders toasts from src/frontend/hooks/use-toast.ts
- Search the codebase for any lingering imports like "@/components/ui/*" and update accordingly.
