# NAVRANG

A static Navratri game concept built for GitHub Pages.

## Current phase

This repository is intentionally **frontend only**.

There is no Supabase, database, authentication or hosted multiplayer dependency in the current build. The purpose of this version is to develop and review the visual identity, animations, round concepts, player experience, stage experience and presenter flow before choosing production infrastructure.

## Screens

- `/` NAVRANG landing experience
- `/play/` mobile player view
- `/stage/` projector view
- `/host/` presenter controls

Default visual game code: `NAV26`

Host preview PIN: `NAVRANG26`

## Local visual sync

For demonstrations, the host, stage and player pages use browser-local state. If the pages are opened in tabs in the same browser and on the same GitHub Pages origin, host actions update the other tabs without a backend.

This is a visual prototype only. Separate phones do not share state yet.

## Nine rounds

1. Shubh Aarambh
2. Rang Pehchano
3. Garba Beats
4. India Celebrates
5. Dandiya Dash
6. Filmy Garba
7. Emoji Garba
8. Team Raas
9. Maha Aarti

The demo includes staged player counts, live-looking answer distributions, individual and team leaderboards, colour-memory sequences, generated drum rhythms, countdowns, animations and finale effects.

## Publishing

GitHub Pages can publish directly from `main` and the repository root.
