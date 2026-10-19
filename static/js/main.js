// ==========================================
// Main Application Entry Point
// ==========================================

import { initNavigation } from './navigation.js';
import { initProjects } from './projects.js';
import { initResumeModal } from './resume-modal.js';
import { initTopology } from './topology.js';

document.addEventListener('DOMContentLoaded', () => {
	initNavigation();
	initProjects();
	initResumeModal();
	initTopology();
});
