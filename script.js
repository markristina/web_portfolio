document.addEventListener('DOMContentLoaded', () => {
	setCurrentYear();
	setupHireMeAlert();
	setupMobileNavToggle();
	setupSlider();
	setupBackToTop();
	setupFormValidation();
		setupImageModal();
		setupSmoothScroll();

	// Carousel logic for all carousels
	document.querySelectorAll('.carousel').forEach(carousel => {
		const images = carousel.querySelectorAll('.carousel-images img');
		let currentIndex = 0;

		function showImage(index) {
			images.forEach((img, i) => {
				img.classList.toggle('active', i === index);
			});
		}

		carousel.querySelector('.prev').addEventListener('click', () => {
			currentIndex = (currentIndex - 1 + images.length) % images.length;
			showImage(currentIndex);
		});

		carousel.querySelector('.next').addEventListener('click', () => {
			currentIndex = (currentIndex + 1) % images.length;
			showImage(currentIndex);
		});

		showImage(currentIndex);
	});
});

function setCurrentYear() {
	const yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}
}

// Smooth scrolling handler that accounts for the sticky header height
function setupSmoothScroll() {
	// Only handle same-page anchor links
	document.querySelectorAll('a[href^="#"]').forEach(link => {
		link.addEventListener('click', function(e) {
			const href = this.getAttribute('href');
			if (!href || href === '#') return;
			const target = document.querySelector(href);
			if (!target) return;

			// Prevent default jump
			e.preventDefault();

			// Calculate offset so the section clears the sticky header
			const header = document.querySelector('.site-header');
			const headerHeight = header ? header.offsetHeight : 0;
			const extraOffset = 12; // small breathing room
			const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;

			window.scrollTo({ top, behavior: 'smooth' });

			// Move focus for accessibility after scrolling
			setTimeout(() => {
				target.setAttribute('tabindex', '-1');
				target.focus({ preventScroll: true });
			}, 500);
		});
	});
}

function setupHireMeAlert() {
	const hireBtn = document.getElementById('hireMeBtn');
	if (!hireBtn) return;
	hireBtn.addEventListener('click', (e) => {
		alert('Thanks for reaching out! Please fill in the contact form below.');
	});
}

function setupMobileNavToggle() {
	const toggle = document.querySelector('.nav-toggle');
	const navbar = document.querySelector('.navbar');
	if (!toggle || !navbar) return;
	toggle.addEventListener('click', () => {
		const isOpen = navbar.classList.toggle('open');
		toggle.setAttribute('aria-expanded', String(isOpen));
	});
	// Close the menu on link click (mobile UX)
	const navLinks = document.querySelectorAll('.nav-links a');
	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			navbar.classList.remove('open');
			toggle.setAttribute('aria-expanded', 'false');
		});
	});
}

function setupSlider() {
	const slidesContainer = document.querySelector('.slides');
	const prevBtn = document.querySelector('.slider-btn.prev');
	const nextBtn = document.querySelector('.slider-btn.next');
	if (!slidesContainer || !prevBtn || !nextBtn) return;

	const slides = Array.from(slidesContainer.querySelectorAll('img'));
	let currentIndex = 0;

	function updateSlide() {
		slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
	}

	prevBtn.addEventListener('click', () => {
		currentIndex = (currentIndex - 1 + slides.length) % slides.length;
		updateSlide();
	});

	nextBtn.addEventListener('click', () => {
		currentIndex = (currentIndex + 1) % slides.length;
		updateSlide();
	});

	// Optional: auto-advance every 5s
	setInterval(() => {
		currentIndex = (currentIndex + 1) % slides.length;
		updateSlide();
	}, 5000);
}

function setupBackToTop() {
	const btn = document.getElementById('backToTop');
	if (!btn) return;
	window.addEventListener('scroll', () => {
		if (window.scrollY > 300) {
			btn.classList.add('show');
		} else {
			btn.classList.remove('show');
		}
	});
	btn.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
}

function setupFormValidation() {
	const form = document.getElementById('contactForm');
	if (!form) return;
	const submitBtn = document.getElementById('contactSubmit');
	const successEl = document.getElementById('formSuccess');

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		clearErrors(form);

		const nameInput = form.querySelector('#name');
		const emailInput = form.querySelector('#email');
		const messageInput = form.querySelector('#message');

		let firstInvalid = null;
		let hasError = false;

		if (!nameInput.value.trim()) {
			showError(nameInput, 'Please enter your name.');
			firstInvalid = firstInvalid || nameInput;
			hasError = true;
		}

		if (!emailInput.value.trim()) {
			showError(emailInput, 'Please enter your email.');
			firstInvalid = firstInvalid || emailInput;
			hasError = true;
		} else if (!validateEmail(emailInput.value)) {
			showError(emailInput, 'Please enter a valid email address.');
			firstInvalid = firstInvalid || emailInput;
			hasError = true;
		}

		if (!messageInput.value.trim()) {
			showError(messageInput, 'Please enter a message.');
			firstInvalid = firstInvalid || messageInput;
			hasError = true;
		}

		if (hasError) {
			if (firstInvalid) firstInvalid.focus();
			return;
		}

		// Simulate sending: disable button and show ephemeral success message
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.setAttribute('aria-busy', 'true');
			var originalText = submitBtn.textContent;
			submitBtn.textContent = 'Sending...';
		}

		setTimeout(() => {
			// show success message
			if (successEl) {
				successEl.hidden = false;
				successEl.classList.add('visible');
				setTimeout(() => {
					successEl.classList.remove('visible');
					successEl.hidden = true;
				}, 4000);
			}

			form.reset();
			clearErrors(form);

			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.removeAttribute('aria-busy');
				submitBtn.textContent = originalText;
			}
		}, 900);
	});

	['input', 'blur'].forEach((evt) => {
		form.addEventListener(evt, (e) => {
			const target = e.target;
			if (!(target instanceof HTMLElement)) return;
			if (target.matches('#name, #email, #message')) {
				validateField(target);
			}
		});
	});

	function validateField(input) {
		if (input.id === 'email') {
			if (!input.value.trim()) {
				showError(input, 'This field is required.');
				return true;
			}
			if (!validateEmail(input.value)) {
				showError(input, 'Enter a valid email.');
				return true;
			}
			showError(input, '');
			return false;
		} else {
			return validateRequired(input, 'This field is required.');
		}
	}

	function showError(input, message) {
		const formGroup = input.closest('.form-group');
		const errorEl = formGroup ? formGroup.querySelector('.error') : null;
		if (errorEl) errorEl.textContent = message;
		if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
	}

	function validateRequired(inputEl, message) {
		const formGroup = inputEl.closest('.form-group');
		const errorEl = formGroup ? formGroup.querySelector('.error') : null;
		if (!inputEl.value.trim()) {
			if (errorEl) errorEl.textContent = message;
			inputEl.setAttribute('aria-invalid', 'true');
			return true;
		} else {
			if (errorEl) errorEl.textContent = '';
			inputEl.removeAttribute('aria-invalid');
			return false;
		}
	}

	function validateEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
}

function validateRequired(inputEl, message) {
	const formGroup = inputEl.closest('.form-group');
	const errorEl = formGroup ? formGroup.querySelector('.error') : null;
	if (!inputEl.value.trim()) {
		if (errorEl) errorEl.textContent = message;
		inputEl.setAttribute('aria-invalid', 'true');
		return true;
	} else {
		if (errorEl) errorEl.textContent = '';
		inputEl.removeAttribute('aria-invalid');
		return false;
	}
}

function clearErrors(form) {
	form.querySelectorAll('.error').forEach((el) => (el.textContent = ''));
}

// Image Modal/Lightbox functionality
function setupImageModal() {
	const modal = document.getElementById('imageModal');
	const modalImg = document.getElementById('modalImage');
	const closeBtn = document.querySelector('.close-modal');
	const prevBtn = document.querySelector('.modal-prev');
	const nextBtn = document.querySelector('.modal-next');
	
	let currentImages = [];
	let currentIndex = 0;

	// Open modal when clicking on project images
	document.querySelectorAll('.card img, .carousel-images img').forEach(img => {
		img.addEventListener('click', function() {
			openModal(this.src, this.alt);
		});
	});

	// Open modal when clicking on "View More" buttons
	// Use images from the same .card as the clicked button to avoid brittle selectors
	document.querySelectorAll('.view-more-btn').forEach(btn => {
		btn.addEventListener('click', function(e) {
			// If this element is an anchor (<a>) and does NOT have a data-project attribute,
			// allow the link to proceed (this is used for external Visit Site links).
			const isAnchor = this.tagName && this.tagName.toLowerCase() === 'a';
			const hasProject = this.dataset && this.dataset.project;
			if (isAnchor && !hasProject) {
				// Let the anchor perform its default navigation (e.g. open external site)
				return;
			}

			// Otherwise, intercept the click to open the modal (buttons or anchors with data-project)
			if (e && typeof e.preventDefault === 'function') e.preventDefault();
			const card = this.closest('.card');
			if (!card) return;

			// Prefer carousel images if present, otherwise any img in the card
			const carousel = card.querySelector('.carousel');
			if (carousel) {
				currentImages = Array.from(carousel.querySelectorAll('img')).map(img => ({ src: img.src, alt: img.alt }));
				currentIndex = 0;
			} else {
				const imgs = Array.from(card.querySelectorAll('img'));
				if (imgs.length > 0) {
					currentImages = imgs.map(img => ({ src: img.src, alt: img.alt }));
					currentIndex = 0;
				} else {
					currentImages = [];
					currentIndex = 0;
				}
			}

			if (currentImages.length === 0) return;
			updateModalImage();
			modal.style.display = 'block';
			document.body.style.overflow = 'hidden';
		});
	});

	// Close modal
	closeBtn.addEventListener('click', closeModal);
	modal.addEventListener('click', function(e) {
		if (e.target === modal) {
			closeModal();
		}
	});

	// Navigation
	prevBtn.addEventListener('click', () => {
		currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
		updateModalImage();
	});

	nextBtn.addEventListener('click', () => {
		currentIndex = (currentIndex + 1) % currentImages.length;
		updateModalImage();
	});

	// Keyboard navigation
	document.addEventListener('keydown', function(e) {
		if (modal.style.display === 'block') {
			if (e.key === 'Escape') {
				closeModal();
			} else if (e.key === 'ArrowLeft') {
				currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
				updateModalImage();
			} else if (e.key === 'ArrowRight') {
				currentIndex = (currentIndex + 1) % currentImages.length;
				updateModalImage();
			}
		}
	});

	function openModal(src, alt) {
		// Get all images from the same project card
		const clickedImg = document.querySelector(`img[src="${src}"]`);
		const projectCard = clickedImg.closest('.card');
		
		if (projectCard) {
			// If it's a carousel, get all carousel images
			const carousel = projectCard.querySelector('.carousel');
			if (carousel) {
				currentImages = Array.from(carousel.querySelectorAll('img')).map(img => ({
					src: img.src,
					alt: img.alt
				}));
				currentIndex = currentImages.findIndex(img => img.src === src);
			} else {
				// Single image
				currentImages = [{
					src: src,
					alt: alt
				}];
				currentIndex = 0;
			}
		} else {
			// Fallback for single images
			currentImages = [{
				src: src,
				alt: alt
			}];
			currentIndex = 0;
		}

		updateModalImage();
		modal.style.display = 'block';
		document.body.style.overflow = 'hidden'; // Prevent scrolling
	}

	function closeModal() {
		modal.style.display = 'none';
		document.body.style.overflow = 'auto'; // Restore scrolling
	}

	function updateModalImage() {
		if (currentImages.length > 0) {
			modalImg.src = currentImages[currentIndex].src;
			modalImg.alt = currentImages[currentIndex].alt;
			
			// Show/hide navigation buttons based on number of images
			const navButtons = document.querySelectorAll('.modal-prev, .modal-next');
			navButtons.forEach(btn => {
				btn.style.display = currentImages.length > 1 ? 'flex' : 'none';
			});
		}
	}

	// The modal now derives images relative to the clicked element's card (see openModal and view-more handler).
	// The previous project-specific helper that used fragile selectors was removed to avoid maintenance issues.
}


