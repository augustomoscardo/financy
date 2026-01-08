/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate"

export default {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif']
			},
			colors: {
				// Brand
				brand: {
					dark: '#124B2B',
					base: '#1F6F43'
				},
				// Grayscale
				gray: {
					800: '#111827',
					700: '#374151',
					600: '#4B5563',
					500: '#6B7280',
					400: '#9CA3AF',
					300: '#D1D5DB',
					200: '#E5E7EB',
					100: '#F8F9FA'
				},
				// Neutral
				black: '#000000',
				white: '#ffffff',
				// Feedback
				danger: '#EF4444',
				success: '#19AD70',
				// Blue
				blue: {
					dark: '#1D4ED8',
					base: '#2563EB',
					light: '#DBEAFE'
				},
				// Purple
				purple: {
					dark: '#7E22CE',
					base: '#9333EA',
					light: '#F3E8FF'
				},
				// Pink
				pink: {
					dark: '#BE185D',
					base: '#DB2777',
					light: '#FCE7F3'
				},
				// Red
				red: {
					dark: '#B91C1C',
					base: '#DC2626',
					light: '#FEE2E2'
				},
				// Orange
				orange: {
					dark: '#C2410C',
					base: '#EA580C',
					light: '#FFEDD5'
				},
				// Yellow
				yellow: {
					dark: '#A16207',
					base: '#CA8A04',
					light: '#F7F5CA'
				},
				// Green
				green: {
					dark: '#15803D',
					base: '#16A34A',
					light: '#E0FAE9'
				},

				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [tailwindcssAnimate, require("tailwindcss-animate")],
}