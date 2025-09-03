document.addEventListener('DOMContentLoaded', () => {
	setCurrentYear();
	setupHireMeAlert();
	setupMobileNavToggle();
	setupSlider();
	setupBackToTop();
	setupFormValidation();
	setupImageModal();

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
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const nameInput = form.querySelector('#name');
		const emailInput = form.querySelector('#email');
		const messageInput = form.querySelector('#message');

		let hasError = false;

		hasError = validateRequired(nameInput, 'Please enter your name.') || hasError;
		hasError = validateRequired(emailInput, 'Please enter your email.') || hasError;
		hasError = validateRequired(messageInput, 'Please enter a message.') || hasError;

		if (!hasError) {
			alert('Thank you! Your message has been sent.');
			form.reset();
			clearErrors(form);
		}
	});

	['input', 'blur'].forEach((evt) => {
		form.addEventListener(evt, (e) => {
			const target = e.target;
			if (!(target instanceof HTMLElement)) return;
			if (target.matches('#name, #email, #message')) {
				validateRequired(target, 'This field is required.');
			}
		});
	});
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
	document.querySelectorAll('.view-more-btn').forEach(btn => {
		btn.addEventListener('click', function() {
			const projectType = this.getAttribute('data-project');
			openProjectModal(projectType);
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

	function openProjectModal(projectType) {
		switch(projectType) {
			case 'graphic-design':
				// For Graphic Design, use the carousel images
				const graphicCard = document.querySelector('.card:has(.carousel)');
				if (graphicCard) {
					const carouselImages = Array.from(graphicCard.querySelectorAll('.carousel-images img')).map(img => ({
						src: img.src,
						alt: img.alt
					}));
					currentImages = carouselImages;
					currentIndex = 0;
				}
				break;
			case 'application-design':
				// For Application Design, use the single image
				const appCard = document.querySelector('.card:has(img[src*="unsplash.com/photo-1512941937669"])');
				if (appCard) {
					const img = appCard.querySelector('img');
					currentImages = [{
						src: img.src,
						alt: img.alt
					}];
					currentIndex = 0;
				}
				break;
			case 'web-development':
				// For Web Development, use the single image
				const webCard = document.querySelector('.card:has(img[src*="unsplash.com/photo-1467232004584"])');
				if (webCard) {
					const img = webCard.querySelector('img');
					currentImages = [{
						src: img.src,
						alt: img.alt
					}];
					currentIndex = 0;
				}
				break;
		}

		updateModalImage();
		modal.style.display = 'block';
		document.body.style.overflow = 'hidden';
	}
}


