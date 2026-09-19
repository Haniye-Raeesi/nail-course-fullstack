This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learning Platform

The v4 redesign now includes the first LMS flow:

- `/dashboard` — student dashboard and course progress
- `/learn/[courseSlug]` — course learning area and lesson list
- `/learn/[courseSlug]/[lessonId]` — lesson/video page
- Locked lessons are visually separated from accessible lessons.
- `SpotPlayerFrame` is ready for a SpotPlayer provider via `NEXT_PUBLIC_SPOTPLAYER_URL`.

Example environment variable:

```env
NEXT_PUBLIC_SPOTPLAYER_URL=https://YOUR-SPOTPLAYER-PLAYER-ENDPOINT
```

The backend also exposes lesson access through:

```text
GET /api/courses/{courseId}/lessons
GET /api/courses/{courseId}/lessons/{lessonId}
```

The API only returns `videoId` when the lesson is free or the authenticated user has an active enrollment.

## Instructor Panel

- `/teacher` — پنل اختصاصی استاد
- مدیریت دوره‌ها و انتشار/عدم انتشار
- افزودن درس و Video ID
- گزارش درآمد و پرداخت‌ها
- فهرست هنرجویان و پیشرفت
- آمار کلی سامانه

### Teacher access

Backend uses ASP.NET Core Identity roles and JWT role claims. Teacher endpoints are protected with `[Authorize(Roles = "Teacher,Admin")]` and authorization is enforced server-side.

Set `Teacher:Email` in the backend configuration/environment to the already-registered instructor account. On application startup the `Teacher` role is created if needed and assigned to that email. Do not store passwords or secret keys in source control.

For production, keep JWT keys, database credentials, payment credentials and the teacher email in environment/secret management, enforce HTTPS, use a real production database, add rate limiting/WAF, and use short-lived access tokens with refresh-token rotation.
