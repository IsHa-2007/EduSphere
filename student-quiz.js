document.addEventListener('DOMContentLoaded', function() {
    loadStudentQuizzes();
});

function loadStudentQuizzes() {
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const container = document.getElementById('studentQuizList');

    if (quizzes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No quizzes available yet.</p></div>';
        return;
    }

    container.innerHTML = quizzes.map(q => `
        <div class="note-card" style="flex-direction:column;align-items:flex-start;">
            <div style="display:flex;justify-content:space-between;width:100%;margin-bottom:12px;">
                <div class="note-info">
                    <h3>${q.title}</h3>
                    <p>${q.subject} · ${q.teacher} · Due: ${q.deadline || 'No deadline'}</p>
                </div>
            </div>
            <div style="width:100%;">
                ${q.questions.map((question, i) => `
                    <div style="margin-bottom:12px;">
                        <p style="font-size:13px;color:white;margin-bottom:6px;">${i+1}. ${question}</p>
                        <input type="text" placeholder="Your answer..." style="width:100%;padding:8px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,149,255,0.2);border-radius:8px;color:white;font-size:13px;outline:none;">
                    </div>
                `).join('')}
                <button class="btn-primary" style="margin-top:8px;padding:8px 20px;font-size:13px;">Submit</button>
            </div>
        </div>
    `).join('');
}