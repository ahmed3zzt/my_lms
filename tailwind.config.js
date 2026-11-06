/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Clean emerald/green accent like modern developer platforms
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        dark: {
          bg: '#090a0f',        // Deep space dark background
          card: '#11131a',      // Surface card
          elevated: '#171a23',  // Hover / dropdown surface
          border: '#1f2430',    // Clean subtle border
          muted: '#8b949e',     // Secondary text
          text: '#f0f6fc'       // Primary text
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'monospace'
        ]
      },
      typography: (theme) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.dark.muted'),
            '--tw-prose-headings': theme('colors.dark.text'),
            '--tw-prose-lead': theme('colors.zinc.400'),
            '--tw-prose-links': theme('colors.emerald.400'),
            '--tw-prose-bold': theme('colors.dark.text'),
            '--tw-prose-counters': theme('colors.zinc.400'),
            '--tw-prose-bullets': theme('colors.zinc.600'),
            '--tw-prose-hr': theme('colors.dark.border'),
            '--tw-prose-quotes': theme('colors.zinc.200'),
            '--tw-prose-quote-borders': theme('colors.emerald.500'),
            '--tw-prose-captions': theme('colors.zinc.400'),
            '--tw-prose-code': theme('colors.emerald.300'),
            '--tw-prose-pre-code': theme('colors.zinc.200'),
            '--tw-prose-pre-bg': '#0d1117',
            '--tw-prose-th-borders': theme('colors.dark.border'),
            '--tw-prose-td-borders': theme('colors.dark.border'),
          }
        }
      })
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
