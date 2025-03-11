import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
				poppins: ['Poppins', 'sans-serif'],
			},
			colors: {
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				container: {
					secondary: 'hsl(var(--container-secondary))',
					battery: {
						from: '#E0F2F1',
						to: '#E8F5E9'
					},
					navigation: {
						from: '#E8EAF6',
						to: '#F3E5F5'
					},
					connection: {
						from: '#FFF3E0',
						to: '#FCEAE3'
					},
					wellbeing: {
						from: '#E1F5FE',
						to: '#E0F7FA'
					},
					education: {
						from: '#FFF8E1',
						to: '#FFFDE7'
					}
				},
				text: {
					primary: 'hsl(var(--text-primary))',
					secondary: 'hsl(var(--text-secondary))',
					accent: 'hsl(var(--text-accent))'
				},
				interactive: {
					primary: 'hsl(var(--interactive-primary))',
					secondary: 'hsl(var(--interactive-secondary))',
					success: 'hsl(var(--interactive-success))'
				},
				footer: {
					inactive: 'hsl(var(--footer-inactive))',
					active: 'hsl(var(--footer-active))'
				},
				teal: {
					DEFAULT: '#3E9D9D',
					light: '#5BBCBC',
					dark: '#328383'
				},
				periwinkle: {
					DEFAULT: '#7B7FC4',
					light: '#9CA0D8',
					dark: '#6A6EB3'
				},
				sage: {
					DEFAULT: '#7DAA92',
					light: '#A5D6A7',
					dark: '#6C9981'
				},
				mauve: {
					DEFAULT: '#AD7A99',
					light: '#C49FB6',
					dark: '#96657F'
				},
				blueteal: {
					DEFAULT: '#4DB6AC',
					light: '#80CBC4',
					dark: '#26A69A'
				},
				amber: {
					DEFAULT: '#FFA726',
					light: '#FFB74D',
					dark: '#FF9800'
				}
			},
			boxShadow: {
				'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
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
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
