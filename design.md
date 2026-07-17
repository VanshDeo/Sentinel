# Sentinel UI/UX Layout Specification & Design Documentation

## 1. Global Design Language

- **Background:** Near-black (`#0A0A0B`), never pure black (`#000000`). This preserves visual depth in dark mode and allows frosted containers to stand out.
- **Primary Accent:** Periwinkle/Indigo (`#8B8FE8`) used as the single primary accent color. Used selectively for border outlines, highlighting key statuses, active links, and buttons.
- **Accompanying Accent:** Soft Indigo glow (`#6C6FE0`) used for radial background gradients.
- **Base Typography Color:** Warm off-white (`#F5F5F7`).
- **Typography Stack:**
  - **Technical / Display Headings:** `Sector` display font (uppercase letters, wide character tracking).
  - **Body Text:** Standard highly readable system sans-serif or clean monospaced font. Avoid display typography for paragraph text to ensure legibility.
- **Grid:** 12-column layout with generous negative space. Max container width capped at `1280px`.

---

## 2. Motion System (Framer Motion)

The Sentinel motion system is **precise, mechanical, and deliberate** (300ms–600ms transitions). Playful, bouncy spring physics are avoided in favor of clean transitions that emphasize cryptographic rigor.

### Key Motion Components

1. **Letter-Stagger Wordmark Reveal:**
   - Used on the Landing Page Hero.
   - Leverages `staggerChildren` to fade in and slide up display headings letter-by-letter.

2. **Scramble-to-Clear Decrypt Effect (`ScrambleText`):**
   - Cycles random alphanumeric characters before resolving to the true string.
   - Serves as the primary visual indicator of cryptographic decryption.

3. **Draw-on-Scroll SVG Connectors:**
   - SVG paths where `strokeDashoffset` is animated dynamically based on the viewport scroll progress.
   - Visually connects step sequences (e.g., *Propose* → *Check* → *Settle*).

4. **Global Lock / Decryption Toggle:**
   - Managed globally via `DashboardContext`.
   - When the user toggles the Status Pill or successfully reconstructs 2-of-3 Shamir key shares in the Audit view, the entire platform triggers a decrypt scramble transition to reveal masked amounts, hashes, and detailed logs.

---

## 3. Application Structures

### 1. Landing Page
- **Hero:** Animating logo mark, stagger-typed emotional serif line **"Privacy that isn't secrecy."**, dual call-to-actions, and drifting background circuit meshes.
- **The Contrast (Problem Section):** 50/50 split viewport.
  - *Left:* Scrambled, glitchy values representing public block telemetry.
  - *Right:* Clean decrypted records highlighting Sentinel's private validation.
- **How It Works:** Row of Glow Cards linked together by a scroll-drawn SVG connector line.
- **Footer:** Minimal layout backed by a large, faint (20% opacity) watermark S-shard logo mark, accompanied by eERC/Avalanche subnet badges.

### 2. Dashboard
- **Fixed Sidebar Navigation:** Mapped to Overview, Transactions, Policies, Treasury, Audit, Members, and Settings. Styled in `text-xs uppercase tracking-widest`.
- **Top Status Bar:** Houses the Fuji network badge and the interactive Lock/Unlock status pill.
- **Overview Page:** Features 4 primary KPI cards utilizing live text scramble indicators, an Attention Center for urgent validation items, and inline SVGs depicting flows, operating spend, rejections, and settlement latency.

### 3. Docs Page
- Centered 2-column layout.
- Sticky navigation table of contents tracking section offsets using a scroll-spy `IntersectionObserver`.
- Fast, clean, non-obtrusive page transitions with dark code snippets syntax-highlighted in theme colors.
