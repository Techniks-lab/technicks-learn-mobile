# Technicks Learn — Learning & Gamification Plan

Full-stack plan for lessons/curriculum, competitions/leaderboard, and streaks.

## 1. Data model (add to `server/src/prisma/contract.prisma`)

**Curriculum**
- `Lesson` — `id`, `slug` (unique), `title`, `description?`, `status` (`PUBLISHED|DRAFT`), `order`, timestamps. Content stays in `LessonBlock`.
- `LessonBlock` — `id`, `lessonId` (FK), `position`, `type` (`HEADING|TEXT|IMAGE|VIDEO`), `text?`, `url?`, `caption?`.
- `LessonCompletion` — `userId` + `lessonId` (composite PK), `completedAt`.

**Gamification**
- `XpEvent` — `id`, `userId`, `source` (`DAILY_CHECK_IN|LESSON_COMPLETED`), `amount`, `createdAt` (audit trail).
- `Competition` — weekly league window: `id`, `startsAt`, `endsAt`, `unique([startsAt, endsAt])` (one rolling competition per week).
- `CompetitionMember` — `competitionId` + `userId`, `points`, `joinedAt`, `unique([competitionId, userId])`.
- `CheckIn` — `id`, `userId`, `date` (YYYY-MM-DD), `createdAt`, `unique([userId, date])`.
- `User` — add `xp Int @default(0)` (denormalized; `XpEvent` is the source of truth, updated in the same transaction).

## 2. Server — two new NestJS modules (mirror `blog.module.ts` style)

Register in `app.module.ts`, add Swagger tags `learn` + `gamification`.

**`/api/v1/learn/lessons`** (public read, admin write)
- `GET /learn/lessons` — published lessons (ordered)
- `GET /learn/lessons/:slug` — lesson + content blocks
- `POST /learn/lessons/:slug/complete` (auth) — marks done, awards **+25 XP**, returns `{ completed, xpAwarded, xp }`
- `POST/PATCH/DELETE /learn/lessons` (ADMIN/INSTRUCTOR) — CMS for seeding/managing

**`/api/v1/gamification`** (all auth)
- `GET /gamification/me` → `{ xp, streak, longestStreak, checkedInToday }`
- `POST /gamification/check-in` — idempotent per day; awards **+10 XP** (+2 per streak day, capped); returns `{ checkedInToday, streak, longestStreak, xpAwarded, xp }`
- `GET /gamification/leaderboard?limit&offset` → current week's `Competition` ranked by points, each entry's tier, plus `me` object with rank/tier.

**Streak rule** — consecutive calendar days ending today **or** yesterday (a missed day → reset; yesterday-only still "alive" but needs check-in today).

**Tiers / rankings** — rank bands *inside* the weekly competition: `1-3 → Gold`, `4-10 → Silver`, `else → Bronze` (constant map, easy to tune). Ranking is points-based, real-time via periodic refetch (REST polling every ~30s + pull-to-refresh; WebSockets out of scope unless requested later).

## 3. Tooling steps

- Extend `contract.prisma` → run Prisma migrate (snapshot flow used in this repo) → `contract:emit` to regenerate the ORM client.
- Client `package.json`: add `generate_learn:sdk` + `generate_gamification:sdk` scripts (pointing at `/docs/Learn.json`, `/docs/Gamification.json`), matching the existing generator pattern.
- Seed: a few lessons (text/image/video blocks) + a handful of demo leaderboard users so the UI has data.

## 4. Client UI (new + rewritten screens)

- **Learn tab** (`(tabs)/learn.tsx` rewrite) — hub with: **streak card** (flame icon, day counter, "Check in" button) on top, lessons list, and a leaderboard entry. Uses new `hooks/use-gamification.ts` + `hooks/use-learn.ts`.
- **Check-in**: optimistic local timestamp (stored via existing `expo-secure-store`) written instantly, then `POST /gamification/check-in` to sync; retries on next foreground if it failed.
- **Lesson viewer** (`app/learn/lesson/[slug].tsx`, custom header like `blog/[slug]`) — renders blocks: heading/paragraph text, images (`expo-image`), video via `expo-video` (new dep, supported in Expo Go), "Mark complete" button.
- **Leaderboard** (`app/learn/leaderboard.tsx`) — ranked list, tier badges, pinned "Your position", 30s auto-refresh + pull-to-refresh, tier legend.

## 5. Phases

1. Server schema + migration + client regen
2. Learn module + Gamification module (endpoints, XP & streak logic) + seed
3. Rebuild & restart server, curl smoke tests
4. Client SDK generation + API wrappers + hooks
5. Learn hub + streak card + check-in flow
6. Lesson viewer with text/image/video
7. Leaderboard screen + tiers + auto-refresh
8. Verify: `tsc`, lint baseline, end-to-end check

## Open items

- Exact Prisma migrate command for the contract-first setup (`migrate dev` vs snapshot push).
- `expo-video` add (needed for video blocks; OK under Expo Go).