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
        <div class="class-card">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.students.length} students</p>
            </div>
            <div style="display:flex;gap:8px;">
                <button class="btn-outline" onclick="viewRecords('${cls.code}', '${cls.name}')" 
                style="padding:6px 14px;font-size:12px;">📋 Records</button>
                <button class="btn-primary" onclick="openAttendanceClass('${cls.code}', '${cls.name}')" 
                style="padding:6px 14px;font-size:12px;">Mark ✓</button>
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
        const status = todayAttendance[student] || 'none';
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

function doneAttendance() {
    document.getElementById('attendanceSection').style.display = 'none';
    document.getElementById('attendanceClassList').style.display = 'block';
    loadAttendanceClasses();
}

function backToAttendanceClasses() {
    document.getElementById('attendanceSection').style.display = 'none';
    document.getElementById('attendanceClassList').style.display = 'block';
    loadAttendanceClasses();
}

function viewRecords(code, name) {
    document.getElementById('attendanceClassList').style.display = 'none';
    document.getElementById('recordsSection').style.display = 'block';
    document.getElementById('recordsClassName').textContent = name;
    loadDateRecords(code);
}

function loadDateRecords(code) {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === code);
    const container = document.getElementById('recordsList');

    const dateKeys = Object.keys(attendance).filter(k => k.startsWith(code));

    if (dateKeys.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No attendance records yet.</p></div>';
        return;
    }

    const dates = dateKeys.map(k => k.replace(`${code}_`, '')).sort().reverse();

    container.innerHTML = dates.map(date => {
        const dateKey = `${code}_${date}`;
        const dayAttendance = attendance[dateKey] || {};
        const students = cls ? [...cls.students].sort() : [];
        const presentCount = Object.values(dayAttendance).filter(s => s === 'present').length;
        const total = students.length;
        const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

        return `
        <div class="class-card" onclick="openDateRecord('${code}', '${date}')" style="cursor:pointer;">
            <div class="class-info">
                <h3>📅 ${date}</h3>
                <p>${presentCount}/${total} Present · ${pct}%</p>
            </div>
            <span style="color:#aaaaaa;font-size:12px;">View →</span>
        </div>`;
    }).join('');
}

function openDateRecord(code, date) {
    document.getElementById('recordsSection').style.display = 'none';
    document.getElementById('dateRecordSection').style.display = 'block';
    document.getElementById('dateRecordTitle').textContent = `📅 ${date}`;

    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === code);
    const dateKey = `${code}_${date}`;
    const dayAttendance = attendance[dateKey] || {};
    const students = cls ? [...cls.students].sort() : [];
    const presentCount = Object.values(dayAttendance).filter(s => s === 'present').length;
    const total = students.length;
    const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    document.getElementById('dateRecordContent').innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <p style="font-size:14px;color:#aaaaaa;">Total: ${total} students</p>
            <p style="font-size:20px;font-weight:700;color:#0095ff;">${presentCount}/${total} Present</p>
        </div>
        <div style="width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;margin-bottom:24px;">
            <div style="width:${pct}%;height:100%;background:#0095ff;border-radius:99px;"></div>
        </div>
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                    <th style="text-align:left;padding:10px;font-size:12px;color:#aaaaaa;">#</th>
                    <th style="text-align:left;padding:10px;font-size:12px;color:#aaaaaa;">Student</th>
                    <th style="text-align:right;padding:10px;font-size:12px;color:#aaaaaa;">Status</th>
                </tr>
            </thead>
            <tbody>
                ${students.map((student, i) => {
                    const status = dayAttendance[student] || 'absent';
                    return `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px;font-size:13px;color:#aaaaaa;">${i+1}</td>
                        <td style="padding:10px;font-size:13px;color:white;">${student}</td>
                        <td style="padding:10px;text-align:right;">
                            <span style="font-size:12px;padding:4px 12px;border-radius:99px;
                            ${status === 'present' ? 
                                'background:rgba(0,204,102,0.1);color:#00cc66;border:1px solid rgba(0,204,102,0.3);' : 
                                'background:rgba(255,68,68,0.1);color:#ff4444;border:1px solid rgba(255,68,68,0.3);'}">
                                ${status === 'present' ? '✅ Present' : '❌ Absent'}
                            </span>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
}

function backFromDateRecord() {
    document.getElementById('dateRecordSection').style.display = 'none';
    document.getElementById('recordsSection').style.display = 'block';
}

function toggleDateRecord(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function backFromRecords() {
    document.getElementById('recordsSection').style.display = 'none';
    document.getElementById('attendanceClassList').style.display = 'block';
    loadAttendanceClasses();
}