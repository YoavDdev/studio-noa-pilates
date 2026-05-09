import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Noa's Classical & Spiritual Palette
        primary: {
          DEFAULT: '#B8935A',
          light: '#EFE3CC',
          dark: '#8B6B38',
        },
        sage: {
          DEFAULT: '#5A7A5C',
          light: '#A8C4AA',
          dark: '#3E5840',
        },
        background: '#FAF8F3',
        surface: '#FFFFFF',
        border: '#E8E2D9',
        text: {
          primary: '#1A130A',
          secondary: '#5C4D3C',
          muted: '#9C8E7E',
        },
        black: '#0F0A05',
        error: '#B86B5A',
        gold: {
          DEFAULT: '#B8935A',
          light: '#EFE3CC',
          dark: '#8B6B38',
        }
      },
      fontFamily: {
        heading: ['Frank Ruhl Libre', 'Georgia', 'serif'],
        body: ['Assistant', 'sans-serif'],
        quote: ['Frank Ruhl Libre', 'Georgia', 'serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '36px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
