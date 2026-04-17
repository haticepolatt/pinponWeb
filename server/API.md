# API Ozeti

Temel endpointler:

- `GET /api/health`
- `GET /api/auth/csrf-token`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/public/home`
- `GET /api/public/trainers`
- `GET /api/public/packages`
- `GET /api/public/availability?trainerId=...&from=...&to=...`
- `GET /api/dashboard`
- `GET /api/bookings`
- `POST /api/bookings`
- `PATCH /api/bookings/:bookingId/cancel`
- `POST /api/packages/purchase/:packageId`
- `GET /api/admin/users`
- `POST /api/admin/packages`
- `GET /api/admin/blocks`
- `POST /api/admin/blocks`
- `POST /api/admin/trainers/:trainerId/assign-block`
- `POST /api/trainer/custom-availability`
- `POST /api/trainer/unavailable`
- `GET /api/trainer/schedule?from=...&to=...`

Tum `POST`, `PATCH`, `DELETE` isteklerinde:

- `Authorization: Bearer <token>` gerekli olabilir.
- `x-csrf-token` header'i kullanilmalidir.
- Refresh token `httpOnly` cookie olarak doner.
