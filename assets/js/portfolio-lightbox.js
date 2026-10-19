(function () {
	var modal = document.getElementById('portfolio-lightbox');
	var triggers = document.querySelectorAll('.portfolio-lightbox-trigger');
	if (!modal || !triggers.length) return;

	var panel = modal.querySelector('.portfolio-lightbox-panel');
	var image = modal.querySelector('.portfolio-lightbox-image');
	var title = modal.querySelector('#portfolio-lightbox-title');
	var category = modal.querySelector('.portfolio-lightbox-category');
	var closeButton = modal.querySelector('.portfolio-lightbox-close');
	var lastTrigger = null;
	var closeTimer = null;

	function closeModal() {
		modal.classList.remove('is-visible');
		modal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('is-lightbox-open');
		window.clearTimeout(closeTimer);
		closeTimer = window.setTimeout(function () {
			if (!modal.classList.contains('is-visible')) modal.hidden = true;
		}, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350);
		if (lastTrigger) lastTrigger.focus();
	}

	function openModal(trigger) {
		window.clearTimeout(closeTimer);
		lastTrigger = trigger;
		image.src = trigger.getAttribute('data-image');
		image.alt = trigger.getAttribute('data-title') + ' preview';
		title.textContent = trigger.getAttribute('data-title');
		category.textContent = trigger.getAttribute('data-category');
		modal.hidden = false;
		modal.classList.add('is-visible');
		modal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('is-lightbox-open');
		closeButton.focus();
	}

	triggers.forEach(function (trigger) {
		trigger.addEventListener('click', function () {
			openModal(trigger);
		});
	});

	closeButton.addEventListener('click', closeModal);
	modal.addEventListener('click', function (event) {
		if (event.target === modal) closeModal();
	});
	panel.addEventListener('click', function (event) {
		event.stopPropagation();
	});
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' && modal.classList.contains('is-visible')) closeModal();
	});
}());
