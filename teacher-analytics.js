document.addEventListener('DOMContentLoaded', function() {
    loadAnalyticsClasses();
});

function loadAnalyticsClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('analyticsClassList');

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes created yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => `
        <div class="class-card" onclick="openClassAnalytics('${cls.code}', '${cls.name}')">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.students.length} students</p>
            </div>
            <span style="color:#aaaaaa;font-size:12px;">View Analytics →</span>
        </div>
    `).join('');
}

function openClassAnalytics(code, name) {
    document.getElementById('analyticsClassList').style.display = 'none';
    document.getElementById('analyticsSection').style.display = 'block';
    document.getElementById('analyticsClassName').textContent = name;

    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === code);
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    const container = document.getElementById('studentAnalyticsList');

    if (!cls || cls.students.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No students in this class.</p></div>';
        return;
    }

    const sortedStudents = [...cls.students].sort();

    container.innerHTML = sortedStudents.map(student => {
        const dateKeys = Object.keys(attendance).filter(k => k.startsWith(code));
        let present = 0;
        dateKeys.forEach(key => {
            if (attendance[key][student] === 'present') present++;
        });
        const attPct = dateKeys.length > 0 ? Math.round((present / dateKeys.length) * 100) : 0;

        const studentQuizzes = submittedQuizzes.filter(q => q.studentName === student);
        const avgScore = studentQuizzes.length > 0 ?
            Math.round(studentQuizzes.reduce((sum, q) => sum + Math.round((q.score / q.total) * 100), 0) / studentQuizzes.length) : 0;

        let dot = '';
        let dotColor = '';
        if (attPct < 75 || avgScore < 40) {
            dot = '🔴'; dotColor = '#ff4444';
        } else if (attPct < 80 || avgScore < 60) {
            dot = '🟡'; dotColor = '#ffcc00';
        } else {
            dot = '🟢'; dotColor = '#00cc66';
        }

        return `
        <div class="class-card" style="margin-bottom:8px;">
            <div class="class-info">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:18px;">${dot}</span>
                    <div>
                        <h3>${student}</h3>
                        <p>Attendance: <span style="color:${attPct >= 75 ? '#00cc66' : '#ff4444'}">${attPct}%</span> · 
                        Avg Score: <span style="color:${avgScore >= 60 ? '#00cc66' : '#ff4444'}">${avgScore}%</span></p>
                    </div>
                </div>
            </div>
            ${attPct < 75 ? `
            <button class="btn-outline" onclick="sendReminder('${student}')" 
            style="padding:6px 14px;font-size:12px;border-color:#ffcc00;color:#ffcc00;white-space:nowrap;">
                ⚠️ Remind
            </button>` : ''}
        </div>`;
    }).join('');
}

function sendReminder(studentName) {
    alert(`Attendance reminder sent to ${studentName}!`);
    // In real app this would send a notification
}

function backToAnalyticsClasses() {
    document.getElementById('analyticsClassList').style.display = 'block';
    document.getElementById('analyticsSection').style.display = 'none';
}