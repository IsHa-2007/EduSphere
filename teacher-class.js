document.addEventListener('DOMContentLoaded', function() {
    loadClasses();
});

function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createClass() {
    const className = document.getElementById('class-name').value.trim();
    const subject = document.getElementById('class-subject').value.trim();

    if (className === '' || subject === '') {
        alert('Please fill in all fields!');
        return;
    }

    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const newClass = {
        id: Date.now(),
        name: className,
        subject: subject,
        code: generateCode(),
        teacher: localStorage.getItem('name') || 'Teacher',
        students: [],
        time: new Date().toLocaleString()
    };

    classes.push(newClass);
    localStorage.setItem('teacherClasses', JSON.stringify(classes));

    document.getElementById('class-name').value = '';
    document.getElementById('class-subject').value = '';

    loadClasses();
}

function loadClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('classList');

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes created yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => `
        <div class="class-card">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.students.length} students</p>
            </div>
            <div class="class-code">
                <span>Join Code:</span>
                <strong>${cls.code}</strong>
            </div>
        </div>
    `).join('');
}