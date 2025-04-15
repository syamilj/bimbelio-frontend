//tailwind.config.ts

import tailwindTypography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
  darkMode: ['class', 'class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'main-gray-input': '#dadde7',
        'main-gray-input2': '#E8EBF4',
        'main-gray-text': '#5a5d66',
        'main-gray-text2': '#6E717B',
        'main-gray-disabled': '#B6B9C3',
        'main-gray-disabled-hover': '#a4a7af',
        'main-yellow': '#FCB930',
        main: '#0091FF',
        'main-hover': '#0091FF9a',
        'main-border': '#dadde7',
        'main-red': '#da2850',
        'main-red-hover': '#FEE4E9',
        'bg-layout': '#f4f8fb',
        'bg-workspace': '#F4F8FB',
        'surface-primary-light': '#E1F2FF',
        workspace: '#F4F8FB',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        pulse: {
          '0%, 100%': {
            boxShadow: '0 0 0 0 var(--pulse-color)',
          },
          '50%': {
            boxShadow: '0 0 0 8px var(--pulse-color)',
          },
        },
        gradient: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        gradient2: {
          to: {
            backgroundPosition: 'var(--bg-size) 0',
          },
        },
        grid: {
          '0%': {
            transform: 'translateY(-50%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        pulse: 'pulse var(--duration) ease-out infinite',
        gradient: 'gradient 8s linear infinite',
        gradient2: 'gradient2 8s linear infinite',
        grid: 'grid 15s linear infinite',
      },
      backgroundImage: {
        yellowUpgrade: 'linear-gradient(145deg, #FFE680, #FFC04C)',
        yellowUpgradeHover: 'linear-gradient(145deg, #FFE680e0, #FFC04Ce0)',
        greenUpgrade: 'linear-gradient(145deg, #8bcdff, #0091FF)',
        greenUpgradeHover: 'linear-gradient(145deg, #8bcdffe0, #0091FFe0)',
        gradientGreen: 'linear-gradient(145deg, #0091FF, #8bcdff)',
        gradientGreenHover: 'linear-gradient(145deg, #0091FFe0, #8bcdffe0)',
        gradient: 'linear-gradient(to right, #8bcdff, #0091FF)',
        fadeMateri: 'linear-gradient(to bottom, transparent, #f4f8fb)',
        flascardResult: 'linear-gradient(to bottom, #FFFFFF, #F4F8FB)',
      },
      boxShadow: {
        default: '0 0 10px #6f6a6a45',
        default2: '0 0 25px #0000001a',
        cardSoft:
          '0 0 0 1px rgba(0,0,0,.03),0 2px 4px rgba(0,0,0,.05),0 12px 24px rgba(0,0,0,.05)',
      },
      screens: {
        mi: '401px',
        mb: '481px',
        sm: '641px',
        md: '769px',
        md2: '991px',
        lg: '1025px',
        xl: '1281px',
        xxl: '1361px',
        xxxl: '1443px',
        max: '1901px',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindTypography],
} satisfies Config;

export default config;
