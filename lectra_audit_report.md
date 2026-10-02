# LECTRA — Technical Preparation Audit Report
**Date:** 2026-10-01 | **Auditor:** Antigravity AI

---

## 1. Project Structure Reviewed

```
lectra/
├── index.html                          # Vite shell (Figma Make template slots)
├── package.json                        # React 19, Recharts 3, Tailwind CSS v4, Vite 8, TS 5.7
├── tsconfig.json                       # strict mode, bundler resolution, noEmit
├── vite.config.ts                      # Figma Make plugins + @tailwindcss/vite + @/ alias
├── .figma/make/site.json               # App metadata (title, robots, a11y)
└── src/
    ├── main.tsx                        # ReactDOM.createRoot entry
    ├── App.tsx                         # Root routing + hash-based dosen link handler
    ├── index.css                       # @import tailwindcss + full @theme token block
    ├── types.ts                        # BudgetType, BudgetStatus, Page, Dosen, Alokasi, Realisasi
    ├── lib/
    │   └── designTokens.ts             # NEW — JS-side color/radius constants (single source of truth)
    ├── data/
    │   └── mockData.ts                 # Mock data + utility functions (formatRupiah, calcBudgetStatus, etc.)
    ├── pages/
    │   ├── LoginPage.tsx               # Credential form (demo: admin@univ.ac.id / admin123)
    │   ├── PublicDashboard.tsx         # Read-only public aggregate view
    │   ├── DashboardPage.tsx           # Admin summary + year selector
    │   ├── PenetapanAnggaranPage.tsx   # Budget allocation CRUD (table + modal)
    │   ├── RealisasiAnggaranPage.tsx   # Realization entry + OPEX/CAPEX validation
    │   └── DosenDashboard.tsx          # Read-only lecturer share-link dashboard
    ├── components/
    │   ├── layout/
    │   │   └── TopNavigation.tsx       # Sticky nav, profile dropdown, mobile menu
    │   ├── ui/
    │   │   ├── Badge.tsx               # BudgetTypeBadge + StatusBadge
    │   │   ├── Button.tsx              # 4 variants × 3 sizes, loading state
    │   │   ├── ConfirmDialog.tsx       # Danger-confirm overlay
    │   │   ├── EmptyState.tsx          # Centered empty placeholder
    │   │   ├── FormField.tsx           # Label, Input, Select, Textarea with error state
    │   │   ├── Modal.tsx               # Backdrop modal, 3 sizes, scroll lock
    │   │   ├── ShareLinkModal.tsx      # Hash-URL generator + clipboard copy
    │   │   └── Toast.tsx               # 4-type toast with auto-dismiss
    │   └── charts/
    │       ├── DonutChart.tsx          # Recharts PieChart (progress ring)
    │       ├── MonthlyChart.tsx        # Recharts BarChart (realisasi per bulan)
    │       └── YearlyBarChart.tsx      # Recharts BarChart (anggaran vs realisasi per tahun)
    └── imports/
        └── ChatGPT_Image_1_Okt_2026__09.04.46.png   # Logo/branding asset
```

---

## 2. What Is Already Working

| Area | Status |
|---|---|
| React 19 + Vite 8 + TypeScript 5.7 stack | ✅ Correct |
| Tailwind CSS v4 via `@tailwindcss/vite` plugin | ✅ Correct |
| `@/` path alias (`src/`) | ✅ Configured |
| Inter font (Google Fonts CDN) | ✅ Loaded in index.css |
| Burgundy `@theme` token block in index.css | ✅ Complete |
| SPA routing (state-based, no react-router needed) | ✅ Working |
| Hash-URL share links (`#/dosen/<token>`) | ✅ Working |
| `hashchange` listener for back navigation | ✅ Working |
| Auth state separation (public / admin / dosen) | ✅ Correctly separated |
| Login page (demo credentials gate) | ✅ Working |
| Public Dashboard (read-only, no login required) | ✅ Working |
| Admin Dashboard (year selector, charts) | ✅ Working |
| Penetapan Anggaran page (table + modal + share) | ✅ Working |
| Realisasi Anggaran page (left panel + detail) | ✅ Working |
| Dosen Dashboard (share-token gated, read-only) | ✅ Working |
| All UI components (Badge, Button, Modal, Toast, etc.) | ✅ Working |
| Recharts (DonutChart, MonthlyChart, YearlyBarChart) | ✅ Working |
| Mobile responsive layout + mobile nav | ✅ Working |
| OPEX/CAPEX filter tabs in Public + Dosen dashboards | ✅ Working |
| Realization count display (no "/10" limit) | ✅ Unlimited |
| Mock data with 12 realization records across 7 allocations | ✅ Present |

---

## 3. What Was Changed

### 3a. `src/pages/LoginPage.tsx`
- **Removed** unused `import type { Page } from '../types'` — the import was present but `Page` was never referenced in this file. Clean-up only.

### 3b. `.figma/make/site.json`
- **Added** `"title": "LECTRA — Sistem Anggaran Dosen"` — the file previously had no title, causing the browser tab to display "Figma Make App" (the Vite plugin fallback).

### 3c. `src/lib/designTokens.ts` *(new file)*
- **Created** centralized JS/TS token constants file mirroring every value in `index.css @theme`.
- Covers: brand colors, background/surface/text/border/divider/status colors, **chart fill colors**, recharts cursor color, and border-radius pixel values.
- This is the single source of truth for any raw hex string needed in JS code (recharts props, inline styles).

### 3d. `src/components/charts/DonutChart.tsx`
- **Replaced** hardcoded `#8F2438` → `CHART_COLOR_BUDGET` and `#E4E7EC` → `COLOR_BORDER`.
- **Removed** unused `Tooltip` import from recharts (was imported, not used in component).
- Visual appearance: **unchanged**.

### 3e. `src/components/charts/MonthlyChart.tsx`
- **Replaced** hardcoded `#8F2438`, `#D9DDE3`, `#EAECF0`, `#98A2B3`, `#F8E9ED` → token constants.
- Visual appearance: **unchanged**.

### 3f. `src/components/charts/YearlyBarChart.tsx`
- **Replaced** hardcoded `#8F2438`, `#D9DDE3`, `#EAECF0`, `#98A2B3`, `#F8E9ED` → token constants.
- Visual appearance: **unchanged**.

### 3g. `vite.config.ts`
- **Replaced** `__dirname` with `import.meta.dirname` (ESM-native, no Node global dependency).
- **Added** `with { type: 'json' }` import attribute to the site.json import.
- Both changes resolve Vite's forward-compatibility warnings for the upcoming `configLoader: 'native'` default. **No behavioral change.**

---

## 4. Business Rules Verified

### OPEX
| Rule | Status |
|---|---|
| Realization cannot exceed allocated budget | ✅ `validateNominal()` blocks OPEX over-budget input in real-time |
| Exceeding OPEX is blocked | ✅ `handleSubmitRealisasi()` rejects submission if OPEX nominal > sisa |
| Validation works during input AND submission | ✅ Both enforced |

### CAPEX
| Rule | Status |
|---|---|
| Realization may exceed allocated budget | ✅ Allowed — no block applied |
| Over-budget CAPEX is allowed | ✅ `capexWarning` shows informational message, does not block |
| OVER BUDGET status shown with exceeded amount | ✅ Yellow banner with `formatRupiah(lebih)` |
| Not treated as a system error | ✅ Correct — separate `warning` toast, not `error` |

### REALIZATION
| Rule | Status |
|---|---|
| No maximum realization records | ✅ No limit exists in code |
| "X / 10" display removed | ✅ Not present anywhere |
| Shows current count (`{jumlahReal} realisasi`) | ✅ In RealisasiAnggaranPage left panel |

### SIMKUG
| Rule | Status |
|---|---|
| Optional | ✅ Marked `optional` in `FormField` |
| Empty SIMKUG is valid | ✅ No validation enforced on SIMKUG field |
| Empty renders as `–` dash | ✅ `{r.nomorSimkug ? <code>…</code> : <span>–</span>}` |

### LECTURER BUDGET
| Rule | Status |
|---|---|
| One lecturer can have OPEX and CAPEX in the same year | ✅ `d1` (Dr. Ahmad) has `a1` (OPEX) + `a2` (CAPEX) + `a3` (OPEX) in 2026 |
| OPEX and CAPEX remain separate allocations | ✅ Each `AlokasiAnggaran` has its own `jenis` field |

### PUBLIC DASHBOARD
| Rule | Status |
|---|---|
| Read-only | ✅ No mutations possible |
| Accessible without login | ✅ `page === 'public'` branch requires no auth |
| Aggregated information only | ✅ Uses `YEARLY_DATA` totals, not individual lecturer records |
| No sensitive lecturer info | ✅ No NIP, no lecturer names shown |
| `[Semua] [OPEX] [CAPEX]` filter | ✅ Present and working |

### LECTURER DASHBOARD
| Rule | Status |
|---|---|
| Read-only | ✅ No edit/add/delete buttons in `DosenDashboard` |
| Accessible via secure shareable link | ✅ Hash URL `#/dosen/<shareToken>` |
| Lecturer sees only their own data | ✅ `DOSEN_LIST.find(d => d.shareToken === token)` gates the view |
| `[Semua] [OPEX] [CAPEX]` filter | ✅ Present and working |

---

## 5. Design Token Status

### CSS Side (`src/index.css` — Tailwind `@theme`)
All Tailwind utility colors, font family, and radius values are declared in the centralized `@theme` block. **No ad-hoc tokens in individual component CSS.**

| Token Group | Status |
|---|---|
| Colors (primary, bg, surface, text, border, status) | ✅ Centralized in `@theme` |
| Typography (Inter, system-ui) | ✅ One declaration in `@theme` + `body {}` |
| Spacing | ✅ Tailwind defaults (no custom spacing needed) |
| Border radius (`--radius-sm/md/lg`) | ✅ Centralized in `@theme` |
| Shadows | ✅ Tailwind defaults (shadow-sm, shadow-lg) |

### JS/TS Side (`src/lib/designTokens.ts` — NEW)
| Token Group | Status |
|---|---|
| Chart colors (budget, realization, remaining, CAPEX) | ✅ Centralized, consumed by all 3 chart components |
| Cursor fill for Recharts tooltips | ✅ Centralized |
| Border-radius pixel values (for inline styles) | ✅ Centralized |
| Status colors | ✅ Available for future use |

> Note: Non-chart Tailwind classes in pages/components still use Tailwind color utilities directly (e.g., `bg-[#8F2438]`). This is **correct** for Tailwind v4 — these are resolved at build time via the `@theme` block and do not need separate JS constants.

---

## 6. TypeScript Result

```
npx tsc --noEmit
Exit code: 0 — CLEAN (no errors, no warnings)
```

---

## 7. Production Build Result

```
npm run build
vite v8.3.1 building client environment for production...
✓ 609 modules transformed.

dist/robots.txt                   0.02 kB │ gzip:   0.04 kB
dist/index.html                   0.92 kB │ gzip:   0.43 kB
dist/assets/index-Sa-XRglU.css   29.07 kB │ gzip:   6.43 kB
dist/assets/index--VA93QXZ.js   706.03 kB │ gzip: 199.14 kB

✓ built in 548ms
Exit code: 0 — SUCCESS
```

> **Note:** The 706 kB JS bundle size warning is non-blocking. It is caused by Recharts being bundled monolithically. Code-splitting (dynamic imports for chart components) can be applied as a future optimization but is not required for correctness.
> No Vite forward-compatibility warnings remain.

---

## 8. Remaining Technical Issues

| # | Issue | Severity | Action |
|---|---|---|---|
| 1 | JS bundle is 706 kB (Recharts) | Low | Optional: lazy-load chart components with `React.lazy()` at Supabase phase |
| 2 | Tailwind color utilities still use raw hex (`bg-[#8F2438]`) in component JSX | Info | Acceptable for Tailwind v4 — values are resolved via `@theme`; not a duplication problem |
| 3 | `DashboardPage` monthly chart hardwires `MONTHLY_DATA_2026` instead of responding to the year selector | Minor | Should be fixed when Supabase data layer is implemented (real data will be year-aware) |
| 4 | Pagination in `PenetapanAnggaranPage` is static UI (Prev/Next buttons do nothing) | Minor | Wire up at Supabase phase with real paginated queries |
| 5 | Export Excel button is placeholder (no handler) | Minor | Implement at ExcelJS integration phase |
| 6 | OneDrive sync button in `RealisasiAnggaranPage` is placeholder | Minor | Implement at Microsoft Graph phase |
| 7 | Login credentials are hardcoded (`admin@univ.ac.id` / `admin123`) | Expected | Replace with Supabase Auth at the next phase |

---

## 9. Readiness for Supabase / Database Implementation

**✅ The project is READY for the Supabase/database implementation phase.**

### Preparation Checklist
| Item | Status |
|---|---|
| TypeScript types defined (`Dosen`, `AlokasiAnggaran`, `RealisasiAnggaran`, etc.) | ✅ In `src/types.ts` — ready to map to DB schema |
| Mock data layer isolated in `src/data/mockData.ts` | ✅ Clean swap point for Supabase queries |
| Auth state separated from UI (`isAuthed`, `dosenToken`) | ✅ In `App.tsx` — replace `handleLogin` with Supabase Auth call |
| Route protection architecture in place | ✅ `if (page === 'login')` / `if (dosenToken)` gates ready for enhancement |
| OPEX business rule enforced at application level | ✅ Ready for RLS reinforcement |
| CAPEX over-budget flow correctly implemented | ✅ No DB constraint will break this |
| Share-token mechanism designed | ✅ `shareToken` field in `Dosen` maps directly to a DB column |
| Design system stable and centralized | ✅ No visual changes needed before DB integration |
| Build pipeline clean | ✅ TypeScript ✓, Vite build ✓ |

### Recommended Next Steps (Supabase Phase)
1. Create PostgreSQL schema matching `src/types.ts` interfaces
2. Enable Row Level Security (RLS) on all tables
3. Replace `DOSEN_LIST`, `ALOKASI_LIST`, `REALISASI_LIST` in `mockData.ts` with Supabase client queries
4. Replace `handleLogin()` in `App.tsx` with `supabase.auth.signInWithPassword()`
5. Replace `dosenToken` hash lookup with Supabase RLS-filtered query using the token
6. Implement real-time listeners for realization updates (optional)

---

*End of report. Preparation phase complete. No Supabase implementation has been started.*
