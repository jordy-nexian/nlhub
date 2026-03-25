# Nexian Training Portal

Rebuilt to match the earlier deployed Vercel app structure: Next.js app router, Prisma-backed Neon data, protected admin routes, tokenized booking links, and customer portal pages.

## Route structure

- `/auth/signin`
- `/admin`
- `/admin/customers`
- `/admin/customers/new`
- `/admin/sessions`
- `/admin/sessions/new`
- `/admin/registrations`
- `/admin/settings`
- `/book/[token]`
- `/portal/[token]`

## API structure

- `/api/auth/[...nextauth]`
- `/api/book/[token]`
- `/api/customers`
- `/api/customers/[id]`
- `/api/sessions`
- `/api/sessions/[id]`
- `/api/settings/webhooks`

## Environment

```bash
DATABASE_URL=postgres://...
ADMIN_EMAIL=admin@nexian.co.uk
ADMIN_PASSWORD=ChangeMe123!
N8N_BOOKING_WEBHOOK_URL=https://your-n8n-instance/webhook/booking-events
```

## Notes

- `npm run build` runs `prisma generate && next build`
- the app bootstraps its core tables and starter records on first request
- credentials auth is env-driven so trainer login can be changed without editing code
