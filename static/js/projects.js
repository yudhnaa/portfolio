// ==========================================
// Projects Carousel Scroller
// ==========================================

export function initProjects() {
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
