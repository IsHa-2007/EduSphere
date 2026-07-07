document.addEventListener('DOMContentLoaded', function() {
    loadTeacherClasses();
});

function loadTeacherClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('teacherClassList');

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes created yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => {
        const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
        const classDoubts = doubts.filter(d => d.classCode === cls.code);
        const unanswered = classDoubts.filter(d => d.answer === '').length;
        const hasUnanswered = unanswered > 0;

        return `
        <div class="class-card ${hasUnanswered ? 'has-doubt' : ''}" onclick="openClassDoubts('${cls.code}', '${cls.name}')">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${classDoubts.length} doubts</p>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
                ${hasUnanswered ? `<span class="unanswered-count">${unanswered} unanswered</span>` : ''}
                <div class="doubt-dot ${hasUnanswered ? 'yellow' : 'green'}"></div>
            </div>
        </div>`;
    }).join('');
}

function openClassDoubts(code, name) {
    document.getElementById('teacherClassList').style.display = 'none';
    document.getElementById('classDoubtSection').style.display = 'block';
    document.getElementById('selectedClassName').textContent = name;

    const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
    const classDoubts = doubts.filter(d => d.classCode === code);
    const container = document.getElementById('teacherDoubtsList');

    if (classDoubts.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No doubts in this class.</p></div>';
        return;
    }

    container.innerHTML = classDoubts.map((d, index) => `
        <div class="doubt-card">
            <div class="doubt-header">
                <span class="doubt-name">${d.name}</span>
                <span class="doubt-subject">${d.subject}</span>
                <span class="doubt-time">${d.time}</span>
            </div>
            <p class="doubt-text">${d.text}</p>
            ${d.answer ?
                `<div class="doubt-answer"><strong>Your answer:</strong> ${d.answer}</div>` :
                `<div style="margin-top:12px;">
                    <input type="text" id="answer-${d.id}" placeholder="Write your answer..." 
                    style="width:100%;padding:8px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(0,149,255,0.2);border-radius:8px;color:white;font-size:13px;outline:none;margin-bottom:8px;">
                    <button class="btn-primary" onclick="answerDoubt(${d.id})" style="padding:6px 16px;font-size:13px;">Answer</button>
                </div>`
            }
        </div>
    `).join('');
}

function answerDoubt(id) {
    const answer = document.getElementById(`answer-${id}`).value.trim();
    if (answer === '') {
        alert('Please write an answer!');
        return;
    }

    const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
    const doubt = doubts.find(d => d.id === id);
    if (doubt) {
        doubt.answer = answer;
        localStorage.setItem('doubts', JSON.stringify(doubts));
        loadTeacherClasses();
        const code = doubt.classCode;
        const name = document.getElementById('selectedClassName').textContent;
        openClassDoubts(code, name);
    }
}
function backToClasses() {
    document.getElementById('teacherClassList').style.display = 'block';
    document.getElementById('classDoubtSection').style.display = 'none';
    loadTeacherClasses();
}