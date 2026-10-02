/**
 * LECTRA Design Tokens -- JavaScript/TypeScript side
 *
 * These mirror the @theme values in src/index.css exactly.
 * Use these constants in recharts components and anywhere a raw
 * hex string is needed in JS (not in Tailwind classes).
 *
 * DO NOT change individual values here; update index.css @theme first,
 * then keep this file in sync.
 */

// --- Brand / Primary ---
export const COLOR_PRIMARY            = '#8F2438';
export const COLOR_PRIMARY_HOVER      = '#761D2E';
export const COLOR_PRIMARY_DARK       = '#5E1726';
export const COLOR_PRIMARY_SOFT       = '#F8E9ED';
export const COLOR_SECONDARY_BURGUNDY = '#A83A4F';

// --- Backgrounds & Surfaces ---
export const COLOR_BG                 = '#F7F7F8';
export const COLOR_SURFACE            = '#FFFFFF';

// --- Text ---
export const COLOR_TEXT               = '#1F2937';
export const COLOR_TEXT_SECONDARY     = '#667085';
export const COLOR_TEXT_MUTED         = '#98A2B3';

// --- Borders ---
export const COLOR_BORDER             = '#E4E7EC';
export const COLOR_DIVIDER            = '#EAECF0';

// --- Status ---
export const COLOR_SUCCESS            = '#16805B';
export const COLOR_SUCCESS_SOFT       = '#E8F5EF';
export const COLOR_WARNING            = '#C88719';
export const COLOR_WARNING_SOFT       = '#FFF4D6';
export const COLOR_DANGER             = '#B42318';
export const COLOR_DANGER_SOFT        = '#FDECEC';

// --- Chart Colors (recharts fill props) ---
/** Anggaran / Budget bar -- burgundy primary */
export const CHART_COLOR_BUDGET       = '#8F2438';
/** Realisasi / Realization bar -- slightly lighter burgundy */
export const CHART_COLOR_REALIZATION  = '#A83A4F';
/** Sisa / Remaining bar -- neutral gray */
export const CHART_COLOR_REMAINING    = '#D9DDE3';
/** CAPEX accent -- indigo */
export const CHART_COLOR_CAPEX        = '#4338CA';

// --- Recharts cursor fill ---
export const CHART_CURSOR_FILL        = COLOR_PRIMARY_SOFT;

// --- Border radii (px, for inline styles when Tailwind class is unavailable) ---
export const RADIUS_SM                = 8;   // px  matches --radius-sm: 8px
export const RADIUS_MD                = 12;  // px  matches --radius-md: 12px
export const RADIUS_LG                = 16;  // px  matches --radius-lg: 16px
