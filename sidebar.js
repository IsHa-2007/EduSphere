const role = localStorage.getItem('role');
const name = localStorage.getItem('name');

const studentLinks = `
    <a href="student-dashboard.html" class="nav-item">Home</a>
    <a href="student-activity-dashboard.html" class="nav-item">Activity</a>
    <a href="student-attendence.html" class="nav-item">Attendance</a>
    <a href="student-exam.html" class="nav-item">Exams</a>
    <a href="student-doubt.html" class="nav-item">Doubts</a>
    <a href="student-notes.html" class="nav-item">Notes</a>
    <a href="student-quiz.html" class="nav-item">Quizzes</a>
    <a href="student-performance.html" class="nav-item">Performance</a>
`;

const teacherLinks = `
    <a href="teacher-dashboard.html" class="nav-item">Home</a>
    <a href="teacher-MYclass.html" class="nav-item">My Classes</a>
    <a href="teacher-attendance.html" class="nav-item">Attendance</a>
    <a href="teacher-creatQuiz.html" class="nav-item">Create Quiz</a>
    <a href="teacher-StudentDoubt.html" class="nav-item">Student Doubts</a>
    <a href="teacher-anouncement.html" class="nav-item">Announcements</a>
    <a href="teacher-analytics.html" class="nav-item">Analytics</a>
    <a href="teacher-uploadNotes.html" class="nav-item">Upload Notes</a>
`;

const institutionLinks = `
    <a href="admin-dashboard.html" class="nav-item">Home</a>
    <a href="admin-users.html" class="nav-item">Users</a>
    <a href="admin-departments.html" class="nav-item">Departments</a>
`;

const commonLinks = `
    <a href="feed.html" class="nav-item">Feed</a>
`;

let navLinks = '';
if (role === 'student') navLinks = studentLinks;
else if (role === 'teacher') navLinks = teacherLinks;
else if (role === 'institution') navLinks = institutionLinks;

document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-logo">
        Edu<span class="highlight">Sphere</span>
    </div>
    <a href="profile.html" style="text-decoration:none;">
        <div class="sidebar-user">
            <div class="user-avatar">👤</div>
            <div class="user-info">
                <p class="user-name">${name || 'User'}</p>
                <p class="user-role">${role || 'Student'}</p>
            </div>
        </div>
    </a>
    <nav class="sidebar-nav">
        ${navLinks}
        ${commonLinks}
    </nav>
    <div class="sidebar-bottom">
        <a href="index.html" class="nav-item">Logout</a>
    </div>
`;
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-item').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});