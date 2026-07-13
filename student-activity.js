document.addEventListener('DOMContentLoaded', function() {
    loadActivity();
});

function loadActivity() {
    const studentName = localStorage.getItem('name') || '';
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const container = document.getElementById('activityFeed');

    let activities = [];

    // joined classes
    myClasses.forEach(cls => {
        activities.push({
            icon: '🏫',
            text: `Joined class <strong>${cls.name}</strong>`,
            sub: cls.subject,
            time: cls.time || 'Recently'
        });
    });

    // submitted quizzes
    submittedQuizzes.filter(q => q.studentName === studentName).forEach(q => {
        const pct = Math.round((q.score / q.total) * 100);
        activities.push({
            icon: '✏️',
            text: `Submitted quiz <strong>${q.quizTitle}</strong>`,
            sub: `Score: ${q.score}/${q.total} (${pct}%)`,
            time: q.time
        });
    });

    // posted doubts
    doubts.filter(d => d.name === studentName).forEach(d => {
        activities.push({
            icon: '💬',
            text: `Asked a doubt in <strong>${d.subject}</strong>`,
            sub: d.text.substring(0, 50) + (d.text.length > 50 ? '...' : ''),
            time: d.time
        });
    });

    if (activities.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No recent activity yet.</p></div>';
        return;
    }

    container.innerHTML = activities.map(a => `
        <div class="activity-item">
            <div class="activity-icon">${a.icon}</div>
            <div class="activity-content">
                <p class="activity-text">${a.text}</p>
                <p class="activity-sub">${a.sub}</p>
                <p class="activity-time">${a.time}</p>
            </div>
        </div>
    `).join('');
}