let questionCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadQuizClasses();
});

function loadQuizClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('quizClassCards');

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes created yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => `
        <div class="class-card" onclick="openQuizCreate('${cls.code}', '${cls.name}')">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.students.length} students</p>
            </div>
        </div>
    `).join('');
}

function openQuizCreate(code, name) {
    document.getElementById('quizClassList').style.display = 'none';
    document.getElementById('quizCreateSection').style.display = 'block';
    document.getElementById('selectedQuizClassName').textContent = name;
    document.getElementById('selectedQuizClassCode').value = code;
    questionCount = 0;
    document.getElementById('questionsContainer').innerHTML = '';
    addQuestion();
    loadTeacherQuizzes(code);
    loadBlockedStudents(code); 
}

function backToQuizClasses() {
    document.getElementById('quizClassList').style.display = 'block';
    document.getElementById('quizCreateSection').style.display = 'none';
    loadQuizClasses();
}

function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    const div = document.createElement('div');
    div.className = 'question-block';
    div.id = `question-${questionCount}`;
    div.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <h4 style="color:white;font-size:14px;">Question ${questionCount}</h4>
            ${questionCount > 1 ? `<button class="post-action-btn" onclick="removeQuestion(${questionCount})">🗑️</button>` : ''}
        </div>
        <div class="input-group">
            <label>Type</label>
            <select id="qtype-${questionCount}" onchange="updateQuestionType(${questionCount})" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,149,255,0.2);border-radius:8px;color:white;font-size:14px;outline:none;">
                <option value="mcq" style="background:#0d0d1a;">MCQ</option>
                <option value="fib" style="background:#0d0d1a;">Fill in the Blank</option>
                <option value="short" style="background:#0d0d1a;">Short Answer</option>
                <option value="oneword" style="background:#0d0d1a;">One Word</option>
            </select>
        </div>
        <div class="input-group">
            <label>Question</label>
            <input type="text" id="qtext-${questionCount}" placeholder="Write your question here">
        </div>
        <div id="qoptions-${questionCount}">
            <div class="input-group"><label>Option A</label><input type="text" id="qa-${questionCount}" placeholder="Option A"></div>
            <div class="input-group"><label>Option B</label><input type="text" id="qb-${questionCount}" placeholder="Option B"></div>
            <div class="input-group"><label>Option C</label><input type="text" id="qc-${questionCount}" placeholder="Option C"></div>
            <div class="input-group"><label>Option D</label><input type="text" id="qd-${questionCount}" placeholder="Option D"></div>
            <div class="input-group"><label>Correct Answer</label><input type="text" id="qans-${questionCount}" placeholder="e.g. A"></div>
        </div>
    `;
    container.appendChild(div);
}

function updateQuestionType(num) {
    const type = document.getElementById(`qtype-${num}`).value;
    const optionsDiv = document.getElementById(`qoptions-${num}`);

    if (type === 'mcq') {
        optionsDiv.innerHTML = `
            <div class="input-group"><label>Option A</label><input type="text" id="qa-${num}" placeholder="Option A"></div>
            <div class="input-group"><label>Option B</label><input type="text" id="qb-${num}" placeholder="Option B"></div>
            <div class="input-group"><label>Option C</label><input type="text" id="qc-${num}" placeholder="Option C"></div>
            <div class="input-group"><label>Option D</label><input type="text" id="qd-${num}" placeholder="Option D"></div>
            <div class="input-group"><label>Correct Answer</label><input type="text" id="qans-${num}" placeholder="e.g. A"></div>
        `;
    } else if (type === 'fib') {
        optionsDiv.innerHTML = `<div class="input-group"><label>Answer</label><input type="text" id="qans-${num}" placeholder="Fill in the blank answer"></div>`;
    } else if (type === 'short') {
        optionsDiv.innerHTML = `<div class="input-group"><label>Model Answer</label><textarea id="qans-${num}" placeholder="Model answer..." style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,149,255,0.2);border-radius:8px;color:white;font-size:14px;outline:none;resize:none;height:60px;"></textarea></div>`;
    } else if (type === 'oneword') {
        optionsDiv.innerHTML = `<div class="input-group"><label>Answer</label><input type="text" id="qans-${num}" placeholder="One word answer"></div>`;
    }
}

function removeQuestion(num) {
    document.getElementById(`question-${num}`).remove();
}

function createQuiz() {
    const title = document.getElementById('quiz-title').value.trim();
    const subject = document.getElementById('quiz-subject').value.trim();
    const datetime = document.getElementById('quiz-datetime').value;
    const timelimit = document.getElementById('quiz-timelimit').value;
    const key = document.getElementById('quiz-key').value.trim();
    const attendanceRestriction = document.getElementById('attendance-restriction').checked;
    const classCode = document.getElementById('selectedQuizClassCode').value;
    const className = document.getElementById('selectedQuizClassName').textContent;

    if (title === '' || subject === '' || datetime === '' || key === '') {
        alert('Please fill title, subject, date/time and secure key!');
        return;
    }

    const questions = [];
    const blocks = document.querySelectorAll('.question-block');

    blocks.forEach((block, index) => {
        const num = index + 1;
        const type = document.getElementById(`qtype-${block.id.split('-')[1]}`).value;
        const text = document.getElementById(`qtext-${block.id.split('-')[1]}`).value.trim();
        const ans = document.getElementById(`qans-${block.id.split('-')[1]}`).value.trim();

        if (text === '') return;

        const q = { type, text, answer: ans };

        if (type === 'mcq') {
            q.options = {
                A: document.getElementById(`qa-${block.id.split('-')[1]}`).value,
                B: document.getElementById(`qb-${block.id.split('-')[1]}`).value,
                C: document.getElementById(`qc-${block.id.split('-')[1]}`).value,
                D: document.getElementById(`qd-${block.id.split('-')[1]}`).value,
            };
        }

        questions.push(q);
    });

    if (questions.length === 0) {
        alert('Please add at least one question!');
        return;
    }

    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const newQuiz = {
        id: Date.now(),
        title, subject, datetime, timelimit,
        key, attendanceRestriction,
        classCode, className,
        questions,
        teacher: localStorage.getItem('name') || 'Teacher',
        time: new Date().toLocaleString()
    };

    quizzes.unshift(newQuiz);
    localStorage.setItem('teacherQuizzes', JSON.stringify(quizzes));

    // Auto add to announcements
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    announcements.unshift({
        id: Date.now(),
        title: `Quiz Scheduled: ${title}`,
        content: `A quiz on ${subject} has been scheduled for ${new Date(datetime).toLocaleString()}. Time limit: ${timelimit} minutes.`,
        type: 'quiz',
        classCode: classCode,
        teacher: localStorage.getItem('name') || 'Teacher',
        time: new Date().toLocaleString()
    });
    localStorage.setItem('announcements', JSON.stringify(announcements));

    alert('Quiz scheduled successfully!');
    document.getElementById('quiz-title').value = '';
    document.getElementById('quiz-subject').value = '';
    document.getElementById('quiz-datetime').value = '';
    document.getElementById('quiz-timelimit').value = '';
    document.getElementById('quiz-key').value = '';
    questionCount = 0;
    document.getElementById('questionsContainer').innerHTML = '';
    addQuestion();
    loadTeacherQuizzes(classCode);
}

function loadTeacherQuizzes(classCode) {
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const classQuizzes = quizzes.filter(q => q.classCode === classCode);
    const container = document.getElementById('teacherQuizList');

    if (classQuizzes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No quizzes scheduled yet.</p></div>';
        return;
    }

    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');

    container.innerHTML = classQuizzes.map(q => {
        const results = submittedQuizzes.filter(s => s.quizId === q.id);
        return `
        <div class="note-card" style="flex-direction:column;align-items:flex-start;cursor:pointer;" onclick="toggleQuizResults('results-${q.id}')">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
                <div class="note-info">
                    <h3>${q.title}</h3>
                    <p>${q.subject} · ${q.questions.length} questions · ${new Date(q.datetime).toLocaleString()} · ${q.timelimit} mins · Key: ${q.key}</p>
                    <p style="color:#0095ff;font-size:12px;margin-top:4px;">${results.length} submissions</p>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                    <span style="font-size:12px;color:#aaaaaa;">▼ Results</span>
                    <button class="post-action-btn" onclick="event.stopPropagation();deleteQuiz(${q.id})">🗑️</button>
                </div>
            </div>

            <div id="results-${q.id}" style="display:none;width:100%;margin-top:16px;border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;">
                ${results.length === 0 ?
                    '<p style="color:#444;font-size:13px;">No submissions yet.</p>' :
                    `<table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                                <th style="text-align:left;padding:8px;font-size:12px;color:#aaaaaa;">Student</th>
                                <th style="text-align:center;padding:8px;font-size:12px;color:#aaaaaa;">Score</th>
                                <th style="text-align:center;padding:8px;font-size:12px;color:#aaaaaa;">%</th>
                                <th style="text-align:right;padding:8px;font-size:12px;color:#aaaaaa;">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${[...results].sort((a,b) => b.score - a.score).map(r => {
                                const pct = Math.round((r.score / r.total) * 100);
                                let color = pct >= 80 ? '#00cc66' : pct >= 60 ? '#0095ff' : pct >= 40 ? '#ffcc00' : '#ff4444';
                                return `
                                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                                    <td style="padding:8px;font-size:13px;color:white;">${r.studentName}</td>
                                    <td style="padding:8px;text-align:center;font-size:13px;color:white;">${r.score}/${r.total}</td>
                                    <td style="padding:8px;text-align:center;font-size:14px;font-weight:700;color:${color};">${pct}%</td>
                                    <td style="padding:8px;text-align:right;font-size:11px;color:#aaaaaa;">${r.time}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>`
                }
            </div>
        </div>`;
    }).join('');
}

function toggleQuizResults(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function deleteQuiz(id) {
    let quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    quizzes = quizzes.filter(q => q.id !== id);
    localStorage.setItem('teacherQuizzes', JSON.stringify(quizzes));
    const code = document.getElementById('selectedQuizClassCode').value;
    loadTeacherQuizzes(code);
}
function loadBlockedStudents(classCode) {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === classCode);
    if (!cls || cls.students.length === 0) return;

    const blockedStudents = JSON.parse(localStorage.getItem('blockedStudents') || '[]');
    const container = document.getElementById('blockedStudentsList');

    container.innerHTML = cls.students.map(student => {
        const isBlocked = blockedStudents.includes(student);
        return `
        <div class="class-card">
            <div class="class-info">
                <h3>${student}</h3>
            </div>
            <button class="btn-outline" onclick="toggleBlock('${student}')" style="padding:6px 16px;font-size:12px;${isBlocked ? 'border-color:#ff4444;color:#ff4444;' : ''}">
                ${isBlocked ? 'Unblock' : 'Block'}
            </button>
        </div>`;
    }).join('');
}

function toggleBlock(studentName) {
    let blockedStudents = JSON.parse(localStorage.getItem('blockedStudents') || '[]');
    if (blockedStudents.includes(studentName)) {
        blockedStudents = blockedStudents.filter(s => s !== studentName);
        alert(`${studentName} unblocked!`);
    } else {
        blockedStudents.push(studentName);
        alert(`${studentName} blocked from quiz!`);
    }
    localStorage.setItem('blockedStudents', JSON.stringify(blockedStudents));
    const code = document.getElementById('selectedQuizClassCode').value;
    loadBlockedStudents(code);
}