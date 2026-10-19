// ==========================================
// Resume Dropdown & Popup Modal (Dual Iframe)
// ==========================================

export const RESUME_DATA = {
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

export const setResumeTrack = (track) => {
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

export const toggleResumeDropdown = (forceState) => {
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

export const openResumeModal = (track = 'java') => {
	if (!resumeModal) return;
	toggleResumeDropdown(false);
	setResumeTrack(track);
	resumeModal.classList.add('active');
	document.body.classList.add('modal-open');
	const activeBtn = document.querySelector(`.seg.resume-mode button[data-resume="${track}"]`);
	setTimeout(() => updateResumeSegIndicator(activeBtn), 50);
	window.umami?.track('resume_modal_opened', { track });
};

export const closeResumeModal = () => {
	if (!resumeModal) return;
	resumeModal.classList.remove('active');
	document.body.classList.remove('modal-open');
	window.umami?.track('resume_modal_closed');
};

export const isResumeModalActive = () => {
	return resumeModal && resumeModal.classList.contains('active');
};

export function initResumeModal() {
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
