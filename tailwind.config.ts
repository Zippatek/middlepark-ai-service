import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ai-agent/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── MIDDLEPARK COLOR SYSTEM ────────────────────────────────
      colors: {
        // Primary Brand — Red
        red: {
          DEFAULT: '#ED1B24',   // MiddlePark Red — Primary brand, CTAs, active states
          dark: '#C41720',      // Deep red — hover/pressed states
          light: '#F04950',     // Lighter red — secondary actions
          tint: '#FDF2F2',      // Rose tint — backgrounds, hover fills
          muted: '#F5C6C8',     // Muted red — borders, dividers
          accent: '#ED1B24',    // Alias for backwards compat
        },
        // Legacy green alias → now maps to red for any leftover references
        green: {
          DEFAULT: '#ED1B24',
          dark: '#C41720',
          light: '#F04950',
          tint: '#FDF2F2',
          muted: '#F5C6C8',
        },
        // Structural
        charcoal: {
          DEFAULT: '#5A5B5F',   // Primary text, structural, footer
          dark: '#3A3B3F',      // Deeper text for strong emphasis
          light: '#8A8B8F',     // Captions, placeholders, muted text
        },
        // Canvas & Surfaces
        cream: {
          DEFAULT: '#F8F7F3',   // Page canvas background
          dark: '#EEE9E0',      // Section alternate background
          border: '#D6D3C8',    // Input and card borders
          divider: '#E8E4DC',   // Section dividers
        },
        // Override white
        white: '#FFFFFF',
      },

      // ─── TYPOGRAPHY ──────────────────────────────────────────────
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['72px', { lineHeight: '1.02', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['64px', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '700' }],
        'h2': ['42px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['28px', { lineHeight: '1.2', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.7', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.7', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'overline': ['11px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.1em' }],
        'badge': ['11px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.05em' }],
        'nav': ['13px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0.04em' }],
      },

      // ─── SPACING (8pt system) ─────────────────────────────────────
      spacing: {
        '4.5': '18px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
        '34': '136px',
      },

      // ─── BORDER RADIUS ────────────────────────────────────────────
      borderRadius: {
        'card': '12px',
        'button': '6px',
        'badge': '20px',
        'container': '8px',
        'input': '6px',
        'avatar': '50%',
        'sm': '4px',
      },

      // ─── BOX SHADOWS ─────────────────────────────────────────────
      boxShadow: {
        'card': '0 4px 24px rgba(237, 27, 36, 0.06)',
        'card-hover': '0 10px 40px rgba(237, 27, 36, 0.12)',
        'seal': '0 2px 12px rgba(237, 27, 36, 0.14)',
        'sidebar': '2px 0 16px rgba(90, 91, 95, 0.06)',
        'topbar': '0 2px 8px rgba(90, 91, 95, 0.06)',
        'modal': '0 20px 60px rgba(237, 27, 36, 0.15)',
        'cta': '0 8px 32px rgba(237, 27, 36, 0.25)',
        'hero-float': '0 12px 48px rgba(0, 0, 0, 0.2)',
        'none': 'none',
      },

      // ─── BACKGROUND GRADIENTS ────────────────────────────────────
      backgroundImage: {
        // MiddlePark brand gradients — red direction
        'red-gradient': 'linear-gradient(135deg, #ED1B24 0%, #C41720 100%)',
        'red-bottom': 'linear-gradient(to bottom, transparent 0%, #C41720 100%)',
        'charcoal-gradient': 'linear-gradient(135deg, #5A5B5F 0%, #3A3B3F 100%)',
        // Subtle canvas gradient
        'cream-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8F7F3 100%)',
        // Hero overlay — charcoal-based for elegance with red accent
        'hero-overlay': 'linear-gradient(to right, rgba(58,59,63,0.88) 40%, rgba(58,59,63,0.3) 100%)',
        // Legacy aliases
        'green-gradient': 'linear-gradient(135deg, #ED1B24 0%, #C41720 100%)',
        'green-bottom': 'linear-gradient(to bottom, transparent 0%, #C41720 100%)',
      },

      // ─── TRANSITIONS ─────────────────────────────────────────────
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ─── MAX WIDTHS ───────────────────────────────────────────────
      maxWidth: {
        'site': '1320px',
        'portal': '1280px',
        'auth-card': '480px',
        'dev-card': '400px',
        'content': '720px',
        'narrow': '560px',
      },

      // ─── DIMENSIONS ───────────────────────────────────────────────
      width: {
        'sidebar': '240px',
        'sidebar-collapsed': '72px',
      },
      height: {
        'topbar': '72px',
        'navbar': '80px',
        'dev-image': '260px',
        'dev-image-lg': '380px',
        'hero': '100vh',
      },

      // ─── LETTER SPACING ───────────────────────────────────────────
      letterSpacing: {
        'overline': '0.1em',
        'nav': '0.04em',
        'badge': '0.05em',
        'wide': '0.06em',
      },
    },
  },
  plugins: [],
}

export default config
