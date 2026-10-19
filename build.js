#!/usr/bin/env node

/**
 * Zero-Dependency Builder for Duy Hoang Anh Portfolio
 * 1. Compiles src/template.html + src/components/*.html -> index.html
 * 2. Bundles modular static/js/*.js -> static/script.js
 *
 * Guarantees 100% compatibility with:
 * - Double-clicking index.html directly via file:// protocol (no CORS error)
 * - Local development servers (http://localhost:8000)
 * - GitHub Pages production deployment
 */

const fs = require('fs');
const path = require('path');

function buildHtml() {
	const templatePath = path.join(__dirname, 'src', 'template.html');
	if (!fs.existsSync(templatePath)) {
		console.error(`[ERROR] Template not found: ${templatePath}`);
		process.exit(1);
	}

	let template = fs.readFileSync(templatePath, 'utf-8');
	const includeRegex = /<!--\s*@include\s+([a-zA-Z0-9_\-\.\/]+)\s*-->/g;

	let includedCount = 0;
	const compiled = template.replace(includeRegex, (match, componentRelPath) => {
		const fullPath = path.join(__dirname, 'src', componentRelPath);
		if (!fs.existsSync(fullPath)) {
			console.warn(`[WARN] Component not found: ${fullPath}`);
			return match;
		}
		includedCount++;
		return fs.readFileSync(fullPath, 'utf-8');
	});

	const outputPath = path.join(__dirname, 'index.html');
	fs.writeFileSync(outputPath, compiled, 'utf-8');
	const lines = compiled.split('\n').length;
	console.log(`[HTML BUILD] Compiled ${includedCount} components into index.html (${lines} lines)`);
}

function buildJs() {
	const jsFiles = [
		'tailwind.config.js',
		'resume-modal.js',
		'topology.js',
		'projects.js',
		'navigation.js',
		'main.js'
	];

	const jsDir = path.join(__dirname, 'static', 'js');
	const combined = [];

	for (const fileName of jsFiles) {
		const filePath = path.join(jsDir, fileName);
		if (!fs.existsSync(filePath)) {
			console.warn(`[WARN] JS file not found: ${filePath}`);
			continue;
		}

		let code = fs.readFileSync(filePath, 'utf-8');
		// Strip ES import statements (e.g. import ... from '...';)
		code = code.replace(/import\s+[^;]+;\r?\n?/g, '');
		// Strip export keywords so all declarations stay in unified scope
		code = code.replace(/export\s+(const|let|var|function|class)\s+/g, '$1 ');
		code = code.replace(/export\s+default\s+/g, '');

		combined.push(`// --- Source: static/js/${fileName} ---\n` + code.trim());
	}

	const bundleContent = `/**
 * Bundled Distribution Script
 * Generated automatically from static/js/*.js by build.js
 * Compatible with file://, localhost, and GitHub Pages
 */

` + combined.join('\n\n') + '\n';

	const bundlePath = path.join(__dirname, 'static', 'script.js');
	fs.writeFileSync(bundlePath, bundleContent, 'utf-8');
	console.log(`[JS BUNDLE] Bundled ${jsFiles.length} modules into static/script.js (${bundleContent.split('\n').length} lines)`);
}

function build() {
	buildHtml();
	buildJs();
	console.log('[SUCCESS] All assets compiled successfully!');
}

build();
