(function () {
	var filters = document.querySelectorAll('.portfolio-filters [data-filter]');
	var projects = document.querySelectorAll('.tiles [data-categories]');
	if (!filters.length || !projects.length) return;

	filters.forEach(function (filter) {
		filter.addEventListener('click', function () {
			var selected = filter.getAttribute('data-filter');

			filters.forEach(function (button) {
				var active = button === filter;
				button.classList.toggle('is-active', active);
				button.setAttribute('aria-pressed', active ? 'true' : 'false');
			});

			projects.forEach(function (project) {
				var categories = project.getAttribute('data-categories').split(' ');
				var visible = selected === 'all' || categories.indexOf(selected) !== -1;
				project.classList.toggle('is-filtered-out', !visible);
				project.setAttribute('aria-hidden', visible ? 'false' : 'true');
			});
		});
	});
}());
