/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.{tsx,ts}", "./components/**/*.{tsx,ts}", "./content/*.ts"],
  theme: {
    extend: {
      colors: {
        primary: {
          cyan: '#06b6d4',
          dark: '#000000'
        },
        // Farben als CSS-Variablen (Werte in index.css): dunkel ist Standard,
        // .theme-light auf <html> schaltet die Praxis-Landingpage hell.
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ftext: 'rgb(var(--c-ftext) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        dim: 'rgb(var(--c-dim) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Satoshi', 'sans-serif'],
        syne: ['Syne', 'Avenir Next', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-up-exit': 'slideUpExit 0.5s ease-in-out forwards',
        'gradient-shift': 'gradientShift 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUpExit: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-20px) scale(0.95)', opacity: '0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
