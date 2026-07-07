document.addEventListener('DOMContentLoaded', function() {
    loadStudentClassList();
});

function loadStudentClassList() {
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const container = document.getElementById('studentClassList');

    if (myClasses.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes joined yet.</p></div>';
        return;
    }

    const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
    const seenDoubts = JSON.parse(localStorage.getItem('seenDoubts') || '[]');

    container.innerHTML = myClasses.map(cls => {
        const classDoubts = doubts.filter(d => d.classCode === cls.code);
        const unanswered = classDoubts.filter(d => d.answer === '').length;
        const answeredUnseen = classDoubts.filter(d => d.answer !== '' && !seenDoubts.includes(d.id)).length;

        let glowClass = '';
        let dotClass = '';
        let countLabel = '';

        if (unanswered > 0) {
            glowClass = 'has-doubt';
            dotClass = 'yellow';
            countLabel = `<span class="unanswered-count">${unanswered} pending</span>`;
        } else if (answeredUnseen > 0) {
            glowClass = 'doubt-answered-class';
            dotClass = 'green';
            countLabel = `<span class="answered-count">${answeredUnseen} answered</span>`;
        }

        return `
        <div class="class-card ${glowClass}" onclick="openStudentClassDoubts('${cls.code}', '${cls.name}')">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.teacher} · ${classDoubts.length} doubts</p>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
                ${countLabel}
                ${dotClass ? `<div class="doubt-dot ${dotClass}"></div>` : ''}
            </div>
        </div>`;
    }).join('');
}

function openStudentClassDoubts(code, name) {
    document.getElementById('studentClassList').style.display = 'none';
    document.getElementById('studentDoubtSection').style.display = 'block';
    document.getElementById('selectedStudentClass').textContent = name;
    document.getElementById('selectedClassCode').value = code;
    loadClassDoubts(code);
}

function loadClassDoubts(code) {
    const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
    const classDoubts = doubts.filter(d => d.classCode === code);
    const seenDoubts = JSON.parse(localStorage.getItem('seenDoubts') || '[]');
    const container = document.getElementById('doubtsList');

    if (classDoubts.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No doubts in this class yet.</p></div>';
        return;
    }

    container.innerHTML = classDoubts.map(d => {
        const isSeen = seenDoubts.includes(d.id);
        const hasAnswer = d.answer !== '';

        let glowClass = '';
        let dotClass = '';

        if (!hasAnswer) {
            glowClass = 'doubt-pending';
            dotClass = 'yellow';
        } else if (hasAnswer && !isSeen) {
            glowClass = 'doubt-answered';
            dotClass = 'green';
        }

        return `
        <div class="doubt-card ${glowClass}" onclick="markAsSeen(${d.id}, '${code}')">
            <div class="doubt-header">
                <span class="doubt-name">${d.name}</span>
                <span class="doubt-subject">${d.subject}</span>
                <span class="doubt-time">${d.time}</span>
                ${dotClass ? `<div class="doubt-dot ${dotClass}" style="margin-left:auto;"></div>` : ''}
            </div>
            <p class="doubt-text">${d.text}</p>
            ${d.answer ?
                `<div class="doubt-answer"><strong>Teacher:</strong> ${d.answer}</div>` :
                '<p class="no-answer">Pending answer...</p>'
            }
        </div>`;
    }).join('');
}

function markAsSeen(id, code) {
    const seenDoubts = JSON.parse(localStorage.getItem('seenDoubts') || '[]');
    if (!seenDoubts.includes(id)) {
        seenDoubts.push(id);
        localStorage.setItem('seenDoubts', JSON.stringify(seenDoubts));
    }
    loadClassDoubts(code);
    loadStudentClassList();
}

function postDoubt() {
    const code = document.getElementById('selectedClassCode').value;
    const subject = document.getElementById('doubt-subject').value.trim();
    const text = document.getElementById('doubt-text').value.trim();
    const isAnonymous = document.getElementById('anonymous-check').checked;
    const name = isAnonymous ? 'Anonymous' : (localStorage.getItem('name') || 'Student');

    if (text === '' || subject === '') {
        alert('Please fill all fields!');
        return;
    }

    const doubts = JSON.parse(localStorage.getItem('doubts') || '[]');
    doubts.unshift({
        id: Date.now(),
        classCode: code,
        text: text,
        subject: subject,
        name: name,
        time: new Date().toLocaleString(),
        answer: ''
    });

    localStorage.setItem('doubts', JSON.stringify(doubts));
    document.getElementById('doubt-text').value = '';
    document.getElementById('doubt-subject').value = '';
    loadClassDoubts(code);
    loadStudentClassList();
}

function backToStudentClasses() {
    document.getElementById('studentClassList').style.display = 'block';
    document.getElementById('studentDoubtSection').style.display = 'none';
    loadStudentClassList();
}