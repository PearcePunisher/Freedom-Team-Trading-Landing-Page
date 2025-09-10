# Freedom Team Trading — Landing Page

This repository contains the Freedom Team Trading landing page — a Next.js (App Router + TypeScript) project focused on conversion-first layout, fast loading, and accessible UI. The site copy is intentionally preserved verbatim for deployment; styling and layout are updated here to improve readability and conversions.

## Quick overview
- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS + custom utilities
- Key features: lazy video embeds (Vimeo), deferred iClosed scheduler widget, animated reveal (FadeIn), responsive/optimized images

## Local development (quick start)
Prerequisites:
- Node 18+ (or the version supported by your environment)
- pnpm installed (or use npm/yarn — adapt commands)

1. Install dependencies

```powershell
pnpm install
```

2. Run dev server (local):

```powershell
pnpm dev
```

Open http://localhost:3000 in your browser.

3. Build for production / start:

```powershell
pnpm build
pnpm start
```

## Notes & important implementation details
- The site uses client-side components for third-party embeds:
	- `components/lazy-vimeo.tsx` defers Vimeo iframes until near the viewport and provides a click-to-load affordance.
  
Scheduling is handled off-site via direct CTA links (query params are preserved client-side).
- Images are served via Next.js Image optimization. The `next.config.mjs` has been updated to include small `imageSizes` so the nav logo and phone mockup are not overserved at full resolution.
- Animations are powered by a lightweight `FadeIn` component; accessibility (prefers-reduced-motion) is respected.

## Environment & data
- If you use the lead-capture API (`/api/leads`) or any database-backed features, configure the required credentials locally via environment variables (for example, Neon/Postgres connection strings). There is no database configuration checked in.

## Testing and linting
- Lint: `pnpm lint` (if lint is configured)
- Type checking: `pnpm tsc --noEmit`

## Deployment
- The project is suitable for Vercel deployment (App Router). Ensure environment variables used by server APIs are set in your deployment environment.

## Troubleshooting
- If images appear large or pixelated, clear `.next` and rebuild: `pnpm build`.
- If embeds do not appear locally, verify your browser console — third-party scripts sometimes block on 3rd-party cookie settings or CSP.

## Contributing
- Keep marketing copy unchanged unless instructed. Styling and layout improvements are welcome via PRs.

---
If you want, I can add a small developer checklist, Dockerfile, or a script to seed test data for local testing.
