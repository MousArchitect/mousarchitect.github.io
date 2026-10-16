(function () {
	var form = document.getElementById('contact-form');
	if (!form) return;
	var status = document.getElementById('form-status');
	var button = form.querySelector('button[type="submit"]');
	if (/[?&]sent=1/.test(location.search) && status) status.textContent = 'Thanks! Your message was sent. I\'ll reply by email soon.';

	form.addEventListener('submit', function (event) {
		if (!window.fetch) return;
		event.preventDefault();
		if (form._honey && form._honey.value) return;
		button.disabled = true;
		status.textContent = 'Sending...';
		fetch('https://formsubmit.co/ajax/mousarchitect.info@gmail.com', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			body: JSON.stringify({
				name: form.name.value.trim(),
				email: form.email.value.trim(),
				message: form.message.value.trim(),
				_subject: 'New website inquiry from ' + form.name.value.trim(),
				_replyto: form.email.value.trim(),
				_template: 'table'
			})
		}).then(function (r) { return r.json(); }).then(function (data) {
			if (data && (data.success === true || data.success === 'true')) {
				form.reset();
				status.textContent = 'Thanks! Your message was sent. I\'ll reply by email soon.';
			} else { throw new Error('failed'); }
		}).catch(function () {
			status.innerHTML = 'Sorry, something went wrong. Please email <a href="mailto:mousarchitect.info@gmail.com">mousarchitect.info@gmail.com</a> directly.';
		}).then(function () { button.disabled = false; });
	});
}());
