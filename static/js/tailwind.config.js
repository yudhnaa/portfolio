tailwind.config = {
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"primary": "#2c5aa0",
				"primary-dark": "#156cbd",
				"accent": "#f43f5e",
				"background-light": "#f8f9fa",
				"background-dark": "#0c0a10",
				"surface-light": "#ffffff",
				"surface-dark": "#14111b",
				"surface-dark-card": "#181522",
			},
			fontFamily: {
				"display": ["'Unbounded'", "system-ui", "sans-serif"],
				"sans": ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
				"mono": ["'JetBrains Mono'", "monospace"],
			},
			borderRadius: {
				"DEFAULT": "0.5rem",
				"lg": "0.75rem",
				"xl": "1rem",
				"2xl": "1.25rem",
				"full": "9999px"
			},
		},
	},
};
