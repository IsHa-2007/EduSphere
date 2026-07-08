document.addEventListener('DOMContentLoaded', function() {
    loadQuizResultClasses();
});

function loadQuizResultClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('resultClassList');

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => `
        <div class="class-card" onclick="openClassResults('${cls.code}', '${cls.name}')">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject}</p>
            </div>
        </div>
    `).join('');
}

function openClassResults(code, name) {
    document.getElementById('resultClassList').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('resultClassName').textContent = name;

    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const classQuizzes = quizzes.filter(q => q.classCode === code);
    const container = document.getElementById('quizResultList');

    if (classQuizzes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No quizzes for this class.</p></div>';
        return;
    }

    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');

    container.innerHTML = classQuizzes.map(q => {
        const results = submittedQuizzes.filter(s => s.quizId === q.id);

        return `
        <div class="dash-card" style="margin-bottom:16px;">
            <h3>${q.title} <span class="ann-badge quiz">${q.subject}</span></h3>
            <p style="color:#aaaaaa;font-size:12px;margin-bottom:16px;">${results.length} submissions · ${new Date(q.datetime).toLocaleString()}</p>

            ${results.length === 0 ?
                '<div class="empty-state" style="min-height:60px;"><p>No submissions yet.</p></div>' :
                `<table style="width:100%;border-collapse:collapse;">
                    <thead>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                            <th style="text-align:left;padding:8px;font-size:12px;color:#aaaaaa;">Student</th>
                            <th style="text-align:center;padding:8px;font-size:12px;color:#aaaaaa;">Score</th>
                            <th style="text-align:center;padding:8px;font-size:12px;color:#aaaaaa;">Percentage</th>
                            <th style="text-align:center;padding:8px;font-size:12px;color:#aaaaaa;">Grade</th>
                            <th style="text-align:right;padding:8px;font-size:12px;color:#aaaaaa;">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${[...results].sort((a,b) => b.score - a.score).map(r => {
                            const pct = Math.round((r.score / r.total) * 100);
                            let grade = '', color = '';
                            if (pct >= 80) { grade = '🟢 Excellent'; color = '#00cc66'; }
                            else if (pct >= 60) { grade = '🔵 Good'; color = '#0095ff'; }
                            else if (pct >= 40) { grade = '🟡 Average'; color = '#ffcc00'; }
                            else { grade = '🔴 Poor'; color = '#ff4444'; }

                            return `
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                                <td style="padding:10px 8px;font-size:13px;color:white;">${r.studentName}</td>
                                <td style="padding:10px 8px;text-align:center;font-size:13px;color:white;">${r.score}/${r.total}</td>
                                <td style="padding:10px 8px;text-align:center;font-size:14px;font-weight:700;color:${color};">${pct}%</td>
                                <td style="padding:10px 8px;text-align:center;font-size:12px;color:${color};">${grade}</td>
                                <td style="padding:10px 8px;text-align:right;font-size:11px;color:#aaaaaa;">${r.time}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>`
            }
        </div>`;
    }).join('');
}

function backToResultClasses() {
    document.getElementById('resultClassList').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    loadQuizResultClasses();
}