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

    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const alreadyJoined = myClasses.find(c => c.code === code);

    if (alreadyJoined) {
        alert('You already joined this class!');
        return;
    }

    myClasses.push(foundClass);
    localStorage.setItem('myClasses', JSON.stringify(myClasses));

    const studentName = localStorage.getItem('name') || 'Student';
    foundClass.students.push(studentName);
    localStorage.setItem('teacherClasses', JSON.stringify(teacherClasses));

    alert(`Joined ${foundClass.name} successfully!`);
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
    </div>
`).join('');
}