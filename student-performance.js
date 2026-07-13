document.addEventListener('DOMContentLoaded', function() {
    loadPerformance();
});

function loadPerformance() {
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const studentName = localStorage.getItem('name') || '';
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    const myQuizzes = submittedQuizzes.filter(q => q.studentName === studentName);
    const container = document.getElementById('performanceContent');

    let totalPresent = 0, totalDays = 0;
    let totalScore = 0, totalPossible = 0;

    myClasses.forEach(cls => {
        const dateKeys = Object.keys(attendance).filter(k => k.startsWith(cls.code));
        totalDays += dateKeys.length;
        dateKeys.forEach(key => {
            if (attendance[key][studentName] === 'present') totalPresent++;
        });
    });

    myQuizzes.forEach(q => {
        totalScore += q.score;
        totalPossible += q.total;
    });

    const overallAttendance = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;
    const latestQuiz = myQuizzes.length > 0 ? myQuizzes[myQuizzes.length - 1] : null;
    const latestScore = latestQuiz ? Math.round((latestQuiz.score / latestQuiz.total) * 100) : 0;

    let attendanceColor = overallAttendance >= 80 ? '#00cc66' : overallAttendance >= 75 ? '#ffcc00' : '#ff4444';
    let scoreColor = latestScore >= 80 ? '#00cc66' : latestScore >= 60 ? '#0095ff' : latestScore >= 40 ? '#ffcc00' : '#ff4444';

    container.innerHTML = `
        <div class="stats-grid" style="margin-bottom:24px;">
            <div class="stat-card">
                <p class="stat-label">Overall Attendance</p>
                <h3 class="stat-value" style="color:${attendanceColor};">${overallAttendance}%</h3>
                <p class="stat-sub">${totalPresent}/${totalDays} classes</p>
            </div>
            <div class="stat-card" style="cursor:pointer;" onclick="window.location.href='student-quiz-scores.html'">
                <p class="stat-label">Score</p>
                <h3 class="stat-value" style="color:${scoreColor};">${latestScore}%</h3>
                <p class="stat-sub">Latest quiz · View all →</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Classes Joined</p>
                <h3 class="stat-value">${myClasses.length}</h3>
                <p class="stat-sub">Active classes</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Quizzes Done</p>
                <h3 class="stat-value">${myQuizzes.length}</h3>
                <p class="stat-sub">Attempted</p>
            </div>
        </div>

        <div class="dash-card">
            <h3>Attendance by Class</h3>
            ${myClasses.length === 0 ? '<div class="empty-state"><p>No classes joined yet.</p></div>' :
                myClasses.map(cls => {
                    const dateKeys = Object.keys(attendance).filter(k => k.startsWith(cls.code));
                    let present = 0;
                    dateKeys.forEach(key => {
                        if (attendance[key][studentName] === 'present') present++;
                    });
                    const pct = dateKeys.length > 0 ? Math.round((present / dateKeys.length) * 100) : 0;
                    let color = pct >= 80 ? '#00cc66' : pct >= 75 ? '#ffcc00' : '#ff4444';
                    return `
                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span style="font-size:13px;color:white;">${cls.name}</span>
                            <span style="font-size:13px;font-weight:700;color:${color};">${pct}%</span>
                        </div>
                        <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;">
                            <div style="width:${pct}%;height:100%;background:${color};border-radius:99px;"></div>
                        </div>
                        <p style="font-size:11px;color:#aaaaaa;margin-top:4px;">${present}/${dateKeys.length} classes attended</p>
                        ${pct < 75 ? '<p style="font-size:11px;color:#ff4444;">⚠️ Below 75%!</p>' : ''}
                    </div>`;
                }).join('')
            }
        </div>`;
}