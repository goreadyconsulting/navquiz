# GOSH Navratri Quiz

This repository is the approved visual and interaction reference for the GOSH Navratri Quiz.

The current repository contains a working frontend prototype for the participant quiz and a working frontend prototype for the admin portal. It deliberately has no production backend, no database, no admin authentication and no external platform dependency.

The IT team should use the existing screens as the required UX and build the production data, authentication and server-side scoring behind them.

## 1. What we are building

GOSH Navratri Quiz is a fast, office-appropriate Bollywood and Indian Navratri culture quiz.

The quiz should feel colorful, vibrant, simple and fast.

Content principles:

- 25 questions in total.
- Mostly Bollywood, Indian film music, Garba, Dandiya, outfits and light Indian pop culture.
- No religious knowledge questions.
- All questions must be suitable for an office audience.
- Four answer choices per question.
- One correct answer per question.
- 7 seconds to answer each question.
- Fastest-fingers scoring. Correct answers score more when submitted faster.
- Users enter an email address before starting.
- One production attempt per email address unless an administrator explicitly resets that participant.
- Quiz runs in fullscreen mode.
- If fullscreen is exited or the tab/app loses visibility, the event should be recorded and the quiz should pause or require the user to return to fullscreen.
- Users see their final score, correct-answer count, average response time and fastest response time at the end.

Target scale: at least 500 concurrent participants.

## 2. Routes

Participant quiz:

https://goreadyconsulting.github.io/navquiz/

Production equivalent should remain the public root route.

Admin portal prototype:

https://goreadyconsulting.github.io/navquiz/admin/

Production admin must be protected by authenticated staff access. There should be no public link from the participant screen to the admin portal.

## 3. Current repository structure

    /
    ├── index.html
    ├── README.md
    ├── admin/
    │   └── index.html
    └── assets/
        ├── gosh-logo.webp
        ├── navratri-quiz-bg.jpg
        ├── quiz.css
        ├── quiz.js
        ├── admin.css
        └── admin.js

Every file currently in the repository is required.

File responsibilities:

- index.html: participant entry, quiz, result and fullscreen-required screens.
- assets/navratri-quiz-bg.jpg: generated festive Garba/Navratri background used across the participant entry, quiz, leaderboard checkpoint and results screens.
- assets/quiz.css: participant visual design and responsive layout.
- assets/quiz.js: current frontend-only question bank, timer, scoring prototype and fullscreen behavior.
- admin/index.html: admin portal layout.
- assets/admin.css: admin visual design and responsive layout.
- assets/admin.js: mock admin data, UI navigation, search, open/close preview and CSV export.
- assets/gosh-logo.webp: GOSH brand asset used by both participant and admin experiences.
- README.md: production handover and build specification.

Do not reintroduce old NAVRANG stage, host, multiplayer-demo or Supabase files. They are not part of this version.

## 4. Important: what is prototype-only today

The participant screen currently runs entirely in the browser.

The following are not production-ready and must be replaced by backend functionality:

- Email is not currently stored.
- One-attempt-per-email is not enforced centrally.
- Questions and correct answers are currently present in assets/quiz.js.
- Timing is currently browser-side.
- Scores are currently calculated browser-side.
- Results are not stored.
- There is no cross-participant leaderboard.
- Fullscreen-exit events are not persisted.
- The admin portal uses mock data.
- Admin open/close controls only affect the local preview.
- Admin authentication does not exist.

The production build must not trust browser-side score, answer correctness, timing or participant identity.

## 5. Participant experience required in production

### Step 1: Entry

Show the existing GOSH Navratri Quiz entry screen.

User enters a valid email address and selects Start Quiz.

Backend must:

1. Normalize the email address.
2. Check whether the quiz is currently open.
3. Check whether that email already has a completed or active attempt.
4. Create a participant/session record.
5. Return a secure session identifier.
6. Allow fullscreen to be requested from the user's Start Quiz click.

If an email has already used its permitted attempt, show a clear message and do not start a second attempt.

### Step 2: Quiz

Show one question at a time.

Requirements:

- 25 questions.
- 7 seconds per question.
- Four answer buttons.
- Answer locks immediately when selected.
- No answer can be changed after submission.
- Timeout counts as no answer and zero points.
- Correct answer is briefly revealed after the answer locks or the timer expires.
- Then advance automatically to the next question.
- Progress indicator shows the current question out of 25.
- Timer is centered above the question.
- Score is shown inside the right-side leaderboard panel, underneath the top-three list.
- A compact live leaderboard sits on the right on desktop, showing the participant's current rank and the current top three.
- After questions 5, 10, 15, 20 and 25, pause the quiz and show a leaderboard checkpoint before continuing.
- The checkpoint must show the participant's current rank, current score and official top three.
- On mobile, the persistent side leaderboard may collapse to protect question space, but the five-question checkpoint must still appear.
- Layout remains centered and responsive.
- Fullscreen state is monitored.

Production must not send the correct answer to the browser before that question has been answered or timed out.

### Step 3: Result

At completion, show:

- Final score.
- Correct answers out of 25.
- Average response time.
- Fastest response time.
- Participant email.

The attempt becomes immutable after completion unless an authorized administrator resets it.

## 6. Scoring rule

Current intended scoring range:

- Wrong answer: 0 points.
- Timeout: 0 points.
- Correct answer: minimum 500 points, maximum 1000 points.
- Faster correct answers receive more points.

Reference formula:

    points = round(500 + 500 × remaining_time_ms / 7000)

Examples:

- Correct almost immediately: approximately 1000 points.
- Correct halfway through the timer: approximately 750 points.
- Correct just before time expires: approximately 500 points.

Production scoring must happen on the server.

Do not accept response time or calculated points sent by the client as authoritative.

Recommended leaderboard order:

1. Final score descending.
2. Average response time ascending as the first tie-breaker.
3. Completion timestamp ascending as the second tie-breaker.

## 7. Server-side timing

For fastest-fingers scoring to be fair, the server must be authoritative.

Recommended approach:

- Server records when each question becomes available to a participant.
- Client submits selected option only.
- Server records receipt time.
- Server calculates response duration and score.
- Network and architecture should be load-tested for at least 500 concurrent users.

Do not calculate the official leaderboard from the device clock.

## 8. Fullscreen and integrity behavior

Browsers cannot completely prevent a user from pressing Escape, changing tabs or switching applications.

The expected behavior is:

- Quiz requests fullscreen when the user starts.
- If fullscreen is exited, pause the local experience behind the existing Full screen required overlay.
- If the document becomes hidden, log an integrity event.
- Require return to fullscreen before continuing.
- Store fullscreen exit / visibility-loss count against the attempt.
- Show that count in the admin participant table.

This is an integrity signal, not a claim of secure proctoring.

## 9. Production data model

The exact database technology is intentionally not prescribed. IT can use the organization's approved stack.

A minimum logical model should include the following.

### Quiz

Fields:

- id
- title
- status: open or closed
- question_duration_ms
- attempt_limit
- created_at
- updated_at

### Question

Fields:

- id
- quiz_id
- display_order
- category
- prompt
- option_a
- option_b
- option_c
- option_d
- correct_option
- active

Correct option must only be available to trusted server/admin code.

### Participant attempt

Fields:

- id
- quiz_id
- email
- status: active, completed, expired, reset
- started_at
- completed_at
- final_score
- correct_count
- average_response_ms
- fastest_response_ms
- fullscreen_exit_count
- created_at

Recommended database constraint: one active/completed attempt per normalized email per quiz unless reset by an administrator.

### Answer

Fields:

- id
- attempt_id
- question_id
- selected_option
- is_correct
- response_ms
- points_awarded
- question_started_at
- submitted_at

### Integrity event

Fields:

- id
- attempt_id
- event_type
- event_timestamp

Examples of event_type:

- fullscreen_exit
- fullscreen_return
- page_hidden
- page_visible

## 10. Backend/API behavior

The endpoint naming can follow IT standards. Required behaviors are more important than exact URLs.

Participant operations required:

- Start attempt using email.
- Fetch the next authorized question without exposing the correct answer.
- Submit one answer for the active question.
- Reject duplicate or late submissions.
- Calculate correctness, response time and score server-side.
- Record timeout.
- Record fullscreen / visibility integrity events.
- Complete the attempt and return final result.

Admin operations required:

- Authenticate administrator.
- Read overview metrics.
- Read live leaderboard.
- Search/filter participant attempts.
- Read individual attempt details.
- Export participant results.
- Read question bank.
- Open or close the quiz.
- Reset a participant attempt when authorized.
- Update permitted quiz settings if IT chooses to make settings editable.

## 11. Admin portal requirements

The visual reference is already available at /admin/.

### Overview

Display live data for:

- Registered participants.
- Completed attempts.
- Completion percentage.
- Average score.
- Top score.
- Recent submissions.
- Average response time.
- Fastest response.
- Fullscreen exit count.
- Live activity.

### Leaderboard

Display:

- Rank.
- Participant email or approved display identity.
- Score.
- Correct answers.
- Average response time.

Leaderboard must use server-stored official scores only.

Participant leaderboard requirements:

- During active questions on desktop, show a compact right-side rank panel with current rank, current score and top three.
- Recalculate/refresh ranking after each submitted answer or timeout.
- Show a dedicated checkpoint leaderboard after every five completed questions: 5, 10, 15, 20 and 25.
- Pause question timing while the checkpoint is visible.
- After the question-25 checkpoint, continue to the participant's final result screen.
- Do not calculate official rank from mock/browser-only competitor data in production.

### Participants

Searchable participant table should include:

- Email.
- Status.
- Score.
- Correct answers.
- Average response time.
- Fastest response.
- Fullscreen exit count.

Recommended production actions:

- View attempt detail.
- Reset attempt.
- Export selected/all rows.

### Questions

Admin should be able to view the complete 25-question bank.

At minimum show:

- Order.
- Category.
- Question.
- Four answer choices.
- Correct answer.
- Timer.

If editing is enabled, changes must be authenticated, validated and audited.

### Quiz settings

Required settings/state:

- Quiz open / closed.
- Question timer: 7 seconds.
- Attempt limit: 1.
- Speed-weighted scoring.
- Fullscreen enforcement enabled.
- Correct-answer reveal enabled.

The visual controls in the current admin prototype are not wired to production data.

## 12. Export requirements

Admin should be able to export results as CSV. XLSX is also desirable.

Minimum export columns:

- email
- attempt_status
- started_at
- completed_at
- final_score
- correct_count
- average_response_ms
- fastest_response_ms
- fullscreen_exit_count

A detailed answer export may additionally include one row per question with selected answer, correctness, response time and awarded points.

## 13. Authentication and security

Participant side:

- Do not expose database credentials or private API keys.
- Do not expose correct answers before submission.
- Validate all request data server-side.
- Rate-limit start and answer endpoints appropriately.
- Use server-generated attempt/session identifiers.
- Prevent answer resubmission and score tampering.

Admin side:

- Admin route must require real authentication.
- Prefer company SSO if available.
- Restrict admin APIs independently of merely hiding the page URL.
- Log sensitive admin actions such as attempt reset, question edits and quiz open/close changes.

Secrets must stay server-side.

## 14. Email and privacy

The quiz collects staff email addresses.

IT should confirm the organization's privacy and retention requirements before launch.

Recommended approach:

- Store only the data required to administer the event.
- Define a retention period.
- Restrict result access to authorized staff.
- Do not expose participant emails publicly unless explicitly approved.

If a public leaderboard is required, use an approved display name or masked identity rather than exposing full email addresses.

## 15. Question content

The current 25 questions in assets/quiz.js are the approved prototype question set.

They are intentionally:

- Mostly Bollywood and film music.
- Mixed with Garba, Dandiya, outfit and cultural questions.
- Non-religious.
- Light and office appropriate.

Before production launch, the content owner should review the final question bank and answers once more.

In production, move question content into the database or a controlled configuration source. Do not keep the correct answers as the production source of truth in public JavaScript.

## 16. Responsive/browser requirements

Participant experience must work well on:

- Modern Chrome.
- Modern Edge.
- Current mobile Chrome.
- Current mobile Safari where fullscreen/browser limitations allow.

Admin portal should be optimized primarily for desktop/laptop but remain usable on tablet/mobile.

If a browser does not support the required fullscreen API, show a clear unsupported-browser message instead of silently running a different experience.

## 17. Performance target

Design and backend should be tested for at least 500 concurrent quiz participants.

Load testing should cover:

- Simultaneous attempt starts.
- Question fetches.
- Bursts of answer submissions near the same moment.
- Leaderboard reads.
- Admin dashboard reads.
- Result completion writes.

Fastest-finger scoring is sensitive to latency, so infrastructure should be hosted close enough to the expected participants and server timing should be used consistently.

## 18. Production acceptance checklist

The build is ready for event use only when all of the following are true:

- GOSH branding matches the participant prototype.
- Admin portal matches the provided admin reference.
- Exactly 25 approved questions are configured.
- Every question is 7 seconds.
- One attempt per email is enforced.
- Official scoring is server-side.
- Correct answers are not exposed before submission.
- Duplicate/late answers are rejected.
- Results persist after refresh/device closure.
- Fullscreen and page-visibility events are recorded.
- Admin authentication is enabled.
- Admin can open/close the quiz.
- Admin can view/search participants.
- Admin can view the official leaderboard.
- Admin can export results.
- Load test passes at 500 concurrent users.
- Participant and admin flows are tested on agreed supported browsers.
- Privacy/retention requirements are confirmed.

## 19. Technology choice

There is intentionally no Supabase dependency in this repository.

IT can implement the production backend using the organization's preferred supported platform, for example an internal web/API stack, Azure services, AWS, Google Cloud or another approved platform.

Please preserve the participant and admin UX unless a technical limitation requires a change.

## 20. Handover summary

Treat the repository as the front-end specification.

Keep:

- Current participant design.
- Current GOSH branding.
- Current 25-question format.
- 7-second timer.
- Speed-weighted scoring behavior.
- Fullscreen-required flow.
- Current admin visual structure.
- Bright, colorful Navratri participant palette using peacock green, saffron, yellow, pink and purple rather than a dark blue quiz theme.
- Generated Garba/Navratri festival background artwork used consistently behind the participant experience with readable translucent UI overlays.
- Right-side participant rank panel and five-question leaderboard checkpoint flow.

Replace:

- Browser-only participant storage.
- Browser-side official scoring.
- Publicly visible correct-answer source.
- Mock admin data.
- Mock participant leaderboard data used only to demonstrate the side rank panel and five-question checkpoints.
- Local-only quiz state.

With:

- Secure backend.
- Persistent database.
- Server-authoritative timing/scoring.
- Secure admin authentication.
- Real-time or frequently refreshed admin data.
- Production export and attempt management.

The final production system should look substantially like this repository while replacing the prototype-only data layer with secure, reliable services.
