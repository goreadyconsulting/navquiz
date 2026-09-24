# NAVRANG

A large-audience Navratri game designed for an office event.

## Experiences

- `/` event landing page
- `/play/` mobile player controller
- `/stage/` projector and big-screen experience
- `/host/` presenter control room

Default game code: `NAV26`

## Game format

NAVRANG has nine themed rounds:

1. Shubh Aarambh
2. Rang Pehchano
3. Garba Beats
4. India Celebrates
5. Dandiya Dash
6. Filmy Garba
7. Emoji Garba
8. Team Raas
9. Maha Aarti

Players are never eliminated. Scores combine accuracy, response speed and streak bonuses. Five colour teams compete alongside the individual leaderboard.

## Large audience architecture

The phone clients deliberately do not hold a permanent Realtime WebSocket connection. They use short state polls and REST answer submissions through a Supabase Edge Function. This avoids making the audience size depend on the project's concurrent Realtime connection quota.

The database uses isolated `nav_*` tables with RLS enabled. The public frontend cannot query those tables directly. Player and host traffic goes through `navquiz-api`, while atomic scoring is handled by a database function restricted to the service role.

## Host

Open `/host/?code=NAV26`.

The presenter can:

- start the game
- open each question
- reveal answers
- show round results
- show the live leaderboard
- move to the next round
- finish the event
- reset all players and scores

Keyboard shortcuts:

- Space: next question
- R: reveal
- B: leaderboard

## Stage

Open `/stage/?code=NAV26` on the projector and select **Start Stage** once. This unlocks fullscreen and browser audio for the Garba Beats round.

## Backend

Supabase project: `ganesha-idol-voting-2026`

Edge function source is versioned in:

`supabase/functions/navquiz-api/index.ts`

The NAVRANG tables are prefixed with `nav_` so they remain separate from the existing Ganesha voting application.

## GitHub Pages

Publish from `main` and the repository root.
