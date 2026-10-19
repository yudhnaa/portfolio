// ========================================================
// Interactive Canvas Topology Visualizer & Stack Filter
// ========================================================

let activeStackMode = 'all';
let segButtons = [];

export const selectStack = (index) => {
	if (segButtons && segButtons[index]) {
		segButtons[index].click();
	}
};

export function initTopology() {
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
