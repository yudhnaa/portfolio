// Theme Switcher Functionality
const themeSwitcher = document.querySelector("#themeSwitcher");
const themeDropdown = document.querySelector("#themeDropdown");
const themeOptions = document.querySelectorAll(".theme-option");

// Theme definitions
const themes = {
	purple: {
		"--primary-color": "#667eea",
		"--secondary-color": "#764ba2",
		"--text-primary": "#333",
		"--text-secondary": "#666",
		"--bg-primary": "#fff",
		"--bg-secondary": "#f8f9fa",
	},
	navy: {
		"--primary-color": "#2c5aa0",
		"--secondary-color": "#1e3a5f",
		"--text-primary": "#333",
		"--text-secondary": "#666",
		"--bg-primary": "#fff",
		"--bg-secondary": "#f8f9fa",
	},
};

// Toggle theme dropdown
themeSwitcher.addEventListener("click", (e) => {
	e.stopPropagation();
	themeDropdown.classList.toggle("active");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
	if (!themeDropdown.contains(e.target) && !themeSwitcher.contains(e.target)) {
		themeDropdown.classList.remove("active");
	}
});

// Apply theme
function applyTheme(themeName) {
	const theme = themes[themeName];
	const root = document.documentElement;

	// Apply each CSS variable
	Object.entries(theme).forEach(([property, value]) => {
		root.style.setProperty(property, value);
	});

	// Update gradient variables that depend on primary/secondary colors
	const primaryColor = theme["--primary-color"];
	const secondaryColor = theme["--secondary-color"];
	root.style.setProperty(
		"--primary-gradient",
		`linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
	);

	// Update shadow color for primary theme
	if (primaryColor) {
		const rgb = hexToRgb(primaryColor);
		if (rgb) {
			root.style.setProperty(
				"--shadow-primary",
				`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
			);
		}
	}

	// Save theme preference
	localStorage.setItem("selectedTheme", themeName);

	// Update active state
	updateActiveTheme(themeName);
}

// Convert hex to RGB
function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

// Update active theme button
function updateActiveTheme(themeName) {
	themeOptions.forEach((option) => {
		option.classList.remove("active");
		if (option.dataset.theme === themeName) {
			option.classList.add("active");
		}
	});
}

// Handle theme option clicks
themeOptions.forEach((option) => {
	option.addEventListener("click", () => {
		const themeName = option.dataset.theme;
		applyTheme(themeName);
		themeDropdown.classList.remove("active");
	});
});

// Load saved theme on page load
window.addEventListener("load", () => {
	const savedTheme = localStorage.getItem("selectedTheme") || "navy";
	applyTheme(savedTheme);
});

// Keyboard shortcut for theme switcher (Alt + T)
document.addEventListener("keydown", (e) => {
	if (e.altKey && e.key === "t") {
		e.preventDefault();
		themeDropdown.classList.toggle("active");
	}
});

// Mobile Navigation Toggle
const mobileMenu = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

mobileMenu.addEventListener("click", () => {
	mobileMenu.classList.toggle("active");
	navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
	link.addEventListener("click", () => {
		mobileMenu.classList.remove("active");
		navMenu.classList.remove("active");
	});
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute("href"));
		if (target) {
			const headerOffset = 70;
			const elementPosition = target.getBoundingClientRect().top;
			const offsetPosition =
				elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	});
});

// Navbar Background on Scroll
window.addEventListener("scroll", () => {
	const navbar = document.querySelector(".navbar");
	if (window.scrollY > 50) {
		navbar.style.background = "var(--overlay-medium)";
		navbar.style.boxShadow = "0 2px 20px var(--shadow-light)";
	} else {
		navbar.style.background = "var(--overlay-light)";
		navbar.style.boxShadow = "none";
	}

	// Navigation Active Section Highlighting
	updateActiveNavLink();
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
	const sections = document.querySelectorAll("section[id]");
	const navLinks = document.querySelectorAll(".nav-link");

	let currentSection = "";
	const scrollY = window.scrollY;
	const windowHeight = window.innerHeight;
	const documentHeight = document.documentElement.scrollHeight;
	const headerOffset = 70; // Match the navbar height

	// Check if user is at the bottom of the page
	const isAtBottom = scrollY + windowHeight >= documentHeight - 50;

	if (isAtBottom) {
		// If at bottom, highlight the last section (contact)
		const lastSection = sections[sections.length - 1];
		currentSection = lastSection.getAttribute("id");
	} else {
		// Create an array of sections with their positions for easier processing
		const sectionData = Array.from(sections).map((section) => {
			const rect = section.getBoundingClientRect();
			const sectionTop = rect.top + scrollY;
			const sectionBottom = sectionTop + rect.height;
			const sectionId = section.getAttribute("id");

			return {
				id: sectionId,
				top: sectionTop,
				bottom: sectionBottom,
				element: section,
			};
		});

		// Sort sections by their position (should already be in order, but just to be safe)
		sectionData.sort((a, b) => a.top - b.top);

		// Find the active section
		for (let i = 0; i < sectionData.length; i++) {
			const section = sectionData[i];
			const nextSection = sectionData[i + 1];

			// Check if we're in this section's range
			const sectionStart = section.top - headerOffset;
			const sectionEnd = nextSection
				? nextSection.top - headerOffset
				: Infinity;

			if (scrollY >= sectionStart && scrollY < sectionEnd) {
				currentSection = section.id;
				break;
			}
		}

		// If no section was found (shouldn't happen, but as fallback)
		// Use the last section that we've passed
		if (!currentSection) {
			for (let i = sectionData.length - 1; i >= 0; i--) {
				if (scrollY >= sectionData[i].top - headerOffset) {
					currentSection = sectionData[i].id;
					break;
				}
			}
		}
	}

	// Remove active class from all nav links
	navLinks.forEach((link) => {
		link.classList.remove("active");
	});

	// Add active class to current section's nav link
	if (currentSection) {
		const activeLink = document.querySelector(
			`.nav-link[href="#${currentSection}"]`
		);
		if (activeLink) {
			activeLink.classList.add("active");
		}
	}
}

// Animate Elements on Scroll
const observerOptions = {
	threshold: 0.1,
	rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = "1";
			entry.target.style.transform = "translateY(0)";

			// Animate skill bars
			if (entry.target.classList.contains("skill-category")) {
				animateSkillBars(entry.target);
			}
		}
	});
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
	".project-card, .skill-category, .contact-item"
);
animateElements.forEach((el) => {
	el.style.opacity = "0";
	el.style.transform = "translateY(50px)";
	el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
	observer.observe(el);
});

// Animate Skill Bars
function animateSkillBars(skillCategory) {
	const skillBars = skillCategory.querySelectorAll(".skill-progress");
	skillBars.forEach((bar) => {
		const width = bar.getAttribute("data-width");
		setTimeout(() => {
			bar.style.width = width + "%";
		}, 300);
	});
}

// Typing Animation for Hero Title
function typeWriter(element, text, speed = 100) {
	// Parse the original text to identify parts
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = text;

	// Get the full text content
	const fullText = tempDiv.textContent || tempDiv.innerText || "";

	// Find where "Hoang Anh Duy" starts in the text
	const nameText = "Hoang Anh Duy";
	const nameStartIndex = fullText.indexOf(nameText);

	let i = 0;
	element.innerHTML = "";

	function type() {
		if (i < fullText.length) {
			const currentText = fullText.substring(0, i + 1);

			// Check if we're typing within the name part
			if (i >= nameStartIndex && i < nameStartIndex + nameText.length) {
				// We're typing the name - apply highlight
				const beforeName = fullText.substring(0, nameStartIndex);
				const typedNamePart = fullText.substring(nameStartIndex, i + 1);

				element.innerHTML =
					beforeName + '<span class="highlight">' + typedNamePart + "</span>";
			} else if (i >= nameStartIndex + nameText.length) {
				// We've finished typing the name - show complete structure
				const beforeName = fullText.substring(0, nameStartIndex);
				const name = nameText;
				const afterName = fullText.substring(
					nameStartIndex + nameText.length,
					i + 1
				);

				element.innerHTML =
					beforeName +
					'<span class="highlight">' +
					name +
					"</span>" +
					afterName;
			} else {
				// We're before the name - just show plain text
				element.textContent = currentText;
			}

			i++;
			setTimeout(type, speed);
		} else {
			// Ensure final HTML structure is correct
			element.innerHTML = text;
		}
	}
	type();
}

// Initialize typing animation when page loads
window.addEventListener("load", () => {
	// Wait for loading screen to complete before starting animations
	setTimeout(() => {
		const heroTitle = document.querySelector(".hero-title");
		const originalText = heroTitle.innerHTML;
		typeWriter(heroTitle, originalText, 50);

		// Set initial active nav link
		updateActiveNavLink();
	}, 1000); // Wait a bit longer to let hero-content animation start first
});

// Parallax Effect for Hero Section
window.addEventListener("scroll", () => {
	const scrolled = window.pageYOffset;
	const hero = document.querySelector(".hero");
	const rate = scrolled * -0.5;

	if (hero) {
		hero.style.transform = `translateY(${rate}px)`;
	}
});

// Contact Form Handling
const contactForm = document.getElementById("contactForm");
if (contactForm) {
	contactForm.addEventListener("submit", function (e) {
		e.preventDefault();

		// Get form data
		const formData = new FormData(this);
		const name = formData.get("name");
		const email = formData.get("email");
		const subject = formData.get("subject");
		const message = formData.get("message");

		// Simple validation
		if (!name || !email || !subject || !message) {
			showNotification("Please fill in all fields.", "error");
			return;
		}

		if (!isValidEmail(email)) {
			showNotification("Please enter a valid email address.", "error");
			return;
		}

		// Simulate form submission
		showNotification(
			"Message sent successfully! I'll get back to you soon.",
			"success"
		);
		this.reset();
	});
}

// Email validation function
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
	// Remove existing notifications
	const existingNotification = document.querySelector(".notification");
	if (existingNotification) {
		existingNotification.remove();
	}

	// Create notification element
	const notification = document.createElement("div");
	notification.className = `notification notification-${type}`;
	notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

	// Add styles
	notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

	if (type === "success") {
		notification.style.background =
			"linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
	} else if (type === "error") {
		notification.style.background =
			"linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)";
	} else {
		notification.style.background =
			"linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)";
	}

	// Add to page
	document.body.appendChild(notification);

	// Animate in
	setTimeout(() => {
		notification.style.transform = "translateX(0)";
	}, 100);

	// Add close functionality
	const closeBtn = notification.querySelector(".notification-close");
	closeBtn.addEventListener("click", () => {
		notification.style.transform = "translateX(400px)";
		setTimeout(() => notification.remove(), 300);
	});

	// Auto remove after 5 seconds
	setTimeout(() => {
		if (notification.parentNode) {
			notification.style.transform = "translateX(400px)";
			setTimeout(() => notification.remove(), 300);
		}
	}, 5000);
}

// Add smooth hover effects to project cards
document.querySelectorAll(".project-card").forEach((card) => {
	card.addEventListener("mouseenter", function () {
		this.style.transform = "translateY(-10px) scale(1.02)";
	});

	card.addEventListener("mouseleave", function () {
		this.style.transform = "translateY(0) scale(1)";
	});
});

// Add loading animation
window.addEventListener("load", () => {
	const loader = document.createElement("div");
	loader.className = "page-loader";
	loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;

	loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;

	const spinnerStyles = `
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loader-content {
            text-align: center;
            color: #333;
        }
    `;

	const style = document.createElement("style");
	style.textContent = spinnerStyles;
	document.head.appendChild(style);

	document.body.appendChild(loader);

	// Hide loader after page is fully loaded
	setTimeout(() => {
		loader.style.opacity = "0";
		setTimeout(() => {
			loader.remove();
			style.remove();
		}, 250);
	}, 500);
});

// Add scroll to top button
const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = "scroll-to-top";
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener("click", () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
});

// Show/hide scroll to top button
window.addEventListener("scroll", () => {
	if (window.pageYOffset > 300) {
		scrollToTopBtn.style.display = "flex";
	} else {
		scrollToTopBtn.style.display = "none";
	}
});

// Add hover effect to scroll to top button
scrollToTopBtn.addEventListener("mouseenter", () => {
	scrollToTopBtn.style.transform = "scale(1.1)";
});

scrollToTopBtn.addEventListener("mouseleave", () => {
	scrollToTopBtn.style.transform = "scale(1)";
});

// Preload images and optimize performance
const imageElements = document.querySelectorAll("img");
imageElements.forEach((img) => {
	img.loading = "lazy";
});

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		// Close mobile menu if open
		mobileMenu.classList.remove("active");
		navMenu.classList.remove("active");
	}
});

// Add focus management for accessibility
const focusableElements = document.querySelectorAll(
	'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
);

focusableElements.forEach((element) => {
	element.addEventListener("focus", () => {
		element.style.outline = "2px solid #667eea";
		element.style.outlineOffset = "2px";
	});

	element.addEventListener("blur", () => {
		element.style.outline = "none";
	});
});

console.log("Portfolio website loaded successfully! 🚀");
