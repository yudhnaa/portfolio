#!/usr/bin/env node

/**
 * Lightweight File Watcher for Local Development
 * Automatically rebuilds index.html and static/script.js whenever any file in src/ or static/js/ changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('[WATCH] Watching src/ and static/js/ for changes... Press Ctrl+C to stop.');

let debounceTimeout = null;

function rebuild() {
	try {
		execSync('node build.js', { stdio: 'inherit' });
	} catch (err) {
		console.error('[WATCH ERROR]', err.message);
	}
}

// Initial build
rebuild();

const watchDirs = [
	path.join(__dirname, 'src'),
	path.join(__dirname, 'static', 'js')
];

watchDirs.forEach(dir => {
	if (fs.existsSync(dir)) {
		fs.watch(dir, { recursive: true }, (eventType, filename) => {
			if (filename && (filename.endsWith('.html') || filename.endsWith('.js'))) {
				if (debounceTimeout) clearTimeout(debounceTimeout);
				debounceTimeout = setTimeout(() => {
					console.log(`[WATCH] Change detected in ${filename}. Rebuilding...`);
					rebuild();
				}, 100);
			}
		});
	}
});
