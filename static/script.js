/**
 * Bundled Distribution Script
 * Generated automatically from static/js/*.js by build.js
 * Compatible with file://, localhost, and GitHub Pages
 */

// --- Source: static/js/tailwind.config.js ---
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

// --- Source: static/js/resume-modal.js ---
// ==========================================
// Resume Dropdown & Popup Modal (Dual Iframe)
// ==========================================

const RESUME_DATA = {
	java: {
		title: 'Java Backend & Microservices Resume',
		embedUrl: 'https://drive.google.com/file/d/1AXolONUb5bktEMMGZB1CWUdH4Snm4pLc/preview?usp=embed_googleplus',
		viewUrl: 'https://drive.google.com/file/d/1AXolONUb5bktEMMGZB1CWUdH4Snm4pLc/view'
	},
	python: {
		title: 'Python Backend & AI Resume',
		embedUrl: 'https://drive.google.com/file/d/1vTV3uCW8jJ4N0xQRdfDzi3Ty1QIHaodQ/preview?usp=embed_googleplus',
		viewUrl: 'https://drive.google.com/file/d/1vTV3uCW8jJ4N0xQRdfDzi3Ty1QIHaodQ/view'
	}
};

let currentResumeTrack = 'java';
const loadedTracks = { java: false, python: false };

let resumeModal;
let resumeDropdownBtn;
let resumeDropdownMenu;
let resumeDropdownArrow;
let resumeFrameJava;
let resumeFramePython;
let resumeIframeJava;
let resumeIframePython;
let resumeLoadingSpinner;
let resumeModalCloseBtn;
let resumeModalExternalBtn;
let resumeModalTitle;
let resumeSegIndicator;
let resumeSegButtons = [];

const updateResumeSegIndicator = (btn) => {
	if (!resumeSegIndicator || !btn) return;
	resumeSegIndicator.style.width = `${btn.offsetWidth}px`;
	resumeSegIndicator.style.transform = `translateX(${btn.offsetLeft}px)`;
};

const hideResumeSpinner = () => {
	if (resumeLoadingSpinner) {
		resumeLoadingSpinner.style.opacity = '0';
		resumeLoadingSpinner.style.pointerEvents = 'none';
	}
};

const showResumeSpinner = () => {
	if (resumeLoadingSpinner) {
		resumeLoadingSpinner.style.opacity = '1';
		resumeLoadingSpinner.style.pointerEvents = 'auto';
	}
};

const setResumeTrack = (track) => {
	if (!RESUME_DATA[track]) return;
	currentResumeTrack = track;
	const data = RESUME_DATA[track];

	if (resumeModalTitle) resumeModalTitle.textContent = data.title;
	if (resumeModalExternalBtn) resumeModalExternalBtn.href = data.viewUrl;

	resumeSegButtons.forEach(btn => {
		const isMatch = btn.getAttribute('data-resume') === track;
		btn.classList.toggle('on', isMatch);
		if (isMatch) updateResumeSegIndicator(btn);
	});

	// Toggle frames visibility without reloading
	if (resumeFrameJava) resumeFrameJava.classList.toggle('hidden', track !== 'java');
	if (resumeFramePython) resumeFramePython.classList.toggle('hidden', track !== 'python');

	const targetIframe = track === 'java' ? resumeIframeJava : resumeIframePython;
	if (targetIframe) {
		if (!targetIframe.getAttribute('src')) {
			showResumeSpinner();
			targetIframe.src = data.embedUrl;
			setTimeout(hideResumeSpinner, 1500);
		} else if (loadedTracks[track]) {
			hideResumeSpinner();
		} else {
			showResumeSpinner();
			setTimeout(hideResumeSpinner, 1000);
		}
	}

	// Background preload the other track so switching is instantaneous
	const otherTrack = track === 'java' ? 'python' : 'java';
	const otherIframe = otherTrack === 'java' ? resumeIframeJava : resumeIframePython;
	if (otherIframe && !otherIframe.getAttribute('src')) {
		setTimeout(() => {
			if (!otherIframe.getAttribute('src')) {
				otherIframe.src = RESUME_DATA[otherTrack].embedUrl;
			}
		}, 800);
	}
};

const toggleResumeDropdown = (forceState) => {
	if (!resumeDropdownMenu || !resumeDropdownBtn) return;
	const shouldOpen = forceState !== undefined ? forceState : resumeDropdownMenu.classList.contains('hidden');
	if (shouldOpen) {
		resumeDropdownMenu.classList.remove('hidden');
		resumeDropdownBtn.setAttribute('aria-expanded', 'true');
		if (resumeDropdownArrow) resumeDropdownArrow.classList.add('rotate-180');
	} else {
		resumeDropdownMenu.classList.add('hidden');
		resumeDropdownBtn.setAttribute('aria-expanded', 'false');
		if (resumeDropdownArrow) resumeDropdownArrow.classList.remove('rotate-180');
	}
};

const openResumeModal = (track = 'java') => {
	if (!resumeModal) return;
	toggleResumeDropdown(false);
	setResumeTrack(track);
	resumeModal.classList.add('active');
	document.body.classList.add('modal-open');
	const activeBtn = document.querySelector(`.seg.resume-mode button[data-resume="${track}"]`);
	setTimeout(() => updateResumeSegIndicator(activeBtn), 50);
	window.umami?.track('resume_modal_opened', { track });
};

const closeResumeModal = () => {
	if (!resumeModal) return;
	resumeModal.classList.remove('active');
	document.body.classList.remove('modal-open');
	window.umami?.track('resume_modal_closed');
};

const isResumeModalActive = () => {
	return resumeModal && resumeModal.classList.contains('active');
};

function initResumeModal() {
	resumeDropdownBtn = document.getElementById('resumeDropdownBtn');
	resumeDropdownMenu = document.getElementById('resumeDropdownMenu');
	resumeDropdownArrow = document.getElementById('resumeDropdownArrow');
	resumeModal = document.getElementById('resumeModal');
	resumeFrameJava = document.getElementById('resumeFrameJava');
	resumeFramePython = document.getElementById('resumeFramePython');
	resumeIframeJava = document.getElementById('resumeIframeJava');
	resumeIframePython = document.getElementById('resumeIframePython');
	resumeLoadingSpinner = document.getElementById('resumeLoadingSpinner');
	resumeModalCloseBtn = document.getElementById('resumeModalCloseBtn');
	resumeModalExternalBtn = document.getElementById('resumeModalExternalBtn');
	resumeModalTitle = document.getElementById('resumeModalTitle');
	resumeSegIndicator = document.getElementById('resumeSegIndicator');
	resumeSegButtons = document.querySelectorAll('.seg.resume-mode button');

	if (resumeIframeJava) {
		resumeIframeJava.addEventListener('load', () => {
			loadedTracks.java = true;
			if (currentResumeTrack === 'java') hideResumeSpinner();
		});
	}

	if (resumeIframePython) {
		resumeIframePython.addEventListener('load', () => {
			loadedTracks.python = true;
			if (currentResumeTrack === 'python') hideResumeSpinner();
		});
	}

	if (resumeDropdownBtn && resumeDropdownMenu) {
		resumeDropdownBtn.addEventListener('click', function (e) {
			e.stopPropagation();
			toggleResumeDropdown();
		});

		document.addEventListener('click', function (e) {
			if (!resumeDropdownBtn.contains(e.target) && !resumeDropdownMenu.contains(e.target)) {
				toggleResumeDropdown(false);
			}
		});

		const dropdownButtons = resumeDropdownMenu.querySelectorAll('[data-resume-track]');
		dropdownButtons.forEach(btn => {
			btn.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				const track = this.getAttribute('data-resume-track') || 'java';
				openResumeModal(track);
			});
		});
	}

	if (resumeModalCloseBtn) {
		resumeModalCloseBtn.addEventListener('click', closeResumeModal);
	}

	if (resumeModal) {
		resumeModal.addEventListener('click', (e) => {
			if (e.target === resumeModal) {
				closeResumeModal();
			}
		});
	}

	resumeSegButtons.forEach(btn => {
		btn.addEventListener('click', function () {
			const track = this.getAttribute('data-resume');
			setResumeTrack(track);
			window.umami?.track('resume_modal_track_changed', { track });
		});
	});

	window.addEventListener('resize', () => {
		const currentOn = document.querySelector('.seg.resume-mode button.on');
		if (currentOn) updateResumeSegIndicator(currentOn);
	});
}

// --- Source: static/js/topology.js ---
// ========================================================
// Interactive Canvas Topology Visualizer & Stack Filter
// ========================================================

let activeStackMode = 'all';
let segButtons = [];

const selectStack = (index) => {
	if (segButtons && segButtons[index]) {
		segButtons[index].click();
	}
};

function initTopology() {
	// Segmented Mode Switcher
	const segContainer = document.querySelector('.seg.mode');
	const segIndicator = document.getElementById('segIndicator');
	segButtons = document.querySelectorAll('.seg.mode button');

	const updateSegIndicator = (btn) => {
		if (!segIndicator || !btn) return;
		segIndicator.style.width = `${btn.offsetWidth}px`;
		segIndicator.style.transform = `translateX(${btn.offsetLeft}px)`;
	};

	const applyStackFilter = (stack) => {
		activeStackMode = stack;
		window.dispatchEvent(new CustomEvent('stackModeChange', { detail: { stack } }));
	};

	if (segContainer && segButtons.length > 0) {
		const initialBtn = document.querySelector('.seg.mode button.on') || segButtons[0];
		setTimeout(() => updateSegIndicator(initialBtn), 100);
		window.addEventListener('resize', () => {
			const currentOn = document.querySelector('.seg.mode button.on') || segButtons[0];
			updateSegIndicator(currentOn);
		});

		segButtons.forEach(btn => {
			btn.addEventListener('click', function () {
				segButtons.forEach(b => b.classList.remove('on'));
				this.classList.add('on');
				updateSegIndicator(this);
				const stack = this.getAttribute('data-stack') || 'all';
				applyStackFilter(stack);
				window.umami?.track('stack_mode_switched', { stack });
			});
		});
	}

	// Canvas Topology Visualizer
	const canvas = document.getElementById('meshCanvas');
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	let width, height;
	let animationFrameId;

	const resizeCanvas = () => {
		const rect = canvas.getBoundingClientRect();
		width = rect.width;
		height = rect.height;
		canvas.width = width * window.devicePixelRatio;
		canvas.height = height * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	};

	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);

	// Architecture topology nodes positioned on an orbital radius around center
	const nodeDefs = [
		{ id: 'gateway', label: 'Gateway', sub: 'Reverse Proxy', angle: -Math.PI / 2, stack: 'all', color: '#2c5aa0', r: 6 },
		{ id: 'auth', label: 'Auth JWKS', sub: 'RS256', angle: -Math.PI * 0.76, stack: 'java', color: '#156cbd', r: 5.5 },
		{ id: 'spring', label: 'Spring Boot', sub: 'Services', angle: -Math.PI * 0.24, stack: 'java', color: '#2c5aa0', r: 6.5 },
		{ id: 'rabbitmq', label: 'RabbitMQ', sub: 'Broker', angle: -Math.PI * 0.05, stack: 'java', color: '#f59e0b', r: 5.5 },
		{ id: 'fastapi', label: 'FastAPI', sub: 'AI Core', angle: -Math.PI * 0.95, stack: 'python', color: '#34d399', r: 6.5 },
		{ id: 'rag', label: 'RAG / Lang', sub: 'Vectors', angle: Math.PI * 0.72, stack: 'python', color: '#f43f5e', r: 6 },
		{ id: 'celery', label: 'Celery', sub: 'Async Workers', angle: Math.PI * 0.28, stack: 'python', color: '#fb923c', r: 5.5 },
		{ id: 'postgres', label: 'PostgreSQL', sub: 'Relational DB', angle: Math.PI / 2, stack: 'all', color: '#818cf8', r: 6.5 }
	];

	const links = [
		{ from: 'gateway', to: 'auth' },
		{ from: 'gateway', to: 'spring' },
		{ from: 'gateway', to: 'fastapi' },
		{ from: 'auth', to: 'spring' },
		{ from: 'spring', to: 'rabbitmq' },
		{ from: 'rabbitmq', to: 'celery' },
		{ from: 'spring', to: 'postgres' },
		{ from: 'fastapi', to: 'rag' },
		{ from: 'rag', to: 'celery' },
		{ from: 'fastapi', to: 'postgres' },
		{ from: 'celery', to: 'postgres' }
	];

	// Light packets travelling on links
	const packets = links.map(link => ({
		from: link.from,
		to: link.to,
		t: Math.random(),
		speed: 0.004 + Math.random() * 0.004
	}));

	// Mouse coordinates
	let mouse = { x: -1000, y: -1000, active: false };
	canvas.addEventListener('mousemove', (e) => {
		const rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
		mouse.active = true;
	});

	canvas.addEventListener('mouseleave', () => {
		mouse.active = false;
	});

	let hoveredNode = null;
	canvas.addEventListener('mousemove', () => {
		const cx = width / 2;
		const cy = height / 2;
		const rx = Math.min(width * 0.42, 180);
		const ry = Math.min(height * 0.42, 140);

		hoveredNode = null;
		for (const node of nodeDefs) {
			const nx = cx + Math.cos(node.angle) * rx;
			const ny = cy + Math.sin(node.angle) * ry;
			const dist = Math.hypot(mouse.x - nx, mouse.y - ny);
			if (dist < node.r + 8) {
				hoveredNode = node.id;
				break;
			}
		}
		canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
	});

	let time = 0;

	const render = () => {
		time += 0.015;
		ctx.clearRect(0, 0, width, height);

		const isDark = document.documentElement.classList.contains('dark');
		const cx = width / 2;
		const cy = height / 2;
		const rx = Math.min(width * 0.42, 180);
		const ry = Math.min(height * 0.42, 140);

		// Compute node coordinates
		const nodeCoords = {};
		nodeDefs.forEach(node => {
			const breathe = Math.sin(time + node.angle * 2) * 1.5;
			const nx = cx + Math.cos(node.angle) * (rx + breathe);
			const ny = cy + Math.sin(node.angle) * (ry + breathe);
			nodeCoords[node.id] = { x: nx, y: ny, ...node };
		});

		// 1. Draw connecting links
		links.forEach(link => {
			const n1 = nodeCoords[link.from];
			const n2 = nodeCoords[link.to];
			if (!n1 || !n2) return;

			let linkAlpha = 0.22;
			if (activeStackMode !== 'all') {
				const matchesFilter = (n1.stack === activeStackMode || n1.stack === 'all') &&
									  (n2.stack === activeStackMode || n2.stack === 'all');
				linkAlpha = matchesFilter ? 0.45 : 0.05;
			}

			if (hoveredNode && (link.from === hoveredNode || link.to === hoveredNode)) {
				linkAlpha = 0.85;
			}

			ctx.beginPath();
			ctx.moveTo(n1.x, n1.y);
			ctx.lineTo(n2.x, n2.y);
			ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${linkAlpha})` : `rgba(30, 41, 59, ${linkAlpha})`;
			ctx.lineWidth = hoveredNode && (link.from === hoveredNode || link.to === hoveredNode) ? 1.5 : 1;
			ctx.stroke();
		});

		// 2. Animate packets
		packets.forEach(packet => {
			packet.t += packet.speed;
			if (packet.t > 1) packet.t = 0;

			const n1 = nodeCoords[packet.from];
			const n2 = nodeCoords[packet.to];
			if (!n1 || !n2) return;

			const isDimmed = activeStackMode !== 'all' &&
				(n1.stack !== activeStackMode && n1.stack !== 'all') &&
				(n2.stack !== activeStackMode && n2.stack !== 'all');
			if (isDimmed) return;

			const px = n1.x + (n2.x - n1.x) * packet.t;
			const py = n1.y + (n2.y - n1.y) * packet.t;

			ctx.beginPath();
			ctx.arc(px, py, 2, 0, Math.PI * 2);
			ctx.fillStyle = '#2c5aa0';
			ctx.shadowColor = '#2c5aa0';
			ctx.shadowBlur = 6;
			ctx.fill();
			ctx.shadowBlur = 0;
		});

		// 3. Draw nodes
		nodeDefs.forEach(node => {
			const coord = nodeCoords[node.id];
			const nx = coord.x;
			const ny = coord.y;

			const isSelected = activeStackMode === 'all' || node.stack === 'all' || node.stack === activeStackMode;
			const isHovered = hoveredNode === node.id;
			const nodeAlpha = isSelected ? 1 : 0.2;

			// Glow
			if (isSelected) {
				const glowGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.r * 2.8);
				glowGrad.addColorStop(0, `${node.color}55`);
				glowGrad.addColorStop(1, `${node.color}00`);
				ctx.beginPath();
				ctx.arc(nx, ny, node.r * 2.8, 0, Math.PI * 2);
				ctx.fillStyle = glowGrad;
				ctx.fill();
			}

			// Core circle
			ctx.beginPath();
			ctx.arc(nx, ny, isHovered ? node.r + 2 : node.r, 0, Math.PI * 2);
			ctx.fillStyle = node.color;
			ctx.globalAlpha = nodeAlpha;
			ctx.shadowColor = node.color;
			ctx.shadowBlur = isHovered ? 12 : 4;
			ctx.fill();
			ctx.shadowBlur = 0;
			ctx.globalAlpha = 1;

			// Node compact micro-label
			ctx.font = '600 9px "JetBrains Mono"';
			ctx.fillStyle = isDark ? `rgba(241, 245, 249, ${0.85 * nodeAlpha})` : `rgba(15, 23, 42, ${0.85 * nodeAlpha})`;
			ctx.textAlign = 'center';

			const labelY = ny > cy ? ny + node.r + 10 : ny - node.r - 5;
			ctx.fillText(node.label, nx, labelY);
		});

		animationFrameId = requestAnimationFrame(render);
	};

	render();

	window.addEventListener('stackModeChange', (e) => {
		activeStackMode = e.detail.stack;
	});
}

// --- Source: static/js/projects.js ---
// ==========================================
// Projects Carousel Scroller
// ==========================================

function initProjects() {
	const projectsScroller = document.getElementById('projectsScroller');
	const projectsTrack = document.getElementById('projectsTrack');
	const projectsScrollPrev = document.getElementById('projectsScrollPrev');
	const projectsScrollNext = document.getElementById('projectsScrollNext');

	if (!projectsScroller || !projectsTrack || !projectsScrollPrev || !projectsScrollNext) {
		return;
	}

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

// --- Source: static/js/navigation.js ---
// ==========================================
// Navigation & Keyboard Shortcuts
// ==========================================


function initNavigation() {
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

// --- Source: static/js/main.js ---
// ==========================================
// Main Application Entry Point
// ==========================================


document.addEventListener('DOMContentLoaded', () => {
	initNavigation();
	initProjects();
	initResumeModal();
	initTopology();
});
