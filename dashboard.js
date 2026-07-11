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
    loadAttendanceSummary();
});

function loadDashboardStats() {
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const studentName = localStorage.getItem('name') || '';
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    const teacherQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const myCodes = myClasses.map(c => c.code);
    const now = new Date();

    // attendance %
    let totalPresent = 0, totalDays = 0;
    myClasses.forEach(cls => {
        const dateKeys = Object.keys(attendance).filter(k => k.startsWith(cls.code));
        totalDays += dateKeys.length;
        dateKeys.forEach(key => {
            if (attendance[key][studentName] === 'present') totalPresent++;
        });
    });
    const attendancePct = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

    // upcoming quizzes
    const upcomingQuizzes = teacherQuizzes.filter(q => 
        myCodes.includes(q.classCode) && new Date(q.datetime) > now
    );

    // submitted quizzes
    const myQuizzes = submittedQuizzes.filter(q => q.studentName === studentName);
    const avgScore = myQuizzes.length > 0 ? 
        Math.round(myQuizzes.reduce((sum, q) => sum + Math.round((q.score/q.total)*100), 0) / myQuizzes.length) : 0;

    const el1 = document.querySelector('.stat-value:nth-child(1)');

    // update stat cards
    const statValues = document.querySelectorAll('.stat-value');
    const statSubs = document.querySelectorAll('.stat-sub');

    if (statValues[0]) statValues[0].textContent = attendancePct + '%';
    if (statValues[1]) statValues[1].textContent = myClasses.length;
    if (statValues[2]) statValues[2].textContent = upcomingQuizzes.length;
    if (statValues[3]) statValues[3].textContent = avgScore + '%';
    if (statSubs[3]) statSubs[3].textContent = 'Avg quiz score';
}