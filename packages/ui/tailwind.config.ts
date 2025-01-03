import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "../../packages/ui/src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'chess': 'url(https://media.istockphoto.com/id/947197936/photo/chess-team-building-strategy-king-leadership.jpg?s=612x612&w=0&k=20&c=oylzP9V_ZpDckmWAfGQ8-xDrIHE07FfhzIU-8QSd0CA=)'
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        playfair: ['"Playfair Display"', 'serif'],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    }, keyframes: {
      slideInFromBelow: {
        "0%": { transform: "translateY(100%)", opacity: "0" },
        "100%":{transform: "translateY(0)" , opacity:"1"},
        
      },
      slideIn: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(0)' },
      },
      sideBarHoverAnimation: {
        '0%': { backgroundColor: 'rgba(0,0,0,0)' },
        '100%': { backgroundColor: 'rgba(31, 41, 55, 1)' },
      },
      
    },
    animation: {
      slideInFromBelow: "slideInFromBelow 1s ease-out 0.5s forwards", 
      slideIn: 'slideIn 0.5s ease forwards',
      sideBarHoverAnimation: 'sideBarHoverAnimation 0.5s ease forwards',
      
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config
