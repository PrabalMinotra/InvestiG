/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        // Custom financial theme colors
        'trust-blue': {
          50: 'var(--trust-blue-50)',
          100: 'var(--trust-blue-100)',
          200: 'var(--trust-blue-200)',
          300: 'var(--trust-blue-300)',
          400: 'var(--trust-blue-400)',
          500: 'var(--trust-blue-500)',
          600: 'var(--trust-blue-600)',
          700: 'var(--trust-blue-700)',
          800: 'var(--trust-blue-800)',
          900: 'var(--trust-blue-900)',
        },
        'alert-red': {
          50: 'var(--alert-red-50)',
          100: 'var(--alert-red-50)',
          200: 'var(--alert-red-200)',
          300: 'var(--alert-red-300)',
          400: 'var(--alert-red-400)',
          500: 'var(--alert-red-500)',
          600: 'var(--alert-red-600)',
          700: 'var(--alert-red-700)',
          800: 'var(--alert-red-800)',
          900: 'var(--alert-red-900)',
        },
        'neutral-gray': {
          50: 'var(--neutral-gray-50)',
          100: 'var(--neutral-gray-100)',
          200: 'var(--neutral-gray-200)',
          300: 'var(--neutral-gray-300)',
          400: 'var(--neutral-gray-400)',
          500: 'var(--neutral-gray-500)',
          600: 'var(--neutral-gray-600)',
          700: 'var(--neutral-gray-700)',
          800: 'var(--neutral-gray-800)',
          900: 'var(--neutral-gray-900)',
        },
        'success-green': {
          500: 'var(--success-green-500)',
          600: 'var(--success-green-600)',
        },
        'warning-orange': {
          500: 'var(--warning-orange-500)',
          600: 'var(--warning-orange-600)',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
