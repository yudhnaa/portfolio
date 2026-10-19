// ==========================================
// Navigation & Keyboard Shortcuts
// ==========================================

import { openResumeModal, closeResumeModal, isResumeModalActive } from './resume-modal.js';
import { selectStack } from './topology.js';

export function initNavigation() {
	// Mobile menu handling
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
			'dark:bg-surface-dark',
			'p-6',
			'gap-4',
			'border-b',
			'border-slate-200',
			'dark:border-white/10',
			'shadow-xl'
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

	// Smooth anchor navigation
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			const href = this.getAttribute('href');
			if (href === '#') return;
			e.preventDefault();
			const target = document.querySelector(href);
			if (target) {
				const offset = 80;
				const bodyRect = document.body.getBoundingClientRect().top;
				const elementRect = target.getBoundingClientRect().top;
				const elementPosition = elementRect - bodyRect;
				const offsetPosition = elementPosition - offset;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth'
				});
			}
		});
	});

	// Global Keyboard Shortcuts
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && isResumeModalActive()) {
			e.preventDefault();
			closeResumeModal();
			return;
		}

		const tag = e.target.tagName.toLowerCase();
		if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;

		const key = e.key.toLowerCase();
		if (key === 'p') {
			e.preventDefault();
			document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
		} else if (key === 'r') {
			e.preventDefault();
			if (isResumeModalActive()) {
				closeResumeModal();
			} else {
				openResumeModal('java');
			}
		} else if (key === 'c') {
			e.preventDefault();
			document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
		} else if (key === '1') {
			e.preventDefault();
			selectStack(0);
		} else if (key === '2') {
			e.preventDefault();
			selectStack(1);
		} else if (key === '3') {
			e.preventDefault();
			selectStack(2);
		}
	});
}
