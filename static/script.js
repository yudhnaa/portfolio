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

document.addEventListener('DOMContentLoaded', function () {
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

	// Projects carousel scroller
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

	// Resume dropdown toggle
	const resumeDropdownBtn = document.getElementById('resumeDropdownBtn');
	const resumeDropdownMenu = document.getElementById('resumeDropdownMenu');
	const resumeDropdownArrow = document.getElementById('resumeDropdownArrow');

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
	}

	// ==========================================
	// MASH LOOP PATTERN: Segmented Mode Switcher
	// ==========================================
	const segContainer = document.querySelector('.seg.mode');
	const segIndicator = document.getElementById('segIndicator');
	const segButtons = document.querySelectorAll('.seg.mode button');
	let activeStackMode = 'all';

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

	// ==========================================
	// MASH LOOP PATTERN: Keyboard Shortcuts
	// ==========================================
	document.addEventListener('keydown', function (e) {
		const tag = e.target.tagName.toLowerCase();
		if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;

		const key = e.key.toLowerCase();
		if (key === 'p') {
			e.preventDefault();
			document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
		} else if (key === 'r') {
			e.preventDefault();
			toggleResumeDropdown();
		} else if (key === 'c') {
			e.preventDefault();
			document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
		} else if (key === '1') {
			e.preventDefault();
			segButtons[0]?.click();
		} else if (key === '2') {
			e.preventDefault();
			segButtons[1]?.click();
		} else if (key === '3') {
			e.preventDefault();
			segButtons[2]?.click();
		}
	});

	// ========================================================
	// MASH LOOP PATTERN: Interactive Canvas Topology Visualizer
	// ========================================================
	const canvas = document.getElementById('meshCanvas');
	if (canvas) {
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
			mouse.x = -1000;
			mouse.y = -1000;
		});

		let pulseAngle = 0;

		const getNodePos = (id, cx, cy, rx, ry) => {
			if (id === 'center') return { x: cx, y: cy };
			const def = nodeDefs.find(n => n.id === id);
			if (!def) return { x: cx, y: cy };
			return {
				x: cx + Math.cos(def.angle) * rx,
				y: cy + Math.sin(def.angle) * ry
			};
		};

		const render = () => {
			pulseAngle += 0.025;
			ctx.clearRect(0, 0, width, height);

			const cx = width / 2;
			const cy = height / 2;
			const rx = Math.min(width * 0.38, 170);
			const ry = Math.min(height * 0.38, 160);

			const isDark = document.documentElement.classList.contains('dark');
			const baseLineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)';
			const activeLineColor = isDark ? 'rgba(44, 90, 160, 0.45)' : 'rgba(44, 90, 160, 0.35)';

			// Render orbital guideline rings
			ctx.beginPath();
			ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
			ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.03)';
			ctx.lineWidth = 1;
			ctx.setLineDash([3, 4]);
			ctx.stroke();
			ctx.setLineDash([]);

			// Render links
			links.forEach(link => {
				const p1 = getNodePos(link.from, cx, cy, rx, ry);
				const p2 = getNodePos(link.to, cx, cy, rx, ry);

				const n1 = nodeDefs.find(n => n.id === link.from);
				const n2 = nodeDefs.find(n => n.id === link.to);

				const isHighlighted = (activeStackMode === 'all') ||
					(activeStackMode === 'java' && ((n1 && n1.stack === 'java') || (n2 && n2.stack === 'java'))) ||
					(activeStackMode === 'python' && ((n1 && n1.stack === 'python') || (n2 && n2.stack === 'python')));

				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.strokeStyle = isHighlighted ? activeLineColor : baseLineColor;
				ctx.lineWidth = isHighlighted ? 1.2 : 0.8;
				ctx.stroke();
			});

			// Render traversing light packets
			packets.forEach(p => {
				p.t += p.speed;
				if (p.t > 1) p.t = 0;

				const p1 = getNodePos(p.from, cx, cy, rx, ry);
				const p2 = getNodePos(p.to, cx, cy, rx, ry);

				const px = p1.x + (p2.x - p1.x) * p.t;
				const py = p1.y + (p2.y - p1.y) * p.t;

				ctx.beginPath();
				ctx.arc(px, py, 1.8, 0, Math.PI * 2);
				ctx.fillStyle = '#2c5aa0';
				ctx.shadowColor = '#2c5aa0';
				ctx.shadowBlur = 6;
				ctx.fill();
				ctx.shadowBlur = 0;
			});

			// Render nodes
			nodeDefs.forEach((node, i) => {
				const basePos = getNodePos(node.id, cx, cy, rx, ry);
				let nx = basePos.x;
				let ny = basePos.y;

				// Gentle mouse magnetic attraction
				const dx = mouse.x - nx;
				const dy = mouse.y - ny;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < 90) {
					const force = (90 - dist) / 90;
					nx += (dx / dist) * force * 10;
					ny += (dy / dist) * force * 10;
				}

				const isMatch = (activeStackMode === 'all') || (node.stack === 'all') || (node.stack === activeStackMode);
				const nodeAlpha = isMatch ? 1 : 0.22;

				// Node outer harmonic ring
				const pulse = Math.sin(pulseAngle + i * 0.8) * 2;
				ctx.beginPath();
				ctx.arc(nx, ny, node.r + 3 + pulse, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(44, 90, 160, ${0.35 * nodeAlpha})`;
				ctx.lineWidth = 1;
				ctx.stroke();

				// Node core circle
				ctx.beginPath();
				ctx.arc(nx, ny, node.r, 0, Math.PI * 2);
				ctx.fillStyle = node.color;
				ctx.globalAlpha = nodeAlpha;
				ctx.shadowColor = node.color;
				ctx.shadowBlur = isMatch ? 12 : 0;
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
});
