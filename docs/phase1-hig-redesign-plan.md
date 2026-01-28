# Phase 1 HIG Redesign Plan (iOS + Expo)

## Goals (Phase 1)

- Align UI with Apple HIG: clarity, deference, depth.
- Replace card-heavy layout with grouped list patterns and native controls.
- Keep the app minimal and fast to value (single obvious primary action).
- Prepare navigation and layout structure for Phase 2–4 features without adding them now.
- Reinforce identity/tiny-habit framing, positive micro-feedback, and non-punitive copy.

## Confirmed Decisions

- Add a tab bar now.
- Keep accent neutral (no strong brand tint yet).
- Use SF (system font) instead of custom fonts.
- Keep daily reflection minimal.
- Avoid streak pressure or punitive visuals; use neutral "not yet" states.

## Information Architecture (Phase 1 + future-ready)

### Tabs

- **Today** (default)
- **Review** (weekly review + metrics overview)
- **Settings**

Tab icons (SF Symbols):
- Today: `checkmark.circle.fill` (or `sun.max` if you want a daily vibe)
- Review: `chart.bar.xaxis`
- Settings: `gearshape`

Neutral tint strategy:
- Active tint: `PlatformColor("label")`
- Inactive tint: `PlatformColor("secondaryLabel")`
- Tab bar background: `PlatformColor("systemBackground")`

### Modal Screens

- **Start Sprint** (form sheet)
- **Close Loop** (form sheet)

## Route Structure (Expo Router)

Plan to shift to tabs while preserving a root stack for modals:

```
app/
  _layout.tsx              # Root Stack
  (tabs)/
    _layout.tsx            # Tabs
    today/
      index.tsx
    review/
      index.tsx
    settings/
      index.tsx
  (modals)/
    start-sprint.tsx
    close-loop.tsx
```

Notes:
- Keep tab screens in separate folders to allow stack headers within each tab later.
- Use `presentation: "formSheet"` for modals on iOS.
- `headerLargeTitle: true` for Today and Review.
- `headerLargeTitle: false` for Settings if it feels too heavy.

## Visual System (HIG-aligned)

### Colors

Replace hard-coded colors with semantic iOS colors:

- Background: `PlatformColor("systemGroupedBackground")`
- Section background: `PlatformColor("secondarySystemGroupedBackground")`
- Text: `PlatformColor("label")`
- Secondary text: `PlatformColor("secondaryLabel")`
- Separators: `PlatformColor("separator")`

### Typography

- Remove custom font loading from `app/_layout.tsx`.
- Use default SF (system font) with standard sizes:
  - Title: 28–34 (large title handled by header)
  - Section title: 17 (semibold)
  - Body: 17
  - Secondary: 15
  - Caption: 13
- Use Dynamic Type defaults; avoid fixed scaling logic unless needed later.

### Surfaces + Depth

- Prefer grouped list sections over cards.
- Minimal shadows; rely on iOS grouping for hierarchy.
- Use `borderCurve: "continuous"` on rounded containers only when needed.

## Screen Plans

### Today (Tab)

Primary goal: quick commitment + start sprint.

Layout:
1. **Commitment section**
   - Single text input (placeholder: "What will you finish today?")
   - Helper line ("Smallest meaningful outcome for who you're becoming.")
   - Optional tiny-starter suggestion (e.g., "Start with 1 minute")
2. **Momentum row (non-streak)**
   - "This week: 3/5 completed" or a simple progress bar
   - Neutral "Not yet today" state (no red X)
3. **If‑Then plan preview** (Phase 2 ready)
   - Row with cue / starter / fallback placeholders
   - Tap opens future edit screen (not implemented now)
4. **Sprint actions**
   - Primary button: "Start sprint"
   - Secondary: "Schedule a block" (placeholder for calendar integration)
5. **Next support window** (Phase 4 ready)
   - Compact row with time window + planned support type
6. **Weekly review preview**
   - Single row: "This week" + one metric teaser
7. **Micro-tip (optional)**
   - One-line encouragement or insight shown sparingly (no tips feed)

HIG alignment:
- Use grouped sections with standard row separators.
- Keep a single primary CTA visible without scrolling when possible.
- Provide subtle success feedback (checkmark animation + light haptic).

### Start Sprint (Modal / Form Sheet)

Minimal, focused execution screen.

Layout:
- Commitment summary
- Sprint duration selector (simple segmented control or inline buttons)
- Step list (3–5 items) as a clean list with minimal text
- Rescope options (compact list)
- Primary: Start / Pause
- Secondary: "Finish & reflect"
- Copy emphasizes "start small" and normalizes rescoping

Future ready:
- AI-generated steps + rescope options (Phase 3)
- Haptics on start/pause/finish

### Close Loop (Modal / Form Sheet)

Minimal daily reflection:
- Outcome (segmented control: Yes / Partial / Not yet)
- Blockers (multi-select list with checkmarks)
- One optional text field: "What helped most?"
- One-line suggestion for next day adjustment (read-only for now)
- Supportive copy for misses ("Not yet" vs "failed")

Future ready:
- AI adjustment suggestion (Phase 3)
- Identity evidence capture (Phase 3/4)

### Review (Tab)

Weekly review + metrics summary, list-first.

Layout:
- Metrics rows (initiative completion rate, control, automaticity)
- Barrier pattern summary
- One change for next week
- Identity evidence block

Future ready:
- Expanded metrics and experiment outcomes (Phase 4)
- “Set next week’s initiative” action (Phase 2/3)

### Settings (Tab)

Native grouped list style with footers.

Sections:
- **Data sources** (Calendar, Location, Notifications)
- **Privacy & retention** (static text + future “Delete data”)
- **Experiments** (Micro-randomization toggle + baseline mode placeholder)
- **About** (AI transparency placeholder, prompt version later)

## Component Changes (Phase 1)

### Deprecate or simplify

- `Card` -> replace with “Section” container that mimics grouped list block.
- `ChoicePill` -> replace with segmented control or checkmark list rows.
- Custom fonts -> remove from `app/_layout.tsx`.

### Add lightweight primitives

- `Section` container with optional title + footnote.
- `Row` for list-style items with optional accessory text or chevron.
- `PrimaryButton` and `SecondaryButton` using semantic colors.
- `ProgressRow` for weekly completion/momentum (non-streak).

## Interaction & Accessibility

- Use `Switch` and `SegmentedControl` for native feel.
- Ensure 44pt minimum hit targets.
- Keep `Text` selectable for user data.
- Provide `accessibilityLabel` for inputs and buttons.
- Use subtle haptics for primary actions (start/finish/rescope).
- Use supportive, non-judgmental copy for incomplete states.

## Phase 2–4 Considerations (Reserved Slots)

- Commitment generation row (AI suggestions) on Today.
- If‑then plan preview row to expand into a dedicated editor.
- Calendar “Schedule block” CTA placeholder.
- Decision point row for JITAI notifications.
- Settings sections for baseline mode and experimental toggles.
- Review metrics structure designed to expand with more KPIs.

## Implementation Checklist (when building)

1. Add tab bar route structure under `app/(tabs)` and modals under `app/(modals)`.
2. Update root stack to host tabs and modal presentations.
3. Remove custom font loading from `app/_layout.tsx`.
4. Introduce semantic colors via `PlatformColor`.
5. Refactor Today layout into grouped sections with a single primary CTA.
6. Simplify Close Loop into minimal reflection fields.
7. Update Settings to native grouped list patterns.
8. Replace `Card`/`ChoicePill` usage with new Section/Row primitives.
9. Add a non-streak momentum/progress row and neutral "not yet" state.
10. Add subtle completion feedback (animation + light haptic).

## Open Decisions (Optional)

- Should Review tab be a full “Review” or “Weekly” label in the tab bar?
- Should Start Sprint duration be fixed (10 min) or user-selectable now?
- Keep suggestion chips on Today, or hide behind a “Suggestions” row?
