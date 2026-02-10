import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#FAFAFA',
          secondary: '#FFFFFF',
          elevated: '#FFFFFF',
          inset: '#F2F2F3',
          hover: '#EBEBEC',
        },
        border: {
          primary: '#E0E0E2',
          subtle: '#EBEBEC',
          focus: '#8B8B8E',
        },
        text: {
          primary: '#1A1A1C',
          secondary: '#6B6B6F',
          tertiary: '#9C9CA0',
          inverse: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#5B5BD6',
          hover: '#4C4CC4',
          subtle: '#EDEDFC',
          text: '#4747B3',
        },
        status: {
          overdue: '#E5484D',
          'overdue-bg': '#FEECEE',
          'overdue-text': '#CE2C31',
          due: '#F09E00',
          'due-bg': '#FFF3D0',
          'due-text': '#AD6F00',
          ontrack: '#30A46C',
          'ontrack-bg': '#E6F6ED',
          'ontrack-text': '#1D7D4E',
        },
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        md: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        lg: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        relaxed: '1.65',
      },
      fontSize: {
        h1: [
          '28px',
          { lineHeight: '1.2', letterSpacing: '-0.5px', fontWeight: '700' },
        ],
        h2: [
          '22px',
          { lineHeight: '1.2', letterSpacing: '-0.3px', fontWeight: '600' },
        ],
        h3: [
          '17px',
          { lineHeight: '1.2', letterSpacing: '-0.1px', fontWeight: '600' },
        ],
        body: ['14px', { lineHeight: '1.65', fontWeight: '400' }],
        small: ['13px', { lineHeight: '1.65', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.5', fontWeight: '500' }],
        overline: [
          '11px',
          { lineHeight: '1.5', letterSpacing: '0.8px', fontWeight: '600' },
        ],
      },
      transitionDuration: {
        fast: '120ms',
        normal: '200ms',
      },
      maxWidth: {
        page: '960px',
      },
    },
  },
  plugins: [],
};

export default config;
