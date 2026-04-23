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
	const navMenu = document.querySelector('header nav');

	if (mobileMenuBtn && navMenu) {
		const mobileMenuClasses = [
			'flex',
			'flex-col',
			'absolute',
			'top-16',
			'left-0',
			'right-0',
			'bg-white',
			'dark:bg-background-dark',
			'p-6',
			'gap-4',
			'border-b',
			'border-slate-200',
			'dark:border-slate-800'
		];

		const closeMobileMenu = () => {
			navMenu.classList.add('hidden');
			navMenu.classList.remove(...mobileMenuClasses);
			mobileMenuBtn.setAttribute('aria-expanded', 'false');
		};

		const openMobileMenu = () => {
			navMenu.classList.remove('hidden');
			navMenu.classList.add(...mobileMenuClasses);
			mobileMenuBtn.setAttribute('aria-expanded', 'true');
		};

		const isMenuOpen = () => !navMenu.classList.contains('hidden') && navMenu.classList.contains('absolute');

		mobileMenuBtn.addEventListener('click', function () {
			if (isMenuOpen()) {
				closeMobileMenu();
			} else {
				openMobileMenu();
			}
			window.umami?.track('mobile_menu_toggled', {
				state: isMenuOpen() ? 'open' : 'closed'
			});
		});

		navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
			link.addEventListener('click', function () {
				if (window.innerWidth < 768) {
					closeMobileMenu();
				}
			});
		});

		window.addEventListener('resize', function () {
			if (window.innerWidth >= 768) {
				navMenu.classList.remove(...mobileMenuClasses);
				navMenu.classList.remove('hidden');
				mobileMenuBtn.setAttribute('aria-expanded', 'false');
			} else if (!isMenuOpen()) {
				closeMobileMenu();
			}
		});

		if (window.innerWidth < 768) {
			closeMobileMenu();
		}
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

	const projectsScroller = document.getElementById('projectsScroller');
	const projectsTrack = document.getElementById('projectsTrack');
	const projectsScrollPrev = document.getElementById('projectsScrollPrev');
	const projectsScrollNext = document.getElementById('projectsScrollNext');

	if (projectsScroller && projectsTrack && projectsScrollPrev && projectsScrollNext) {
		const getScrollStep = () => {
			const firstProjectCard = projectsTrack.querySelector('div');
			if (!firstProjectCard) {
				return Math.max(320, projectsScroller.clientWidth * 0.85);
			}
			const trackStyle = window.getComputedStyle(projectsTrack);
			const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0');
			return firstProjectCard.getBoundingClientRect().width + gap;
		};

		const updateProjectScrollButtons = () => {
			const maxScrollLeft = projectsScroller.scrollWidth - projectsScroller.clientWidth;
			projectsScrollPrev.disabled = projectsScroller.scrollLeft <= 8;
			projectsScrollNext.disabled = projectsScroller.scrollLeft >= maxScrollLeft - 8;
		};

		const scrollProjects = (direction) => {
			projectsScroller.scrollBy({
				left: direction * getScrollStep(),
				behavior: 'smooth'
			});
		};

		projectsScrollPrev.addEventListener('click', () => scrollProjects(-1));
		projectsScrollNext.addEventListener('click', () => scrollProjects(1));
		projectsScroller.addEventListener('scroll', updateProjectScrollButtons, { passive: true });
		window.addEventListener('resize', updateProjectScrollButtons);
		updateProjectScrollButtons();
	}
});
