# Phase 1-2 UX Simplification Recommendations

## Guiding principles (HIG + research)
- **Clarity:** one primary action per screen; remove placeholders and duplicate navigation.
- **Deference:** content (today's focus) leads, UI recedes; avoid dense stacks of sections.
- **Depth:** progressive disclosure for advanced controls (plans, retention, experiments).
- **Agency research:** tiny-habit starts, simple self-monitoring, supportive feedback, non-punitive tone.

## Simplified core loop (60-second value)
1. Set today's focus (single input).
2. Start a 10-minute focus session.
3. Log outcome with one tap.

## Screen simplifications

### Today
- Reduce to 3 blocks: **Today's focus**, **Start focus session**, **This week** micro-progress.
- Collapse "Tiny starter" + "Current focus" into one helper line; show starter only after typing.
- Hide **If-then plan**, **Next support window**, and **Schedule block** until user opts into planning.
- Remove "Review" row (already in tab bar); avoid duplicate paths.

### Start Sprint (Focus session)
- Default to 10 minutes with a single Start button; place duration chooser behind "Change".
- Hide steps + rescopes until user taps **Need help** or **Rescope**.
- Keep one primary action; show "End & reflect" only after session begins.

### Close Loop (Reflect)
- First view: **Yes / Partial / Not yet** + Save.
- If Partial/Not yet, reveal blockers; show optional note only after blockers.
- Move "Next day adjustment" to post-save confirmation or Review.

### Review
- If data is sparse, show a simple empty state + CTA (e.g., "Log 3 reflections to unlock trends").
- Limit to 2-3 metrics; keep "barrier pattern" and "identity evidence" behind **Details**.
- Prefer plain-language labels (e.g., "Completion rate") over "perceived control/automaticity".

### Settings (Phase 2)
- Replace multi-field Data Source cards with simple **Connections** rows; each opens a detail screen.
- Ask for permissions just-in-time (when scheduling a block, enabling reminders, etc.).
- Move **retention**, **experiments**, and **prompt version** into **Advanced**.
- Avoid "Coming soon" rows on primary screen; keep a single "Planned features" link.

## Language and feedback
- Rename to plain language: "Commitment" -> "Today's focus", "Close loop" -> "Reflect", "Sprint" -> "Focus session".
- Keep identity framing subtle in helper text; avoid jargon.
- Use small, positive feedback (haptic + subtle check) and neutral "Not yet" states.

## De-scope / hide until needed
- If-then plan preview
- Next support window
- Schedule block CTA (until Calendar is enabled explicitly)
- Experiments, prompt version, retention picker
- Extra metrics beyond completion rate
