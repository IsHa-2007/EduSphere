document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('name');
    if (name) {
        const username = document.getElementById('username');
        if (username) username.textContent = name;
        const profileName = document.getElementById('profile-name');
        if (profileName) profileName.textContent = name;
    }

    loadDashboardStats();
    loadDashboardAnnouncements();
    loadUpcomingQuizzes();
});

function loadDashboardStats() {
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const studentName = localStorage.getItem('name') || '';
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    const teacherQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const myCodes = myClasses.map(c => c.code);
    const now = new Date();

    let totalPresent = 0, totalDays = 0;
    myClasses.forEach(cls => {
        const dateKeys = Object.keys(attendance).filter(k => k.startsWith(cls.code));
        totalDays += dateKeys.length;
        dateKeys.forEach(key => {
            if (attendance[key][studentName] === 'present') totalPresent++;
        });
    });
    const attendancePct = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

    const upcomingQuizzes = teacherQuizzes.filter(q =>
        myCodes.includes(q.classCode) && new Date(q.datetime) > now
    );

    const myQuizzes = submittedQuizzes.filter(q => q.studentName === studentName);
    const latestQuiz = myQuizzes.length > 0 ? myQuizzes[myQuizzes.length - 1] : null;
    const latestScore = latestQuiz ? Math.round((latestQuiz.score / latestQuiz.total) * 100) + '%' : '--';

    const el1 = document.getElementById('stat-attendance');
    const el2 = document.getElementById('stat-classes');
    const el3 = document.getElementById('stat-quizzes');
    const el4 = document.getElementById('stat-score');

    if (el1) el1.textContent = attendancePct + '%';
    if (el2) el2.textContent = myClasses.length;
    if (el3) el3.textContent = upcomingQuizzes.length;
    if (el4) el4.textContent = latestScore;
}

function loadDashboardAnnouncements() {
    const container = document.getElementById('announcements-section');
    if (!container) return;

    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const myCodes = myClasses.map(c => c.code);

    const myAnnouncements = announcements.filter(a =>
        !a.classCode || myCodes.includes(a.classCode)
    );

    if (myAnnouncements.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No announcements yet.</p></div>';
        return;
    }

    // show only latest 3 on home
    container.innerHTML = myAnnouncements.slice(0, 3).map(a => `
        <div class="announcement-item">
            <p class="ann-item-title">${a.title} <span class="ann-badge ${a.type}">${a.type}</span></p>
            <p class="ann-item-meta">${a.teacher} · ${a.time}</p>
        </div>
    `).join('') + (myAnnouncements.length > 3 ? 
        `<a href="student-announcements.html" style="font-size:12px;color:#0095ff;text-decoration:none;display:block;margin-top:12px;">View all announcements →</a>` : '');
}

function loadUpcomingQuizzes() {
    const container = document.getElementById('quizzes-section');
    if (!container) return;

    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const myCodes = myClasses.map(c => c.code);
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const now = new Date();

    const upcoming = quizzes.filter(q =>
        myCodes.includes(q.classCode) && new Date(q.datetime) > now
    );

    if (upcoming.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No upcoming quizzes.</p></div>';
        return;
    }

    container.innerHTML = upcoming.slice(0, 3).map(q => `
        <div class="announcement-item">
            <p class="ann-item-title">${q.title} <span class="ann-badge quiz">Quiz</span></p>
            <p class="ann-item-meta">${q.subject} · ${new Date(q.datetime).toLocaleString()}</p>
        </div>
    `).join('');
}

function toggleChat() {
    const chat = document.getElementById('aiChat');
    chat.classList.toggle('open');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const text = input.value.trim();
    if (text === '') return;

    messages.innerHTML += `<div class="msg user-msg"><p>${text}</p></div>`;
    input.value = '';

    setTimeout(() => {
        messages.innerHTML += `<div class="msg ai-msg"><p>I'm EduSphere AI! Full functionality coming soon. Stay tuned! 🚀</p></div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 800);
    messages.scrollTop = messages.scrollHeight;
}