/**
 * Style tokens — single source of truth for color, type, space, and borders.
 *
 * Site-wide foundations (header, home, footer, lesson chrome) plus Material
 * extras from the Figma table capture. Aligned with `:root` in `src/styles.scss`.
 * New components should import from here instead of inventing hex / rem values.
 *
 * Figma: https://www.figma.com/design/fBg5ImBRY8j7KEqrSfOwXi/Untitled
 */

export const FIGMA_SOURCE = {
  fileKey: 'fBg5ImBRY8j7KEqrSfOwXi',
  fileName: 'Untitled',
  frames: [
    { id: '7:2', name: 'Material Table & Grid — Header' },
    { id: '8:2', name: 'Section (Material Table & Grid)' },
  ],
  extractedAt: '2026-09-12',
} as const;

export type TokenSource = 'css-root' | 'figma' | 'both';

export interface ColorToken {
  id: string;
  name: string;
  cssVar: `--${string}` | null;
  hex: string;
  usage: string;
  group: 'surface' | 'ink' | 'brand' | 'shell' | 'accent' | 'feedback' | 'material' | 'data';
  source: TokenSource;
}

export interface TypeToken {
  id: string;
  name: string;
  family: string;
  weight: number;
  size: string;
  lineHeight: string;
  letterSpacing?: string;
  usage: string;
  source: TokenSource;
}

export interface SpaceToken {
  id: string;
  name: string;
  px: number;
  rem: string;
  usage: string;
}

export interface RadiusToken {
  id: string;
  name: string;
  px: number;
  css: string;
  usage: string;
}

export interface BorderToken {
  id: string;
  name: string;
  css: string;
  usage: string;
}

export interface ElevationToken {
  id: string;
  name: string;
  css: string;
  usage: string;
}

export interface IconToken {
  id: string;
  name: string;
  ligature: string;
  sizePx: number;
  usage: string;
}

export const COLOR_TOKENS: readonly ColorToken[] = [
  {
    id: 'bg',
    name: 'Canvas',
    cssVar: '--bg',
    hex: '#f4f1eb',
    usage: 'App background, page canvas',
    group: 'surface',
    source: 'both',
  },
  {
    id: 'card',
    name: 'Card',
    cssVar: '--card',
    hex: '#fffdf8',
    usage: 'Lesson cards, panels, elevated surfaces',
    group: 'surface',
    source: 'both',
  },
  {
    id: 'white',
    name: 'White',
    cssVar: '--white',
    hex: '#ffffff',
    usage: 'Inputs, table body, high-contrast fills',
    group: 'surface',
    source: 'both',
  },
  {
    id: 'surface-soft',
    name: 'Surface soft',
    cssVar: null,
    hex: '#faf9fd',
    usage: 'Material page wash captured from Figma (most common fill)',
    group: 'surface',
    source: 'figma',
  },
  {
    id: 'ink',
    name: 'Ink',
    cssVar: '--ink',
    hex: '#1c1917',
    usage: 'Primary text, headings',
    group: 'ink',
    source: 'both',
  },
  {
    id: 'muted',
    name: 'Muted',
    cssVar: '--muted',
    hex: '#57534e',
    usage: 'Lead copy, captions, secondary labels',
    group: 'ink',
    source: 'both',
  },
  {
    id: 'on-surface',
    name: 'On-surface',
    cssVar: null,
    hex: '#1a1b1f',
    usage: 'Material on-surface text (Roboto labels)',
    group: 'ink',
    source: 'figma',
  },
  {
    id: 'outline',
    name: 'Outline',
    cssVar: '--line',
    hex: '#d6d3d1',
    usage: 'Card borders, field outlines, dividers',
    group: 'ink',
    source: 'both',
  },
  {
    id: 'outline-strong',
    name: 'Outline strong',
    cssVar: null,
    hex: '#74777f',
    usage: 'Material outline / icon stroke (Figma stroke count leader)',
    group: 'ink',
    source: 'figma',
  },
  {
    id: 'teal',
    name: 'Teal',
    cssVar: '--teal',
    hex: '#0f766e',
    usage: 'Brand links, primary buttons, selected rows',
    group: 'brand',
    source: 'both',
  },
  {
    id: 'teal-soft',
    name: 'Teal soft',
    cssVar: '--teal-soft',
    hex: '#acdfd4',
    usage: 'Chips, selected-row wash, brand tint',
    group: 'brand',
    source: 'both',
  },
  {
    id: 'teal-deep',
    name: 'Teal deep',
    cssVar: null,
    hex: '#115e59',
    usage: 'Teal text on soft fills',
    group: 'brand',
    source: 'figma',
  },
  {
    id: 'header-gold',
    name: 'Header gold',
    cssVar: null,
    hex: '#e0bb5f',
    usage: 'Site header gradient start → canvas',
    group: 'shell',
    source: 'both',
  },
  {
    id: 'footer-cream',
    name: 'Footer cream',
    cssVar: null,
    hex: '#fceabc',
    usage: 'Site footer bar background',
    group: 'shell',
    source: 'css-root',
  },
  {
    id: 'nav-link',
    name: 'Nav section',
    cssVar: null,
    hex: '#186df8',
    usage: 'Header/footer dropdown section titles',
    group: 'shell',
    source: 'css-root',
  },
  {
    id: 'auth-out',
    name: 'Logged out',
    cssVar: null,
    hex: '#f55656',
    usage: 'Header auth button when logged out',
    group: 'shell',
    source: 'css-root',
  },
  {
    id: 'auth-out-ink',
    name: 'Logged-out ink',
    cssVar: null,
    hex: '#fffdfc',
    usage: 'Text on the logged-out auth button',
    group: 'shell',
    source: 'css-root',
  },
  {
    id: 'amber',
    name: 'Amber',
    cssVar: '--amber',
    hex: '#b45309',
    usage: 'Lesson banners, caution accents',
    group: 'accent',
    source: 'css-root',
  },
  {
    id: 'amber-soft',
    name: 'Amber soft',
    cssVar: '--amber-soft',
    hex: '#fef3c7',
    usage: 'Banner background, level-pill wash',
    group: 'accent',
    source: 'both',
  },
  {
    id: 'amber-ink',
    name: 'Amber ink',
    cssVar: null,
    hex: '#92400e',
    usage: 'Text on amber-soft pills',
    group: 'accent',
    source: 'figma',
  },
  {
    id: 'emit',
    name: 'Emit',
    cssVar: '--emit',
    hex: '#7c3aed',
    usage: 'Event / emit accents, home eyebrow highlight',
    group: 'accent',
    source: 'both',
  },
  {
    id: 'emit-soft',
    name: 'Emit soft',
    cssVar: '--emit-soft',
    hex: '#ede9fe',
    usage: 'Violet wash behind emit accents',
    group: 'accent',
    source: 'css-root',
  },
  {
    id: 'violet',
    name: 'Violet',
    cssVar: '--violet',
    hex: '#6d28d9',
    usage: 'Grid tiles, secondary accent',
    group: 'accent',
    source: 'both',
  },
  {
    id: 'blue',
    name: 'Lab blue',
    cssVar: '--blue',
    hex: '#1996f9',
    usage: 'Informational accents (non-Material)',
    group: 'accent',
    source: 'css-root',
  },
  {
    id: 'material-primary',
    name: 'Material primary',
    cssVar: null,
    hex: '#005cbb',
    usage: 'Azure-blue theme primary (Add button, filled actions)',
    group: 'material',
    source: 'figma',
  },
  {
    id: 'action-edit',
    name: 'Action edit',
    cssVar: null,
    hex: '#2563eb',
    usage: 'Table pencil / edit icon',
    group: 'material',
    source: 'figma',
  },
  {
    id: 'table-chrome',
    name: 'Table chrome',
    cssVar: null,
    hex: '#e4eff3',
    usage: 'MatTable header + paginator background',
    group: 'data',
    source: 'both',
  },
  {
    id: 'row-hover',
    name: 'Row hover',
    cssVar: null,
    hex: '#f1f5f9',
    usage: 'Interactive table row hover',
    group: 'data',
    source: 'both',
  },
  {
    id: 'code',
    name: 'Code surface',
    cssVar: '--code',
    hex: '#1e293b',
    usage: 'Syntax blocks, dark pre backgrounds',
    group: 'data',
    source: 'both',
  },
  {
    id: 'code-ink',
    name: 'Code ink',
    cssVar: null,
    hex: '#e2e8f0',
    usage: 'Text on code surfaces',
    group: 'data',
    source: 'both',
  },
  {
    id: 'danger',
    name: 'Danger',
    cssVar: '--danger',
    hex: '#b91c1c',
    usage: 'Destructive text, errors',
    group: 'feedback',
    source: 'css-root',
  },
  {
    id: 'danger-soft',
    name: 'Danger soft',
    cssVar: '--danger-soft',
    hex: '#fee2e2',
    usage: 'API-offline banner, error wash',
    group: 'feedback',
    source: 'css-root',
  },
  {
    id: 'action-delete',
    name: 'Action delete',
    cssVar: null,
    hex: '#dc2626',
    usage: 'Table trash / delete icon (Figma)',
    group: 'feedback',
    source: 'figma',
  },
  {
    id: 'lime',
    name: 'Lime',
    cssVar: '--limegreen',
    hex: '#84cc16',
    usage: 'Success / positive accent',
    group: 'feedback',
    source: 'css-root',
  },
];

export const TYPE_TOKENS: readonly TypeToken[] = [
  {
    id: 'display',
    name: 'Display',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 700,
    size: 'clamp(1.6rem, 3vw, 2rem)',
    lineHeight: '1.2',
    usage: 'Page H1 (lesson titles)',
    source: 'both',
  },
  {
    id: 'title',
    name: 'Title',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 700,
    size: '1.05rem',
    lineHeight: '1.3',
    usage: 'Card H2, section titles',
    source: 'both',
  },
  {
    id: 'home-eyebrow',
    name: 'Home eyebrow',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 600,
    size: '1.5rem',
    lineHeight: '1.2',
    letterSpacing: '0.04em',
    usage: 'Home uppercase eyebrow (lab blue + emit title)',
    source: 'css-root',
  },
  {
    id: 'fold-title',
    name: 'Fold title',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 700,
    size: '1.2rem',
    lineHeight: '1.2',
    usage: 'Home fold headings (teal)',
    source: 'css-root',
  },
  {
    id: 'nav-item',
    name: 'Nav item',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 600,
    size: '0.9rem',
    lineHeight: '1.2',
    usage: 'Header nav links and dropdown triggers',
    source: 'css-root',
  },
  {
    id: 'brand-mark',
    name: 'Brand mark',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 700,
    size: '0.7rem',
    lineHeight: '1.2',
    letterSpacing: '0.06em',
    usage: 'Header logo uppercase mark',
    source: 'css-root',
  },
  {
    id: 'body',
    name: 'Body',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 400,
    size: '1rem',
    lineHeight: '1.45',
    usage: 'Default body copy (`body` in styles.scss)',
    source: 'both',
  },
  {
    id: 'lead',
    name: 'Lead',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 400,
    size: '1rem',
    lineHeight: '1.5',
    usage: 'Lesson lead paragraphs (muted ink)',
    source: 'both',
  },
  {
    id: 'label',
    name: 'Label',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 600,
    size: '0.85rem',
    lineHeight: '1.35',
    usage: 'Field labels, toolbar counts',
    source: 'both',
  },
  {
    id: 'caption',
    name: 'Caption',
    family: "'Segoe UI', 'Source Sans 3', system-ui, sans-serif",
    weight: 600,
    size: '0.8rem',
    lineHeight: '1.35',
    letterSpacing: '0.04em',
    usage: 'Eyebrows, uppercase meta',
    source: 'both',
  },
  {
    id: 'material-body',
    name: 'Material body',
    family: 'Roboto, sans-serif',
    weight: 400,
    size: '14px',
    lineHeight: '20px',
    usage: 'MatTable cells, form fields (Figma: Roboto Regular 14)',
    source: 'figma',
  },
  {
    id: 'material-label',
    name: 'Material label',
    family: 'Roboto, sans-serif',
    weight: 500,
    size: '14px',
    lineHeight: '20px',
    usage: 'Mat buttons, sort headers (Figma: Roboto Medium 14)',
    source: 'figma',
  },
  {
    id: 'code',
    name: 'Code',
    family: "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, monospace",
    weight: 400,
    size: '0.78rem',
    lineHeight: '1.45',
    usage: 'Inline code and syntax blocks (Figma: Cascadia Code ~12.5)',
    source: 'both',
  },
];

export const SPACE_TOKENS: readonly SpaceToken[] = [
  { id: 'space-2', name: '2', px: 2, rem: '0.125rem', usage: 'Hairline tweaks' },
  { id: 'space-4', name: '4', px: 4, rem: '0.25rem', usage: 'Icon-to-label gap (Figma gap 4)' },
  { id: 'space-8', name: '8', px: 8, rem: '0.5rem', usage: 'Tight stacks, chip padding-x' },
  { id: 'space-12', name: '12', px: 12, rem: '0.75rem', usage: 'Card inner gaps, banner padding' },
  { id: 'space-16', name: '16', px: 16, rem: '1rem', usage: 'Default card padding, nav inset' },
  { id: 'space-20', name: '20', px: 20, rem: '1.25rem', usage: 'Lead margin, section breathing room' },
  { id: 'space-24', name: '24', px: 24, rem: '1.5rem', usage: 'Empty-table cell, large stacks' },
  { id: 'space-32', name: '32', px: 32, rem: '2rem', usage: 'Page-level section gaps' },
];

export const RADIUS_TOKENS: readonly RadiusToken[] = [
  { id: 'radius-sm', name: 'Small', px: 6, css: '0.4rem', usage: 'Inputs, nav pills (Figma ~5.6–6.4)' },
  { id: 'radius-md', name: 'Medium', px: 8, css: '0.5rem', usage: 'Buttons, pre blocks, table container' },
  { id: 'radius-lg', name: 'Large', px: 12, css: '0.75rem', usage: 'Lesson cards, home cards' },
  { id: 'radius-fold', name: 'Fold', px: 14, css: '0.85rem', usage: 'Home fold containers' },
  { id: 'radius-xl', name: 'XL', px: 20, css: '1.25rem', usage: 'Soft Material chips (Figma radius 20)' },
  { id: 'radius-pill', name: 'Pill', px: 999, css: '999px', usage: 'Level pills, chips, header logout' },
];

export const BORDER_TOKENS: readonly BorderToken[] = [
  { id: 'border-hairline', name: 'Hairline', css: '1px solid var(--line)', usage: 'Cards, fields, table chrome (Figma stroke 1)' },
  { id: 'border-dashed', name: 'Dashed', css: '1px dashed var(--line)', usage: 'Preview wells' },
  { id: 'border-banner', name: 'Banner rule', css: '4px solid var(--amber)', usage: 'Lesson callout left edge' },
];

export const ELEVATION_TOKENS: readonly ElevationToken[] = [
  { id: 'shadow-none', name: 'None', css: 'none', usage: 'Flat surfaces' },
  {
    id: 'shadow-table',
    name: 'Table',
    css: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    usage: 'MatTable container (captured from table lab)',
  },
  {
    id: 'shadow-menu',
    name: 'Header menu',
    css: '0 12px 28px rgb(28 25 23 / 12%)',
    usage: 'Header dropdown menus',
  },
  {
    id: 'shadow-footer-menu',
    name: 'Footer menu',
    css: '0 -10px 28px rgb(28 25 23 / 14%)',
    usage: 'Footer menus that open upward',
  },
];

export const ICON_TOKENS: readonly IconToken[] = [
  { id: 'search', name: 'Search', ligature: 'search', sizePx: 24, usage: 'Filter field prefix' },
  { id: 'refresh', name: 'Refresh', ligature: 'refresh', sizePx: 18, usage: 'Reload toolbar' },
  { id: 'seed', name: 'Seed', ligature: 'spa', sizePx: 18, usage: 'Seed SQLite' },
  { id: 'reset', name: 'Reset', ligature: 'restart_alt', sizePx: 18, usage: 'Reset seed' },
  { id: 'add', name: 'Add person', ligature: 'person_add', sizePx: 18, usage: 'Add row' },
  { id: 'edit', name: 'Edit', ligature: 'edit', sizePx: 18, usage: 'Row edit (action-edit blue)' },
  { id: 'delete', name: 'Delete', ligature: 'delete', sizePx: 18, usage: 'Row delete (action-delete red)' },
  { id: 'person', name: 'Person', ligature: 'person', sizePx: 24, usage: 'Selection banner' },
  { id: 'dashboard', name: 'Dashboard', ligature: 'dashboard', sizePx: 24, usage: 'Grid hero tile' },
  { id: 'sidebar', name: 'Sidebar', ligature: 'view_sidebar', sizePx: 24, usage: 'Grid sidebar tile' },
  { id: 'analytics', name: 'Analytics', ligature: 'analytics', sizePx: 24, usage: 'Grid analytics tile' },
  { id: 'settings', name: 'Settings', ligature: 'settings', sizePx: 24, usage: 'Grid settings tile' },
];

export const USAGE_RULES = [
  {
    title: 'Color',
    body: 'Use semantic tokens (ink, muted, teal, danger) — never raw hex in a new component. Pair soft + ink (teal-soft with teal, amber-soft with amber-ink).',
  },
  {
    title: 'Typography',
    body: 'Lesson pages use Segoe UI. Material widgets keep Roboto 14 Medium/Regular from the azure-blue theme. Code is Cascadia / ui-monospace.',
  },
  {
    title: 'Spacing',
    body: 'Stick to the 4px scale. Card padding is 16. Tight control rows are 8. Do not invent 7px or 13px gaps.',
  },
  {
    title: 'Borders & radius',
    body: 'Default stroke is 1px --line. Cards are radius-lg (12). Controls are radius-sm/md. Status chips are pills.',
  },
  {
    title: 'Shell',
    body: 'Header fades gold → canvas. Footer is footer-cream. Active nav is teal on teal-soft. Logged-out auth is auth-out — not danger.',
  },
  {
    title: 'Icons',
    body: 'Material Icons only, and only in Material labs. Default 24px in content, 18px inside buttons. Recolor with the action tokens.',
  },
  {
    title: 'Elevation',
    body: 'Lesson surfaces are flat. Raise only menus (header/footer shadows) and the data table.',
  },
] as const;

export const COLOR_GROUPS: { id: ColorToken['group']; label: string }[] = [
  { id: 'surface', label: 'Surfaces' },
  { id: 'ink', label: 'Ink & outline' },
  { id: 'brand', label: 'Brand' },
  { id: 'shell', label: 'Shell · header / home / footer' },
  { id: 'accent', label: 'Accents' },
  { id: 'material', label: 'Material actions' },
  { id: 'data', label: 'Data & code' },
  { id: 'feedback', label: 'Feedback' },
];

export function colorsByGroup(group: ColorToken['group']): ColorToken[] {
  return COLOR_TOKENS.filter((token) => token.group === group);
}
