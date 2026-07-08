let currentQuiz = null;
let timeLeft = 0;
let timerInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    loadStudentQuizClasses();
});

function loadStudentQuizClasses() {
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const container = document.getElementById('studentQuizClassList');

    if (myClasses.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes joined yet.</p></div>';
        return;
    }

    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');

    container.innerHTML = myClasses.map(cls => {
        const classQuizzes = quizzes.filter(q => q.classCode === cls.code);
        const activeQuizzes = classQuizzes.filter(q => new Date(q.datetime) <= new Date());
        const upcomingQuizzes = classQuizzes.filter(q => new Date(q.datetime) > new Date());

        return `
        <div class="class-card" onclick="openStudentQuizClass('${cls.code}', '${cls.name}')">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${activeQuizzes.length} active · ${upcomingQuizzes.length} upcoming</p>
            </div>
            ${activeQuizzes.length > 0 ? '<div class="doubt-dot yellow"></div>' : ''}
        </div>`;
    }).join('');
}

function openStudentQuizClass(code, name) {
    document.getElementById('studentQuizClassList').style.display = 'none';
    document.getElementById('studentQuizSection').style.display = 'block';
    document.getElementById('selectedQuizClass').textContent = name;
    document.getElementById('currentClassCode').value = code;
    loadClassQuizzes(code);
}

function backToQuizClasses() {
    document.getElementById('studentQuizClassList').style.display = 'block';
    document.getElementById('studentQuizSection').style.display = 'none';
    document.getElementById('quizAttemptSection').style.display = 'none';
    loadStudentQuizClasses();
}

function loadClassQuizzes(code) {
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const classQuizzes = quizzes.filter(q => q.classCode === code);
    const container = document.getElementById('quizList');
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    const blockedStudents = JSON.parse(localStorage.getItem('blockedStudents') || '[]');
    const myName = localStorage.getItem('name') || '';
    const isBlocked = blockedStudents.includes(myName);

    if (classQuizzes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No quizzes for this class yet.</p></div>';
        return;
    }

    const now = new Date();

    container.innerHTML = classQuizzes.map(q => {
        const startTime = new Date(q.datetime);
        const isActive = startTime <= now;
        const isSubmitted = submittedQuizzes.includes(q.id);

        let statusBadge = '';
        let actionBtn = '';

        if (isSubmitted) {
            statusBadge = '<span class="ann-badge general">Submitted</span>';
            actionBtn = '';
        } else if (isBlocked) {
            statusBadge = '<span class="ann-badge urgent">Blocked</span>';
            actionBtn = '';
        } else if (!isActive) {
            statusBadge = '<span class="ann-badge quiz">Upcoming</span>';
            actionBtn = `<p style="font-size:12px;color:#aaaaaa;">Starts: ${startTime.toLocaleString()}</p>`;
        } else {
            statusBadge = '<span class="ann-badge exam">Active</span>';
            actionBtn = `<button class="btn-primary" onclick="startQuizPrompt(${q.id})" style="margin-top:8px;padding:6px 20px;font-size:13px;">Attempt Quiz</button>`;
        }

        return `
        <div class="note-card" style="flex-direction:column;align-items:flex-start;">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
                <div class="note-info">
                    <h3>${q.title} ${statusBadge}</h3>
                    <p>${q.subject} · ${q.questions.length} questions · ${q.timelimit} mins · ${startTime.toLocaleString()}</p>
                </div>
            </div>
            ${actionBtn}
        </div>`;
    }).join('');
}

function startQuizPrompt(quizId) {
    const key = prompt('Enter the secure key to start this quiz:');
    if (!key) return;

    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
        alert('Quiz not found!');
        return;
    }

    if (key.trim().toUpperCase() !== quiz.key.toUpperCase()) {
        alert('Wrong key! Please check with your teacher.');
        return;
    }

    startQuiz(quiz);
}

function startQuiz(quiz) {
    currentQuiz = quiz;
    document.getElementById('studentQuizSection').style.display = 'none';
    document.getElementById('quizAttemptSection').style.display = 'block';
    document.getElementById('attemptQuizTitle').textContent = quiz.title;
    document.getElementById('attemptQuizSubject').textContent = `${quiz.subject} · ${quiz.questions.length} questions · ${quiz.timelimit} minutes`;

    renderQuestions(quiz);
    startTimer(quiz.timelimit * 60);
}

function renderQuestions(quiz) {
    const container = document.getElementById('attemptQuestions');
    container.innerHTML = quiz.questions.map((q, i) => {
        let answerInput = '';

        if (q.type === 'mcq') {
            answerInput = `
                <div class="mcq-options">
                    ${Object.entries(q.options).map(([key, val]) => `
                        <label class="mcq-option">
                            <input type="radio" name="q${i}" value="${key}"> ${key}. ${val}
                        </label>
                    `).join('')}
                </div>`;
        } else if (q.type === 'short') {
            answerInput = `<textarea id="ans-${i}" placeholder="Write your answer..." style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,149,255,0.2);border-radius:8px;color:white;font-size:13px;outline:none;resize:none;height:80px;margin-top:8px;"></textarea>`;
        } else {
            answerInput = `<input type="text" id="ans-${i}" placeholder="Your answer..." style="width:100%;padding:8px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,149,255,0.2);border-radius:8px;color:white;font-size:13px;outline:none;margin-top:8px;">`;
        }

        return `
        <div class="question-block">
            <p style="font-size:14px;color:white;margin-bottom:12px;"><strong>Q${i+1}.</strong> ${q.text}</p>
            <span style="font-size:11px;color:#aaaaaa;background:rgba(0,149,255,0.1);padding:2px 8px;border-radius:99px;">${q.type.toUpperCase()}</span>
            ${answerInput}
        </div>`;
    }).join('');
}

function startTimer(seconds) {
    timeLeft = seconds;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Submitting quiz automatically.');
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const display = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    document.getElementById('timerDisplay').textContent = display;
    if (timeLeft <= 60) {
        document.getElementById('timerDisplay').style.color = '#ff4444';
    }
}

function submitQuiz() {
    clearInterval(timerInterval);
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    submittedQuizzes.push(currentQuiz.id);
    localStorage.setItem('submittedQuizzes', JSON.stringify(submittedQuizzes));
    alert('Quiz submitted successfully!');
    document.getElementById('quizAttemptSection').style.display = 'none';
    document.getElementById('studentQuizSection').style.display = 'block';
    const code = document.getElementById('currentClassCode').value;
    loadClassQuizzes(code);
}