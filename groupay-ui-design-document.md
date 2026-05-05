# GrouPay — UI Design Document
**Version 1.0 | April 2026**

---

## 1. Product Overview

**GrouPay** is a collaborative finance web application that enables users to split bills, pool funds, and contribute toward shared financial goals. Whether splitting a restaurant bill among friends, collecting rent contributions from housemates, or crowdfunding a group gift, GrouPay makes shared spending transparent, fair, and frictionless.

### 1.1 Target Users
- Friend groups managing shared expenses (trips, dining, events)
- Housemates splitting recurring bills
- Teams or clubs collecting dues or pooling funds
- Families coordinating shared purchases or savings goals

### 1.2 Core Use Cases
1. **Bill Splitting** — divide an expense equally or by custom amounts among named participants
2. **Group Goals** — create a savings/contribution target that multiple users contribute toward over time
3. **Payment Tracking** — log who has paid, who owes, and send reminders
4. **Settlement** — calculate net balances and suggest the minimum number of transfers to settle up

---

## 2. Design Principles

| Principle | Description |
|---|---|
| **Clarity first** | Financial information must be scannable and unambiguous at a glance |
| **Trust through transparency** | Every transaction and contribution is visibly logged |
| **Low friction** | Core actions (add expense, invite member, mark paid) require as few taps as possible |
| **Inclusive** | Accessible colour contrasts, keyboard-navigable, screen-reader friendly |
| **Playful but professional** | Friendly tone and energetic palette; still serious enough for money matters |

---

## 3. Colour Palette

| Name | Hex | Role |
|---|---|---|
| **Growth Green** | `#49c635` | Primary CTA buttons, success states, active nav indicators |
| **Aqua Blue** | `#54defd` | Highlights, badges, interactive hover states, links |
| **Warm White** | `#fffbfa` | Global background, card surfaces, modal backgrounds |
| **Teal** | `#00bd9d` | Secondary actions, progress bars, goal completion indicators |
| **Mist** | `#8bd7d2` | Disabled states, placeholder text backgrounds, dividers, subtle fills |

### 3.1 Colour Usage Rules
- **Primary actions** (Pay Now, Create Group, Split Bill) → Growth Green `#49c635`
- **Secondary actions** (Invite, View Details, Edit) → Teal `#00bd9d`
- **Informational chips and badges** → Aqua Blue `#54defd`
- **Background surfaces** → Warm White `#fffbfa`
- **Muted/inactive elements** → Mist `#8bd7d2`
- **Body text** → `#1a1a1a` (near-black for maximum readability on Warm White)
- **Heading text** → `#0d2b1f` (deep forest, complements the greens)
- **Error states** → `#e5373a` (red; used sparingly, not part of brand palette)

---

## 4. Typography

### 4.1 Typefaces
- **Display / Headings:** *Sora* (Google Fonts) — geometric, friendly, modern
- **Body / UI:** *Inter* (Google Fonts) — highly legible at small sizes, excellent for tabular data

### 4.2 Type Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| `display-xl` | 56px / 3.5rem | 700 | Hero headline |
| `display-lg` | 40px / 2.5rem | 700 | Page titles |
| `heading-md` | 28px / 1.75rem | 600 | Section headings |
| `heading-sm` | 20px / 1.25rem | 600 | Card headings, modal titles |
| `body-lg` | 16px / 1rem | 400 | Primary body copy |
| `body-sm` | 14px / 0.875rem | 400 | Supporting text, captions |
| `label` | 12px / 0.75rem | 500 | Form labels, tags, badges |
| `mono` | 14px / 0.875rem | 400 (monospace) | Currency amounts, transaction IDs |

---

## 5. Iconography & Imagery

- **Icon Library:** Phosphor Icons (rounded style) — consistent weight, friendly curves
- **Key icons used:** Split (fork), Wallet, Users, Bell, CheckCircle, Clock, ArrowsLeftRight, PiggyBank, ChartBar
- **Imagery style:** Flat, colourful illustrations using brand palette; abstract shapes (no stock photography of money/credit cards)
- **Avatar system:** Generated circular avatars using initials on tinted Mist background; optional photo upload

---

## 6. Spacing & Layout

- **Base unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96px
- **Grid:** 12-column grid, 24px gutter, max content width 1280px
- **Border radius:** 8px (inputs, chips), 12px (cards), 20px (modals), 9999px (pills/tags)
- **Shadows:** Subtle — `0 2px 8px rgba(0,0,0,0.07)` for cards; `0 8px 32px rgba(0,0,0,0.12)` for modals

---

## 7. Component Library

### 7.1 Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `#49c635` | `#fffbfa` | None | Main CTAs |
| Secondary | `#00bd9d` | `#fffbfa` | None | Secondary actions |
| Ghost | Transparent | `#49c635` | 1.5px `#49c635` | Tertiary / cancel |
| Destructive | `#e5373a` | `#fffbfa` | None | Delete / remove |
| Disabled | `#8bd7d2` | `#fffbfa` | None | Inactive state |

All buttons: height 44px (desktop), 48px (mobile); border-radius 9999px; font `label` 500.

### 7.2 Form Inputs
- Height: 48px
- Border: 1.5px solid `#8bd7d2`
- Focus border: `#49c635`
- Background: `#fffbfa`
- Label: `label` token, colour `#0d2b1f`
- Error state: border `#e5373a`, helper text in red below field
- Currency inputs: monospaced amount, currency symbol prefix in Mist

### 7.3 Cards
- Background: `#fffbfa`
- Border: 1px solid `rgba(139,215,210,0.4)`
- Border-radius: 12px
- Shadow: `0 2px 8px rgba(0,0,0,0.07)`
- Padding: 24px

**Card types:**
- **Expense Card** — amount (large mono), description, participants row, date, status chip
- **Group Card** — group name, member avatars, balance summary, quick-action buttons
- **Goal Card** — goal name, progress bar (Teal fill), amount raised vs target, contributor count

### 7.4 Progress Bar
- Height: 10px
- Track: `#8bd7d2` (Mist)
- Fill: `#00bd9d` (Teal) transitioning to `#49c635` (Growth Green) at 100%
- Border-radius: 9999px

### 7.5 Status Chips / Badges

| Status | Background | Text |
|---|---|---|
| Paid | `#49c635` at 15% | `#1a6b0e` |
| Pending | `#54defd` at 20% | `#006e8a` |
| Overdue | `#e5373a` at 12% | `#9e1215` |
| Partial | `#00bd9d` at 15% | `#005f50` |

### 7.6 Navigation (Sidebar — Authenticated)
- Width: 240px (desktop), collapses to icon-only 64px (tablet), bottom tab bar (mobile)
- Background: `#0d2b1f` (deep forest)
- Active item: Growth Green left border + text `#49c635`
- Inactive item: text `#8bd7d2`
- Logo at top; user avatar + name at bottom

### 7.7 Modals
- Max-width: 520px
- Background: `#fffbfa`
- Backdrop: `rgba(13,43,31,0.5)`
- Border-radius: 20px
- Header: heading-sm, close icon top-right

---

## 8. Page & Screen Inventory

### 8.1 Public Pages
| Page | Path | Purpose |
|---|---|---|
| Landing | `/` | Marketing, value proposition, CTA to sign up |
| Sign Up | `/signup` | New account creation |
| Log In | `/login` | Returning user authentication |
| How It Works | `/how-it-works` | Feature walkthrough |

### 8.2 Authenticated App Pages
| Page | Path | Purpose |
|---|---|---|
| Dashboard | `/dashboard` | Overview of balances, recent activity, quick actions |
| Groups | `/groups` | List of all groups; create new group |
| Group Detail | `/groups/:id` | Members, expenses, settlement view for one group |
| Add Expense | `/groups/:id/add-expense` | Form to log a new bill/expense |
| Goals | `/goals` | All funding goals; create new goal |
| Goal Detail | `/goals/:id` | Contributors, progress, history for one goal |
| Payments / Settle Up | `/settle` | Payment requests and settlement suggestions |
| Notifications | `/notifications` | Activity feed, reminders, payment confirmations |
| Profile & Settings | `/settings` | Account info, payment methods, preferences |

---

## 9. Key User Flows

### 9.1 Create & Split a Bill
1. User taps **+ Add Expense** from Group Detail or Dashboard
2. Enters: description, total amount, currency, date, optional receipt photo
3. Selects split method: **Equal**, **Custom %**, **Custom amounts**, **By shares**
4. Assigns participants from group members (pre-populated)
5. Reviews split breakdown (live updating)
6. Confirms → expense card appears in group feed; all participants notified

### 9.2 Create a Group Goal
1. User taps **New Goal**
2. Enters: goal name, target amount, deadline (optional), description
3. Invites contributors (from contacts or by link/email)
4. Goal card created with 0% progress bar
5. Contributors open link → see goal → tap **Contribute** → enter amount → confirm
6. Progress bar updates in real time

### 9.3 Settle Up
1. User navigates to **Settle Up** from group
2. App calculates net balances using debt-simplification algorithm
3. Displays minimum-transfer suggestions: "Alex pays Jordan ₦4,500"
4. User taps **Mark as Paid** (manual) or **Pay Now** (integrated payment)
5. Balance resets; confirmation sent to payee

---

## 10. Responsive Behaviour

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column; bottom nav; stacked cards |
| Tablet | 640–1024px | Sidebar collapses to icons; 2-column grids |
| Desktop | > 1024px | Full sidebar 240px; 3-column dashboard grid |

---

## 11. Accessibility

- Minimum contrast ratio: 4.5:1 for all text (WCAG AA)
- Focus rings: 2px offset, `#49c635` colour
- All interactive elements keyboard-navigable (Tab / Enter / Space / Escape)
- ARIA labels on icon-only buttons
- Colour is never the sole indicator of status (always paired with icon or text)
- Motion: respects `prefers-reduced-motion` — all transitions disabled for users who prefer it

---

## 12. Micro-interactions & Animations

| Trigger | Animation | Duration |
|---|---|---|
| Button hover | Scale 1.02 + slight shadow lift | 150ms ease |
| Card hover | Border colour shifts to Aqua Blue `#54defd` | 200ms ease |
| Modal open | Fade in + scale from 0.95 | 200ms ease-out |
| Progress bar fill | Width eases in on mount | 600ms ease-out |
| Success state | Checkmark draw + green pulse | 400ms |
| Expense added | Card slides in from bottom | 300ms ease-out |
| Notification bell | Wobble on new notification | 500ms |

---

## 13. Empty States

Each major section has a friendly illustrated empty state:

- **No groups yet:** Illustration of people around a table. CTA: "Create your first group"
- **No expenses:** Illustration of an empty wallet. CTA: "Add your first expense"
- **No goals:** Illustration of a piggy bank. CTA: "Set a new goal"
- **All settled up:** Illustration of a handshake. Text: "You're all square! 🎉"

---

## 14. Error & Loading States

- **Loading:** Skeleton screens (Mist-coloured pulse placeholders) — no spinners
- **Network error:** Toast notification bottom-centre, red background, retry button
- **Form validation:** Inline errors below each field on blur; summary at top of form on submit attempt
- **Empty search:** "No results for '...'" with suggestion to check spelling or invite via link

----

## 15. Onboarding Flow

1. **Welcome screen** — animated logo + tagline
2. **Create account** — name, email, password (or OAuth: Google / Apple)
3. **Profile setup** — display name, avatar, preferred currency
4. **First action prompt** — "Create a group" or "Join via invite link" or "Explore demo"
5. **Tooltips** — contextual coach marks on first visit to Dashboard (dismissible)

---

*Document prepared for GrouPay v1.0 design & development handoff.*
*Maintained by the GrouPay Design System team.*
