# Cloudflare hosting

Worker `findyourflowstate` serves `findyourflowstate.michaelzick.com`. Workers Builds uses `michaelzick/findyourflowstate`, branch `main`, root `/`, build command `npm ci && npm run build`, deploy command `npm run deploy:cloudflare`. Set public build variables `NODE_VERSION=24` and `SKIP_DEPENDENCY_INSTALL=1`.

Use Node 24 and npm. Run lint, typecheck, existing tests, and build before deployment. `npm run preview:cloudflare` serves the built `dist` folder in Workers with SPA fallback; verify direct navigation and refresh on nested routes. `npm run deploy:cloudflare` deploys the built assets.

This static frontend needs no private Worker secrets. Never copy credentials from the parent coaching site into its build. Public Supabase publishable configuration, where used, remains browser-visible; the existing Supabase backend is unchanged. Preserve localStorage keys and the production hostname so saved user data survives the move.

For rollback, restore the saved DigitalOcean hostname target while retaining Cloudflare DNS. Keep the old DigitalOcean app for 48 hours after validation before archival.
