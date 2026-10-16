(function () {
	var filters = document.querySelectorAll('.portfolio-filters [data-filter]');
	var projects = document.querySelectorAll('.tiles [data-categories]');
	var changeId = 0;
	if (!filters.length || !projects.length) return;

	filters.forEach(function (filter) {
		filter.addEventListener('click', function () {
			var selected = filter.getAttribute('data-filter');
			var currentChange = ++changeId;
			var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			filters.forEach(function (button) {
				var active = button === filter;
				button.classList.toggle('is-active', active);
				button.setAttribute('aria-pressed', active ? 'true' : 'false');
			});

			projects.forEach(function (project) {
				var categories = project.getAttribute('data-categories').split(' ');
				var visible = selected === 'all' || categories.indexOf(selected) !== -1;
				var finish = function () {
					if (currentChange !== changeId) return;
					project.classList.remove('is-filtering-in', 'is-filtering-out');
					project.classList.toggle('is-filtered-out', !visible);
				};

				project.setAttribute('aria-hidden', visible ? 'false' : 'true');
				project.classList.remove('is-filtering-in', 'is-filtering-out');

				if (reducedMotion) {
					finish();
					return;
				}

				if (visible) {
					project.classList.remove('is-filtered-out');
					project.classList.add('is-filtering-in');
					window.requestAnimationFrame(function () {
						if (currentChange === changeId) project.classList.remove('is-filtering-in');
					});
				} else {
					project.classList.remove('is-filtered-out');
					project.classList.add('is-filtering-out');
					window.setTimeout(finish, 350);
				}
			});
		});
	});
}());
