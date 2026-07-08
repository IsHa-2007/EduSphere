document.addEventListener('DOMContentLoaded', function() {
    loadAttendanceClasses();
});

function loadAttendanceClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('attendanceClassList');

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes created yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => `
        <div class="class-card" onclick="openAttendanceClass('${cls.code}', '${cls.name}')">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.students.length} students</p>
            </div>
        </div>
    `).join('');
}

function openAttendanceClass(code, name) {
    document.getElementById('attendanceClassList').style.display = 'none';
    document.getElementById('attendanceSection').style.display = 'block';
    document.getElementById('attendanceClassName').textContent = name;
    document.getElementById('attendanceClassCode').value = code;

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendance-date').value = today;

    loadStudentsForAttendance(code);
}

function loadStudentsForAttendance(code) {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === code);
    const container = document.getElementById('studentAttendanceList');

    if (!cls || cls.students.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No students joined yet.</p></div>';
        return;
    }

    const date = document.getElementById('attendance-date').value;
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const dateKey = `${code}_${date}`;
    const todayAttendance = attendance[dateKey] || {};

    const sortedStudents = [...cls.students].sort();

    container.innerHTML = sortedStudents.map(student => {
        const status = todayAttendance[student] || 'absent';
        return `
        <div class="class-card">
            <div class="class-info">
                <h3>${student}</h3>
            </div>
            <div style="display:flex;gap:8px;">
                <button class="attendance-btn ${status === 'present' ? 'present-active' : ''}" 
                    onclick="markAttendance('${student}', 'present', '${code}')">✅ Present</button>
                <button class="attendance-btn ${status === 'absent' ? 'absent-active' : ''}"
                    onclick="markAttendance('${student}', 'absent', '${code}')">❌ Absent</button>
            </div>
        </div>`;
    }).join('');
}

function markAttendance(student, status, code) {
    const date = document.getElementById('attendance-date').value;
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const dateKey = `${code}_${date}`;

    if (!attendance[dateKey]) attendance[dateKey] = {};
    attendance[dateKey][student] = status;

    localStorage.setItem('attendance', JSON.stringify(attendance));
    loadStudentsForAttendance(code);
}

function backToAttendanceClasses() {
    document.getElementById('attendanceClassList').style.display = 'block';
    document.getElementById('attendanceSection').style.display = 'none';
    loadAttendanceClasses();
}
function doneAttendance() {
    window.location.href = 'teacher-attendance-records.html';
}