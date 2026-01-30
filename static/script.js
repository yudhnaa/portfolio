tailwind.config = {
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"primary": "#2c5aa0",
				"primary-dark": "#156cbd",
				"background-light": "#f6f7f8",
				"background-dark": "#111921",
				"surface-light": "#ffffff",
				"surface-dark": "#1a2632",
			},
			fontFamily: {
				"display": ["Inter", "sans-serif"]
			},
			borderRadius: {
				"DEFAULT": "0.375rem",
				"lg": "0.5rem",
				"xl": "0.75rem",
				"2xl": "1rem",
				"full": "9999px"
			},
		},
	},
};

document.addEventListener('DOMContentLoaded', function () {
	const mobileMenuBtn = document.getElementById('mobileMenuBtn');
	const navMenu = document.querySelector('nav .hidden.md\\:flex');

	if (mobileMenuBtn && navMenu) {
		mobileMenuBtn.addEventListener('click', function () {
			navMenu.classList.toggle('hidden');
			navMenu.classList.toggle('flex');
			navMenu.classList.toggle('flex-col');
			navMenu.classList.toggle('absolute');
			navMenu.classList.toggle('top-16');
			navMenu.classList.toggle('left-0');
			navMenu.classList.toggle('right-0');
			navMenu.classList.toggle('bg-white');
			navMenu.classList.toggle('dark:bg-background-dark');
			navMenu.classList.toggle('p-6');
			navMenu.classList.toggle('gap-4');
			navMenu.classList.toggle('border-b');
			navMenu.classList.toggle('border-slate-200');
		});
	}

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});
});
