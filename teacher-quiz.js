document.addEventListener('DOMContentLoaded', function() {
    loadTeacherQuizzes();
});

function createQuiz() {
    const title = document.getElementById('quiz-title').value.trim();
    const subject = document.getElementById('quiz-subject').value.trim();
    const deadline = document.getElementById('quiz-deadline').value;
    const q1 = document.getElementById('q1').value.trim();
    const q2 = document.getElementById('q2').value.trim();
    const q3 = document.getElementById('q3').value.trim();

    if (title === '' || subject === '' || q1 === '') {
        alert('Please fill title, subject and at least one question!');
        return;
    }

    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    quizzes.unshift({
        id: Date.now(),
        title: title,
        subject: subject,
        deadline: deadline,
        questions: [q1, q2, q3].filter(q => q !== ''),
        teacher: localStorage.getItem('name') || 'Teacher',
        time: new Date().toLocaleString()
    });

    localStorage.setItem('teacherQuizzes', JSON.stringify(quizzes));
    document.getElementById('quiz-title').value = '';
    document.getElementById('quiz-subject').value = '';
    document.getElementById('q1').value = '';
    document.getElementById('q2').value = '';
    document.getElementById('q3').value = '';
    loadTeacherQuizzes();
}

function loadTeacherQuizzes() {
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const container = document.getElementById('teacherQuizList');

    if (quizzes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No quizzes created yet.</p></div>';
        return;
    }

    container.innerHTML = quizzes.map(q => `
        <div class="note-card">
            <div class="note-info">
                <h3>${q.title}</h3>
                <p>${q.subject} · ${q.questions.length} questions · Due: ${q.deadline || 'No deadline'}</p>
            </div>
            <button class="post-action-btn" onclick="deleteQuiz(${q.id})">🗑️</button>
        </div>
    `).join('');
}

function deleteQuiz(id) {
    let quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    quizzes = quizzes.filter(q => q.id !== id);
    localStorage.setItem('teacherQuizzes', JSON.stringify(quizzes));
    loadTeacherQuizzes();
}