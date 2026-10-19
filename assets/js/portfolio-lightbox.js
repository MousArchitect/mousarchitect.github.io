(function () {
	var modal = document.getElementById('portfolio-lightbox');
	var triggers = Array.prototype.slice.call(document.querySelectorAll('.portfolio-lightbox-trigger'));
	if (!modal || !triggers.length) return;

	var panel = modal.querySelector('.portfolio-lightbox-panel');
	var image = modal.querySelector('.portfolio-lightbox-image');
	var title = modal.querySelector('#portfolio-lightbox-title');
	var category = modal.querySelector('.portfolio-lightbox-category');
	var closeButton = modal.querySelector('.portfolio-lightbox-close');
	var previousButton = modal.querySelector('.portfolio-lightbox-prev');
	var nextButton = modal.querySelector('.portfolio-lightbox-next');
	var lastTrigger = null;
	var currentTrigger = null;
	var closeTimer = null;
	var transitionId = 0;

	function visibleTriggers() {
		return triggers.filter(function (trigger) {
			var project = trigger.closest('article');
			return project && !project.classList.contains('is-filtered-out');
		});
	}

	function updateNavigation() {
		var visible = visibleTriggers();
		var index = visible.indexOf(currentTrigger);
		previousButton.disabled = index <= 0;
		nextButton.disabled = index === -1 || index >= visible.length - 1;
	}

	function showTrigger(trigger) {
		currentTrigger = trigger;
		image.src = trigger.getAttribute('data-image');
		image.alt = trigger.getAttribute('data-title') + ' preview';
		title.textContent = trigger.getAttribute('data-title');
		category.textContent = trigger.getAttribute('data-category');
		updateNavigation();
	}

	function closeModal() {
		transitionId++;
		image.classList.remove('is-slide-out-left', 'is-slide-out-right', 'is-slide-in-left', 'is-slide-in-right');
		modal.classList.remove('is-visible');
		modal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('is-lightbox-open');
		window.clearTimeout(closeTimer);
		closeTimer = window.setTimeout(function () {
			if (!modal.classList.contains('is-visible')) modal.hidden = true;
		}, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350);
		if (lastTrigger && !lastTrigger.closest('article').classList.contains('is-filtered-out')) lastTrigger.focus();
	}

	function openModal(trigger) {
		window.clearTimeout(closeTimer);
		lastTrigger = trigger;
		showTrigger(trigger);
		modal.hidden = false;
		modal.classList.add('is-visible');
		modal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('is-lightbox-open');
		closeButton.focus();
	}

	function transitionTo(trigger, direction) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			showTrigger(trigger);
			return;
		}

		var currentTransition = ++transitionId;
		var exitClass = direction > 0 ? 'is-slide-out-left' : 'is-slide-out-right';
		var enterClass = direction > 0 ? 'is-slide-in-right' : 'is-slide-in-left';
		image.classList.remove('is-slide-in-left', 'is-slide-in-right');
		image.classList.add(exitClass);

		window.setTimeout(function () {
			if (currentTransition !== transitionId) return;
			showTrigger(trigger);
			image.classList.remove(exitClass);
			image.classList.add(enterClass);
			window.requestAnimationFrame(function () {
				if (currentTransition === transitionId) image.classList.remove(enterClass);
			});
		}, 175);
	}

	function navigate(direction) {
		var visible = visibleTriggers();
		var index = visible.indexOf(currentTrigger);
		var target = visible[index + direction];
		if (target) transitionTo(target, direction);
	}

	triggers.forEach(function (trigger) {
		trigger.addEventListener('click', function () {
			openModal(trigger);
		});
	});

	closeButton.addEventListener('click', closeModal);
	previousButton.addEventListener('click', function () { navigate(-1); });
	nextButton.addEventListener('click', function () { navigate(1); });
	modal.addEventListener('click', function (event) {
		if (event.target === modal) closeModal();
	});
	panel.addEventListener('click', function (event) {
		event.stopPropagation();
	});
	document.addEventListener('keydown', function (event) {
		if (!modal.classList.contains('is-visible')) return;
		if (event.key === 'Escape') closeModal();
		if (event.key === 'ArrowLeft' && !previousButton.disabled) {
			event.preventDefault();
			navigate(-1);
		}
		if (event.key === 'ArrowRight' && !nextButton.disabled) {
			event.preventDefault();
			navigate(1);
		}
	});
}());
