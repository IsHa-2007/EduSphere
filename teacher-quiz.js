let questionCount = 0;

document.addEventListener('DOMContentLoaded', function () {
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
    document.getElementById('editingQuizId').value = '';
    document.getElementById('scheduleBtn').textContent = 'Schedule Quiz';
    addQuestion();
    loadQuizSections(code);
    loadManageStudents(code);
}

function backToQuizClasses() {
    document.getElementById('quizClassList').style.display = 'block';
    document.getElementById('quizCreateSection').style.display = 'none';
    document.getElementById('quizResultView').style.display = 'none';
    loadQuizClasses();
}

function loadQuizSections(code) {
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const classQuizzes = quizzes.filter(q => q.classCode === code);
    const now = new Date();

    const scheduled = classQuizzes.filter(q => new Date(q.datetime) > now);
    const live = classQuizzes.filter(q => {
        const start = new Date(q.datetime);
        const end = new Date(start.getTime() + q.timelimit * 60000);
        return start <= now && end > now;
    });
    const ended = classQuizzes.filter(q => {
        const start = new Date(q.datetime);
        const end = new Date(start.getTime() + q.timelimit * 60000);
        return end <= now;
    });

    renderQuizSection('scheduledList', scheduled, 'scheduled');
    renderQuizSection('liveList', live, 'live');
    renderQuizSection('endedList', ended, 'ended');

    document.getElementById('scheduledCount').textContent = scheduled.length;
    document.getElementById('liveCount').textContent = live.length;
    document.getElementById('endedCount').textContent = ended.length;
}

function renderQuizSection(containerId, quizzes, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (quizzes.length === 0) {
        container.innerHTML = '<div class="empty-state" style="min-height:60px;"><p>No quizzes here.</p></div>';
        return;
    }

    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');

    container.innerHTML = quizzes.map(q => {
        const results = submittedQuizzes.filter(s => s.quizId === q.id);
        const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
        const cls = classes.find(c => c.code === q.classCode);
        const totalStudents = cls ? cls.students.length : 0;

        return `
        <div class="note-card" style="flex-direction:column;align-items:flex-start;">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
                <div class="note-info">
                    <h3>${q.title}</h3>
                    <p>${q.subject} · ${q.questions.length} questions · ${new Date(q.datetime).toLocaleString()} · ${q.timelimit} mins · Key: ${q.key}</p>
                    ${type === 'ended' ? `<p style="color:#0095ff;font-size:12px;margin-top:4px;">${results.length}/${totalStudents} submitted</p>` : ''}
                </div>
                <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
                  ${type !== 'ended' ? `<button class="btn-outline" onclick="editQuiz(${q.id})" 
                   style="padding:6px 14px;font-size:12px;">✏️ Edit</button>` : ''}
                  ${type === 'ended' ?
                      `<button class="btn-outline" onclick="viewQuizResult(${q.id})" 
                      style="padding:6px 14px;font-size:12px;">📊 Result</button>` : ''}
                  <button class="post-action-btn" onclick="deleteQuiz(${q.id}, '${q.classCode}')">🗑️</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function viewQuizResult(quizId) {
    document.getElementById('quizCreateSection').style.display = 'none';
    document.getElementById('quizResultView').style.display = 'block';

    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const quiz = quizzes.find(q => q.id === quizId);
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedQuizzes') || '[]');
    const results = submittedQuizzes.filter(s => s.quizId === quizId);
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === quiz.classCode);
    const totalStudents = cls ? cls.students.length : 0;

    document.getElementById('resultQuizTitle').textContent = quiz.title;
    document.getElementById('resultQuizMeta').textContent =
        `${quiz.subject} · ${results.length}/${totalStudents} students submitted`;

    const container = document.getElementById('quizResultTable');

    if (results.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No submissions yet.</p></div>';
        return;
    }

    container.innerHTML = `
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                    <th style="text-align:left;padding:10px;font-size:12px;color:#aaaaaa;">#</th>
                    <th style="text-align:left;padding:10px;font-size:12px;color:#aaaaaa;">Student</th>
                    <th style="text-align:center;padding:10px;font-size:12px;color:#aaaaaa;">Score</th>
                    <th style="text-align:center;padding:10px;font-size:12px;color:#aaaaaa;">%</th>
                    <th style="text-align:center;padding:10px;font-size:12px;color:#aaaaaa;">Grade</th>
                    <th style="text-align:right;padding:10px;font-size:12px;color:#aaaaaa;">Submitted</th>
                </tr>
            </thead>
            <tbody>
                ${[...results].sort((a, b) => b.score - a.score).map((r, i) => {
        const pct = Math.round((r.score / r.total) * 100);
        let grade = '', color = '';
        if (pct >= 80) { grade = '🟢 Excellent'; color = '#00cc66'; }
        else if (pct >= 60) { grade = '🔵 Good'; color = '#0095ff'; }
        else if (pct >= 40) { grade = '🟡 Average'; color = '#ffcc00'; }
        else { grade = '🔴 Poor'; color = '#ff4444'; }
        return `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px;font-size:13px;color:#aaaaaa;">${i + 1}</td>
                        <td style="padding:10px;font-size:13px;color:white;">${r.studentName}</td>
                        <td style="padding:10px;text-align:center;font-size:13px;color:white;">${r.score}/${r.total}</td>
                        <td style="padding:10px;text-align:center;font-size:14px;font-weight:700;color:${color};">${pct}%</td>
                        <td style="padding:10px;text-align:center;font-size:12px;color:${color};">${grade}</td>
                        <td style="padding:10px;text-align:right;font-size:11px;color:#aaaaaa;">${r.time}</td>
                    </tr>`;
    }).join('')}
            </tbody>
        </table>`;
}

function backFromResult() {
    document.getElementById('quizResultView').style.display = 'none';
    document.getElementById('quizCreateSection').style.display = 'block';
}

function editQuiz(id) {
    const quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) return;

    document.getElementById('quiz-title').value = quiz.title;
    document.getElementById('quiz-subject').value = quiz.subject;
    document.getElementById('quiz-datetime').value = quiz.datetime;
    document.getElementById('quiz-timelimit').value = quiz.timelimit;
    document.getElementById('quiz-key').value = quiz.key;
    document.getElementById('editingQuizId').value = id;
    document.getElementById('scheduleBtn').textContent = 'Update Quiz';

    questionCount = 0;
    document.getElementById('questionsContainer').innerHTML = '';

    quiz.questions.forEach(q => {
        addQuestion();
        const num = questionCount;
        document.getElementById(`qtype-${num}`).value = q.type;
        updateQuestionType(num);
        document.getElementById(`qtext-${num}`).value = q.text;
        if (document.getElementById(`qans-${num}`)) {
            document.getElementById(`qans-${num}`).value = q.answer;
        }
        if (q.type === 'mcq' && q.options) {
            if (document.getElementById(`qa-${num}`)) document.getElementById(`qa-${num}`).value = q.options.A || '';
            if (document.getElementById(`qb-${num}`)) document.getElementById(`qb-${num}`).value = q.options.B || '';
            if (document.getElementById(`qc-${num}`)) document.getElementById(`qc-${num}`).value = q.options.C || '';
            if (document.getElementById(`qd-${num}`)) document.getElementById(`qd-${num}`).value = q.options.D || '';
        }
    });

    document.querySelector('.dash-card').scrollIntoView({ behavior: 'smooth' });
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
            <select id="qtype-${questionCount}" onchange="updateQuestionType(${questionCount})" 
            style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,149,255,0.2);border-radius:8px;color:white;font-size:14px;outline:none;">
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
        </div>`;
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
            <div class="input-group"><label>Correct Answer</label><input type="text" id="qans-${num}" placeholder="e.g. A"></div>`;
    } else if (type === 'fib' || type === 'oneword') {
        optionsDiv.innerHTML = `<div class="input-group"><label>Answer</label><input type="text" id="qans-${num}" placeholder="Answer"></div>`;
    } else if (type === 'short') {
        optionsDiv.innerHTML = `<div class="input-group"><label>Model Answer</label><textarea id="qans-${num}" placeholder="Model answer..." style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,149,255,0.2);border-radius:8px;color:white;font-size:14px;outline:none;resize:none;height:60px;"></textarea></div>`;
    }
}

function removeQuestion(num) {
    document.getElementById(`question-${num}`).remove();
}

function createQuiz() {
    const editingId = document.getElementById('editingQuizId').value;
    const title = document.getElementById('quiz-title').value.trim();
    const subject = document.getElementById('quiz-subject').value.trim();
    const datetime = document.getElementById('quiz-datetime').value;
    const timelimit = document.getElementById('quiz-timelimit').value;
    const key = document.getElementById('quiz-key').value.trim();
    const classCode = document.getElementById('selectedQuizClassCode').value;

    if (title === '' || subject === '' || datetime === '' || key === '' || timelimit === '') {
        alert('Please fill all fields!');
        return;
    }

    const questions = [];
    const blocks = document.querySelectorAll('.question-block');

    blocks.forEach(block => {
        const num = block.id.split('-')[1];
        const type = document.getElementById(`qtype-${num}`).value;
        const text = document.getElementById(`qtext-${num}`).value.trim();
        const ans = document.getElementById(`qans-${num}`)?.value.trim() || '';
        if (text === '') return;
        const q = { type, text, answer: ans };
        if (type === 'mcq') {
            q.options = {
                A: document.getElementById(`qa-${num}`)?.value || '',
                B: document.getElementById(`qb-${num}`)?.value || '',
                C: document.getElementById(`qc-${num}`)?.value || '',
                D: document.getElementById(`qd-${num}`)?.value || '',
            };
        }
        questions.push(q);
    });

    if (questions.length === 0) {
        alert('Please add at least one question!');
        return;
    }

    let quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');

    if (editingId) {
        quizzes = quizzes.filter(q => q.id !== parseInt(editingId));
    }

    const newQuiz = {
        id: editingId ? parseInt(editingId) : Date.now(),
        title, subject, datetime,
        timelimit: parseInt(timelimit),
        key, classCode,
        questions,
        teacher: localStorage.getItem('name') || 'Teacher',
        time: new Date().toLocaleString()
    };

    quizzes.unshift(newQuiz);
    localStorage.setItem('teacherQuizzes', JSON.stringify(quizzes));

    if (!editingId) {
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
    }

    alert(editingId ? 'Quiz updated!' : 'Quiz scheduled!');

    document.getElementById('quiz-title').value = '';
    document.getElementById('quiz-subject').value = '';
    document.getElementById('quiz-datetime').value = '';
    document.getElementById('quiz-timelimit').value = '';
    document.getElementById('quiz-key').value = '';
    document.getElementById('editingQuizId').value = '';
    document.getElementById('scheduleBtn').textContent = 'Schedule Quiz';
    questionCount = 0;
    document.getElementById('questionsContainer').innerHTML = '';
    addQuestion();
    loadQuizSections(classCode);
}

function deleteQuiz(id, code) {
    if (!confirm('Delete this quiz?')) return;
    let quizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    quizzes = quizzes.filter(q => q.id !== id);
    localStorage.setItem('teacherQuizzes', JSON.stringify(quizzes));
    loadQuizSections(code);
}

function toggleSection(id) {
    const sections = ['scheduledSection', 'liveSection', 'endedSection'];
    sections.forEach(s => {
        const el = document.getElementById(s);
        if (el) {
            if (s === id) {
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            } else {
                el.style.display = 'none';
            }
        }
    });
}

function loadManageStudents(code) {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === code);
    const container = document.getElementById('manageStudentsList');

    if (!cls || cls.students.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No students joined yet.</p></div>';
        return;
    }

    const blockedStudents = JSON.parse(localStorage.getItem('blockedStudents') || '[]');
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const sortedStudents = [...cls.students].sort();

    container.innerHTML = sortedStudents.map(student => {
        const isBlocked = blockedStudents.includes(student);
        const dateKeys = Object.keys(attendance).filter(k => k.startsWith(code));
        let present = 0;
        dateKeys.forEach(key => {
            if (attendance[key][student] === 'present') present++;
        });
        const pct = dateKeys.length === 0 ? 0 : Math.round((present / dateKeys.length) * 100);
        let dotColor = pct >= 80 ? '#00cc66' : pct >= 75 ? '#ffcc00' : '#ff4444';

        return `
        <div class="class-card">
            <div class="class-info" style="display:flex;align-items:center;gap:10px;">
                <div class="doubt-dot" style="background:${dotColor};box-shadow:0 0 6px ${dotColor};flex-shrink:0;"></div>
                <div>
                    <h3>${student}</h3>
                    <p>Attendance: ${pct}% (${present}/${dateKeys.length})</p>
                </div>
            </div>
            <button class="attendance-btn ${isBlocked ? 'absent-active' : 'present-active'}" 
                onclick="toggleBlockStudent('${student}', '${code}')">
                ${isBlocked ? '🚫 Blocked' : '✅ Allowed'}
            </button>
        </div>`;
    }).join('');
}

function toggleBlockStudent(student, code) {
    let blocked = JSON.parse(localStorage.getItem('blockedStudents') || '[]');
    if (blocked.includes(student)) {
        blocked = blocked.filter(s => s !== student);
    } else {
        blocked.push(student);
    }
    localStorage.setItem('blockedStudents', JSON.stringify(blocked));
    loadManageStudents(code);
}

function applyAttendanceRestriction(code) {
    const minPct = parseInt(document.getElementById('minAttendance').value);
    if (isNaN(minPct) || minPct < 0 || minPct > 100) {
        alert('Please enter a valid percentage (0-100)');
        return;
    }
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === code);
    if (!cls) return;

    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    let blocked = JSON.parse(localStorage.getItem('blockedStudents') || '[]');

    cls.students.forEach(student => {
        const dateKeys = Object.keys(attendance).filter(k => k.startsWith(code));
        let present = 0;
        dateKeys.forEach(key => {
            if (attendance[key][student] === 'present') present++;
        });
        const pct = dateKeys.length === 0 ? 0 : Math.round((present / dateKeys.length) * 100);
        if (pct < minPct) {
            if (!blocked.includes(student)) blocked.push(student);
        } else {
            blocked = blocked.filter(s => s !== student);
        }
    });

    localStorage.setItem('blockedStudents', JSON.stringify(blocked));
    loadManageStudents(code);
    alert(`Applied! Students below ${minPct}% attendance are blocked.`);
}

function allowPresentOnly(code) {
    const today = new Date().toISOString().split('T')[0];
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const dateKey = `${code}_${today}`;
    const todayAttendance = attendance[dateKey] || {};
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === code);
    if (!cls) return;

    let blocked = JSON.parse(localStorage.getItem('blockedStudents') || '[]');
    cls.students.forEach(student => {
        const status = todayAttendance[student] || 'absent';
        if (status === 'absent') {
            if (!blocked.includes(student)) blocked.push(student);
        } else {
            blocked = blocked.filter(s => s !== student);
        }
    });

    localStorage.setItem('blockedStudents', JSON.stringify(blocked));
    loadManageStudents(code);
    alert('Only students present today can attempt the quiz!');
}

function clearAllBlocks() {
    localStorage.setItem('blockedStudents', JSON.stringify([]));
    const code = document.getElementById('selectedQuizClassCode').value;
    loadManageStudents(code);
    alert('All students unblocked!');
}