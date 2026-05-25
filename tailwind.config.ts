import type { Config } from "tailwindcss";
import animate = require("tailwindcss-animate");

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			'ws-ink':            'var(--ws-ink)',
  			'ws-ink-hi':         'var(--ws-ink-hi)',
  			'ws-ink-soft':       'var(--ws-ink-soft)',
  			'ws-ink-mute':       'var(--ws-ink-mute)',
  			'ws-bg':             'var(--ws-bg)',
  			'ws-bg-2':           'var(--ws-bg-2)',
  			'ws-bg-3':           'var(--ws-bg-3)',
  			'ws-line':           'var(--ws-line)',
  			'ws-line-soft':      'var(--ws-line-soft)',
  			'ws-ember':          'var(--ws-ember)',
  			'ws-ember-bright':   'var(--ws-ember-bright)',
  			'ws-ember-deep':     'var(--ws-ember-deep)',
  			'ws-ember-text':     'var(--ws-ember-text)',
  			'ws-cream':          'var(--ws-cream)',
  			'ws-overlay-chip':   'var(--ws-overlay-chip)',
  			'ws-overlay-border': 'var(--ws-overlay-border)',
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
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'ws-ctrl':       '9px',
  			'ws-ctrl-inner': '6px',
  			'ws-sm':         '11px',
  			'ws-md':         '12px',
  			'ws-chip':       '14px',
  			'ws-card':       '18px',
  			'ws-xl':         '22px',
  			'ws-2xl':        '28px',
  		},
  		fontSize: {
  			'ws-2xs':        '11px',
  			'ws-xs':         '12.5px',
  			'ws-sm':         '13px',
  			'ws-base':       '14px',
  			'ws-md':         '15px',
  			'ws-lg':         '17px',
  			'ws-xl':         '18px',
  			'ws-2xl':        '28px',
  			'ws-3xl':        '36px',
  			'ws-hero-title': 'clamp(32px, 4vw, 54px)',
  			'ws-hero-body':  'clamp(13px, 1.1vw, 15.5px)',
  		},
  		spacing: {
  			'ws-ctrl': '34px',
  		}
  	}
  },
  plugins: [animate],
};

export default config;
