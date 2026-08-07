# Infinity – Real-Time AI Teaching Platform

Live demo: https://vm-app-eight.vercel.app

Infinity is a Learning Management System (LMS) where students create custom AI tutors ("Allies") and have real-time voice conversations with them on any topic. Built as a portfolio project to explore how AI voice agents, subscription billing, and modern full-stack tooling fit together in a real product.

## Features

- **Real-time AI voice tutoring** — pick a subject, topic, voice, and teaching style, then have a live spoken conversation with your ally, powered by Vapi. Sessions are time-boxed to the duration you configure.
- **Ally library** — browse, search, and filter allies by subject.
- **Authentication** — sign-in/sign-up via Clerk.
- **Subscription billing** — Free / Core Student / Proactive Learner plans via Clerk Billing (Stripe), with real plan-based limits enforced on how many allies a user can create.
- **Persistent data** — allies are stored in Supabase (Postgres) with row-level access tied to the signed-in user.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Server Actions)
- **Auth & Billing:** Clerk
- **Database:** Supabase (Postgres)
- **Voice AI:** Vapi
- **UI:** Tailwind CSS v4, Radix UI / shadcn components, React Hook Form + Zod
- **Deployment:** Vercel

## Status

This is a working, deployed project, not a finished commercial product. It's currently running on Vercel's free tier without a custom domain, so Clerk stays on a development instance (production instances require domain verification). Known gaps:

- The "My Journey" profile page is a placeholder — no session history or account dashboard yet.
- The bookmark button on ally cards is visual only; bookmarking isn't wired up yet.
- No rate limiting on session creation.

## Getting Started

```bash
npm install
npm run dev
```

You'll need your own API keys for Clerk, Supabase, and Vapi in a `.env.local` file:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
NEXT_PUBLIC_VAPI_WEB_TOKEN=
```
