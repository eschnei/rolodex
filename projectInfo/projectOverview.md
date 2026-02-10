# NetCard — Product Brief

## Problem

Maintaining meaningful relationships with ~50 key people in your network is hard. Spreadsheets go stale, you forget to follow up, and context from past conversations gets lost. There's no simple tool that keeps you prepared for calls and accountable to your outreach cadence.

## Product

A web-based personal networking CRM that acts as your live cheat sheet during calls and your accountability partner between them. Each contact gets a smart card that accumulates context over time and an automated nudge system that tells you who to reach out to and when.

## Core Experience

**The Contact Card** — a living dossier for each relationship. Structured fields (role, company, location, how you met, personal intel) plus a chronological notes feed. An AI-generated summary sits at the top and updates every time you add notes, giving you a 10-second briefing before any call. Action items are tracked per contact with simple checkboxes.

**Live Note-Taking** — the card is designed to be open during a call, not after. A fast, minimal text input (with optional voice-to-text) lets you capture raw notes in real time. On save, AI parses your notes to extract new details, action items, and updates to the summary. Optional transcript upload as supplemental context.

**The Nudge Engine** — you set a cadence per contact (weekly, biweekly, monthly, quarterly). The system tracks your last touchpoint and sends you a daily email digest of who's due or overdue, with enough context to act immediately. Sent via Gmail API — no additional email infrastructure needed.

## User

Solo operator / founder / networker managing ~50 key relationships across email and text. Web-first with mobile-responsive design for on-the-go use during calls and networking.

## Tech Direction

Open source. Web app with responsive design. Next.js + Supabase + Anthropic API for summarization. Gmail API for both email tracking and digest delivery. Deployable on Vercel.

## What This is Not

This is not a sales CRM, a team tool, or a full-featured contact database. It's a personal relationship tool that prioritizes simplicity and context over features. If it takes more than a few seconds to do anything, it's too complex.

## Success Criteria

- You never walk into a call without context
- You never forget to follow up with someone important
- Adding notes takes less effort than a text message
- The system gets smarter with every interaction, not more work