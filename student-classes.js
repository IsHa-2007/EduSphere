document.addEventListener('DOMContentLoaded', function() {
    loadJoinedClasses();
});

function joinClass() {
    const code = document.getElementById('joinCode').value.trim().toUpperCase();
    if (code === '') {
        alert('Please enter a class code!');
        return;
    }

    const teacherClasses = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const foundClass = teacherClasses.find(c => c.code === code);

    if (!foundClass) {
        alert('Invalid code! No class found.');
        return;
    }

    let myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const alreadyJoined = myClasses.find(c => c.code === code);

    if (alreadyJoined) {
        alert('You already joined this class!');
        return;
    }

    myClasses.push(foundClass);
    localStorage.setItem('myClasses', JSON.stringify(myClasses));

    const studentName = localStorage.getItem('name') || 'Student';
    if (!foundClass.students.includes(studentName)) {
        foundClass.students.push(studentName);
        localStorage.setItem('teacherClasses', JSON.stringify(teacherClasses));
    }

    // log activity
    logActivity('🏫', `Joined class ${foundClass.name}`, foundClass.subject);

    alert(`Joined ${foundClass.name} successfully!`);
    document.getElementById('joinCode').value = '';
    loadJoinedClasses();
}

function exitClass(code) {
    if (!confirm('Are you sure you want to exit this class?')) return;

    let myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    myClasses = myClasses.filter(c => c.code !== code);
    localStorage.setItem('myClasses', JSON.stringify(myClasses));

    // remove from teacher class students list
    const studentName = localStorage.getItem('name') || '';
    let teacherClasses = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    teacherClasses = teacherClasses.map(cls => {
        if (cls.code === code) {
            cls.students = cls.students.filter(s => s !== studentName);
        }
        return cls;
    });
    localStorage.setItem('teacherClasses', JSON.stringify(teacherClasses));
    loadJoinedClasses();
}

function loadJoinedClasses() {
    const container = document.getElementById('joinedClasses');
    if (!container) return;

    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');

    if (myClasses.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes joined yet.</p></div>';
        return;
    }

    container.innerHTML = myClasses.map(cls => `
        <div class="class-card">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.teacher}</p>
            </div>
            <button class="attendance-btn absent-active" onclick="exitClass('${cls.code}')" style="font-size:12px;">
                🚪 Exit
            </button>
        </div>
    `).join('');
}

function logActivity(icon, text, sub) {
    // stored for activity page
    const activities = JSON.parse(localStorage.getItem('studentActivities') || '[]');
    activities.unshift({ icon, text, sub, time: new Date().toLocaleString() });
    localStorage.setItem('studentActivities', JSON.stringify(activities));
}