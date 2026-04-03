# Logo Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic Lucide Link icon with a custom EasyLaces clip+laces logo across favicon, header, and footer.

**Architecture:** Create a reusable `Logo` SVG component with a `size` prop, then swap it into the three locations where the old icon appears (favicon, Header, Footer). Remove the unused `Link` import from lucide-react.

**Tech Stack:** React, Next.js, SVG inline, TypeScript

---

### Task 1: Create the Logo component

**Files:**
- Create: `components/Logo.tsx`

- [ ] **Step 1: Create `components/Logo.tsx`**

```tsx
interface LogoProps {
  size?: number;
  bgColor?: string;
  className?: string;
}

export default function Logo({ size = 36, bgColor = "#2563EB", className }: LogoProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: size > 32 ? 4 : Math.round(size * 0.25),
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 140 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "78%", height: "auto" }}
      >
        {/* Lacci sinistri */}
        <line x1="6" y1="16" x2="32" y2="16" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="6" y1="40" x2="32" y2="40" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        {/* Clip */}
        <rect x="32" y="8" width="76" height="40" rx="3.5" fill="white" />
        {/* Fessure */}
        <rect x="41" y="14" width="20" height="28" rx="2.5" fill={bgColor} />
        <rect x="79" y="14" width="20" height="28" rx="2.5" fill={bgColor} />
        {/* Lacci destri */}
        <line x1="108" y1="16" x2="134" y2="16" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="108" y1="40" x2="134" y2="40" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Verify the component renders**

Run: `npx next build` or check in browser at localhost:3000
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add components/Logo.tsx
git commit -m "feat: add reusable Logo component with clip+laces SVG"
```

---

### Task 2: Update Header to use new Logo

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Replace the Link icon import and logo markup in `components/Header.tsx`**

Remove the `Link as LinkIcon` from the lucide-react import:

```tsx
// BEFORE
import { Menu, X, Link as LinkIcon } from "lucide-react";

// AFTER
import { Menu, X } from "lucide-react";
```

Add the Logo import:

```tsx
import Logo from "./Logo";
```

Replace the logo div (lines 53-56):

```tsx
// BEFORE
<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
  <LinkIcon className="h-4 w-4 text-white" />
</div>

// AFTER
<Logo size={32} />
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev` and open http://localhost:3000
Expected: New clip+laces logo appears in the header, no visual regressions

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: replace generic Link icon with EasyLaces logo in header"
```

---

### Task 3: Update Footer to use new Logo

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Replace the Link icon import and logo markup in `components/Footer.tsx`**

Remove the `Link as LinkIcon` from the lucide-react import:

```tsx
// BEFORE
import { Link as LinkIcon, Instagram, Facebook } from "lucide-react";

// AFTER
import { Instagram, Facebook } from "lucide-react";
```

Add the Logo import:

```tsx
import Logo from "./Logo";
```

Replace the logo div (lines 26-28):

```tsx
// BEFORE
<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
  <LinkIcon className="h-4 w-4 text-white" />
</div>

// AFTER
<Logo size={32} />
```

- [ ] **Step 2: Verify in browser**

Run: Check http://localhost:3000 and scroll to footer
Expected: New clip+laces logo appears in the footer, matching the header

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: replace generic Link icon with EasyLaces logo in footer"
```

---

### Task 4: Update favicon

**Files:**
- Modify: `app/icon.svg`

- [ ] **Step 1: Replace the content of `app/icon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#2563EB"/>
  <svg x="3" y="9" width="26" height="14" viewBox="0 0 140 56" fill="none">
    <line x1="6" y1="16" x2="32" y2="16" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
    <line x1="6" y1="40" x2="32" y2="40" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
    <rect x="32" y="8" width="76" height="40" rx="3.5" fill="white"/>
    <rect x="41" y="14" width="20" height="28" rx="2.5" fill="#2563EB"/>
    <rect x="79" y="14" width="20" height="28" rx="2.5" fill="#2563EB"/>
    <line x1="108" y1="16" x2="134" y2="16" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
    <line x1="108" y1="40" x2="134" y2="40" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
  </svg>
</svg>
```

- [ ] **Step 2: Verify favicon**

Run: Hard refresh http://localhost:3000 (Cmd+Shift+R)
Expected: New clip+laces favicon visible in the browser tab

- [ ] **Step 3: Commit**

```bash
git add app/icon.svg
git commit -m "feat: update favicon with new EasyLaces clip+laces logo"
```

---

### Task 5: Final verification

- [ ] **Step 1: Run build to ensure no errors**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Visual check all three locations**

1. Header — logo at top left with "EasyLaces" text
2. Footer — logo matching header style
3. Browser tab — favicon shows clip+laces icon

- [ ] **Step 3: Final commit if any fixes needed**

If all good, no commit needed. The feature is complete.
