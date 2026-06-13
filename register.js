function setRole(role, btn) {
    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    btn.classList.add('active');

    const label = document.getElementById('id-label');
    const input = document.getElementById('id-input');

    if (role === 'student') {
        label.textContent = 'Roll Number';
        input.placeholder = 'Enter your roll number';
    } else if (role === 'teacher') {
        label.textContent = 'Employee ID';
        input.placeholder = 'Enter your employee ID';
    } else if (role === 'institution') {
        label.textContent = 'institution Code';
        input.placeholder = 'Enter your institution code';
    }
}

function register() {
    const name = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const role = document.querySelector('.role-tab.active').textContent.toLowerCase();

    if (name === '' || email === '' || password === '') {
        alert('Please fill in all fields.');
        return;
    }

    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    localStorage.setItem('role', role);

    window.location.href = 'login.html';
}