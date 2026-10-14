(function () {
	var form = document.getElementById('contact-form');
	if (!form) return;

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		var name = document.getElementById('name').value.trim();
		var email = document.getElementById('email').value.trim();
		var message = document.getElementById('message').value.trim();
		var subject = 'Project inquiry from ' + name;
		var body = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;

		window.location.href = 'mailto:mousarchitect.info@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
	});
}());
