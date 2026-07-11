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

    if (myClasses.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Join classes to see performance.</p></div>';
        return;
    }

    // Overall stats
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
    const overallQuizScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

    let attendanceColor = overallAttendance >= 80 ? '#00cc66' : overallAttendance >= 75 ? '#ffcc00' : '#ff4444';
    let quizColor = overallQuizScore >= 80 ? '#00cc66' : overallQuizScore >= 60 ? '#ffcc00' : '#ff4444';

    container.innerHTML = `
        <!-- OVERALL STATS -->
        <div class="stats-grid" style="margin-bottom:24px;">
            <div class="stat-card">
                <p class="stat-label">Overall Attendance</p>
                <h3 class="stat-value" style="color:${attendanceColor};">${overallAttendance}%</h3>
                <p class="stat-sub">${totalPresent}/${totalDays} classes</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Quiz Performance</p>
                <h3 class="stat-value" style="color:${quizColor};">${overallQuizScore}%</h3>
                <p class="stat-sub">${myQuizzes.length} quizzes attempted</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Classes Joined</p>
                <h3 class="stat-value">${myClasses.length}</h3>
                <p class="stat-sub">Active classes</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Total Score</p>
                <h3 class="stat-value">${totalScore}/${totalPossible}</h3>
                <p class="stat-sub">Across all quizzes</p>
            </div>
        </div>

        <!-- ATTENDANCE PER CLASS -->
        <div class="dash-card" style="margin-bottom:24px;">
            <h3>Attendance by Class</h3>
            ${myClasses.map(cls => {
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
                    ${pct < 75 ? '<p style="font-size:11px;color:#ff4444;">⚠️ Below 75% — attendance required!</p>' : ''}
                </div>`;
            }).join('')}
        </div>

        <!-- QUIZ RESULTS -->
        <div class="dash-card">
            <h3>Quiz History</h3>
            ${myQuizzes.length === 0 ? 
                '<div class="empty-state"><p>No quizzes attempted yet.</p></div>' :
                myQuizzes.map(q => {
                    const pct = Math.round((q.score / q.total) * 100);
                    let color = pct >= 80 ? '#00cc66' : pct >= 60 ? '#0095ff' : pct >= 40 ? '#ffcc00' : '#ff4444';
                    let grade = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Average' : 'Poor';
                    return `
                    <div class="announcement-item">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <p class="ann-item-title">${q.quizTitle}</p>
                                <p class="ann-item-meta">${q.subject} · ${q.time}</p>
                            </div>
                            <div style="text-align:right;">
                                <p style="font-size:18px;font-weight:700;color:${color};">${pct}%</p>
                                <p style="font-size:11px;color:${color};">${grade}</p>
                            </div>
                        </div>
                    </div>`;
                }).join('')
            }
        </div>`;
}