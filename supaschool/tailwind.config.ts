
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
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#660099", // Main purple
          light: "#a31ae6", 
          dark: "#4d0073",
          foreground: "hsl(var(--primary-foreground))",
        },
        "primary-yellow": "#FFCC00",
        secondary: {
          DEFAULT: "#FFCC00", // Main yellow
          light: "#FFD633",
          dark: "#E6B800",
          foreground: "hsl(var(--secondary-foreground))",
        },
        "secondary-yellow": "#FFD633",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          pink: "#FFADAD", // Color 1 from coolors
          peach: "#FFD6A5", // Color 2 from coolors
          yellow: "#FDFFB6", // Color 3 from coolors
          green: "#CAFFBF", // Color 4 from coolors
          cyan: "#9BF6FF", // Color 5 from coolors
          blue: "#A0C4FF", // Color 6 from coolors
          purple: "#BDB2FF", // Color 7 from coolors
          lavender: "#FFC6FF", // Color 8 from coolors
          white: "#FFFFFC", // Color 9 from coolors
        },
        "accent-yellow": "#FFCC00",
        // Adding soft pastel versions
        "accent-soft": {
          pink: "#FFADAD",
          peach: "#FFD6A5",
          yellow: "#FDFFB6",
          green: "#CAFFBF",
          cyan: "#9BF6FF",
          blue: "#A0C4FF",
          purple: "#BDB2FF",
          lavender: "#FFC6FF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        kytabu: {
          purple: "#660099",
          "purple-dark": "#4d0073",
          "purple-light": "#a31ae6",
          yellow: "#FFCC00",
          "yellow-light": "#FFD633",
          "yellow-dark": "#E6B800",
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "pulse-soft": "pulse-soft 3s infinite ease-in-out",
        "float": "float 3s infinite ease-in-out",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-card': 'linear-gradient(to right, #660099, #FFCC00)',
        'gradient-primary': 'linear-gradient(135deg, #660099 0%, #a31ae6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FFCC00 0%, #FFD633 100%)',
        'gradient-yellow': 'linear-gradient(135deg, #FFCC00 0%, #FFD633 100%)',
        'gradient-blue': 'linear-gradient(135deg, #A0C4FF 0%, #9BF6FF 100%)',
        'gradient-green': 'linear-gradient(135deg, #CAFFBF 0%, #9BF6FF 100%)',
        'gradient-purple': 'linear-gradient(135deg, #660099 0%, #BDB2FF 100%)',
        'gradient-pastel': 'linear-gradient(135deg, #FFADAD 0%, #FFC6FF 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(134, 0, 204, 0.3)',
        'card': '0 4px 20px -5px rgba(0, 0, 0, 0.08)',
        'clickable': '0 4px 10px -2px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 20px -4px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
