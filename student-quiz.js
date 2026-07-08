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
    
    let score = 0;
    let total = currentQuiz.questions.length;
    let results = [];

    currentQuiz.questions.forEach((q, i) => {
        let studentAnswer = '';
        
        if (q.type === 'mcq') {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            studentAnswer = selected ? selected.value : '';
        } else {
            const input = document.getElementById(`ans-${i}`);
            studentAnswer = input ? input.value.trim() : '';
        }

        const isCorrect = studentAnswer.toUpperCase() === q.answer.toUpperCase();
        if (isCorrect) score++;

        results.push({
            question: q.text,
            type: q.type,
            studentAnswer: studentAnswer,
            correctAnswer: q.answer,
            isCorrect: isCorrect
        });
    });

    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    submittedQuizzes.push({
        quizId: currentQuiz.id,
        quizTitle: currentQuiz.title,
        subject: currentQuiz.subject,
        score: score,
        total: total,
        results: results,
        time: new Date().toLocaleString(),
        studentName: localStorage.getItem('name') || 'Student'
    });
    localStorage.setItem('submittedQuizzes', JSON.stringify(submittedQuizzes));

    showQuizResult(score, total, results);
}

function showQuizResult(score, total, results) {
    document.getElementById('quizAttemptSection').style.display = 'none';
    document.getElementById('quizResultSection').style.display = 'block';

    const percentage = Math.round((score / total) * 100);
    let grade = '';
    let gradeColor = '';

    if (percentage >= 80) { grade = 'Excellent! '; gradeColor = '#00cc66'; }
    else if (percentage >= 60) { grade = 'Good! '; gradeColor = '#0095ff'; }
    else if (percentage >= 40) { grade = 'Average '; gradeColor = '#ffcc00'; }
    else { grade = 'Need Improvement '; gradeColor = '#ff4444'; }

    document.getElementById('quizResultContent').innerHTML = `
        <div style="text-align:center;margin-bottom:32px;">
            <h2 style="font-size:48px;font-weight:700;color:${gradeColor};">${score}/${total}</h2>
            <p style="font-size:20px;color:${gradeColor};margin-top:8px;">${grade}</p>
            <p style="font-size:14px;color:#aaaaaa;margin-top:4px;">${percentage}% Score</p>
        </div>

        <h3 style="color:white;font-size:16px;margin-bottom:16px;">Question Review:</h3>
        ${results.map((r, i) => `
            <div class="result-card ${r.isCorrect ? 'correct' : 'incorrect'}">
                <p style="font-size:13px;color:white;margin-bottom:8px;"><strong>Q${i+1}.</strong> ${r.question}</p>
                <p style="font-size:12px;color:#aaaaaa;">Your answer: <span style="color:${r.isCorrect ? '#00cc66' : '#ff4444'}">${r.studentAnswer || 'Not answered'}</span></p>
                ${!r.isCorrect ? `<p style="font-size:12px;color:#aaaaaa;">Correct answer: <span style="color:#00cc66">${r.correctAnswer}</span></p>` : ''}
            </div>
        `).join('')}

        <button class="btn-primary btn-full" style="margin-top:24px;" onclick="backToQuizClasses()">Back to Quizzes</button>
    `;
}