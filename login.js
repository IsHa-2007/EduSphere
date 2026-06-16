function login() {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const savedEmail = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (email === '' || password === '') {
        alert('Please fill in all fields.');
        return;
    }

    if (email === savedEmail) {
        if (role.toLowerCase() === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (role.toLowerCase() === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        } else if (role.toLocaleLowerCase() === 'institution'){
            window.location.href ='admin-dashboard.html';
        } else {
            alert('Invalid role.');
        }
    } else {
        alert('Email not found. Please register first.');
    }
}