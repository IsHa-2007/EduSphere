document.addEventListener('DOMContentLoaded', function() {
    loadTeacherStats();
    loadTeacherHomeClasses();
    loadTeacherHomeAnnouncements();
});

function loadTeacherStats() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');

    const totalStudents = classes.reduce((sum, cls) => sum + cls.students.length, 0);
    const pendingDoubts = doubts.filter(d => d.answer === '').length;

    const el1 = document.getElementById('totalStudents');
    const el2 = document.getElementById('totalClasses');
    const el3 = document.getElementById('pendingDoubts');
    const el4 = document.getElementById('totalQuizzes');

    if (el1) el1.textContent = totalStudents;
    if (el2) el2.textContent = classes.length;
    if (el3) el3.textContent = pendingDoubts;
    if (el4) el4.textContent = quizzes.length;
}

function loadTeacherHomeClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('teacherHomeClasses');
    if (!container) return;

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes created yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => `
        <div class="announcement-item">
            <p class="ann-item-title">${cls.name} <span class="ann-badge general">${cls.subject}</span></p>
            <p class="ann-item-meta">${cls.students.length} students · Code: ${cls.code}</p>
        </div>
    `).join('');
}

function loadTeacherHomeAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const container = document.getElementById('teacherHomeAnnouncements');
    if (!container) return;

    if (announcements.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No announcements yet.</p></div>';
        return;
    }

    container.innerHTML = announcements.slice(0, 3).map(a => `
        <div class="announcement-item">
            <p class="ann-item-title">${a.title} <span class="ann-badge ${a.type}">${a.type}</span></p>
            <p class="ann-item-meta">${a.time}</p>
        </div>
    `).join('');
}